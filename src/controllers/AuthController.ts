import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";
import User from "../models/User";
import Customer from "../models/Customer";
import { EXPIRE_IN } from "../utils/constants";
import Provider from "../models/Provider";

const AdminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const foundUser: any = await User.findOne({ email: email });
    if (foundUser) {
      const isValidPassword = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (isValidPassword) {
        if (foundUser.status === false) {
          return res.status(401).json({ message: "User is not allowed" });
        }

        const payload = {
          id: foundUser._id,
          role: foundUser.role,
          exp: Math.floor(Date.now() / 1000) + EXPIRE_IN,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
          algorithm: "HS256",
        });
        return res
          .status(200)
          .json({ message: "Login successful", token: token });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      return res.status(404).json({ message: "Email not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const AdminChangePassword = async (req: Request, res: Response) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const foundUser: any = await User.findOne({ _id: userId });
    if (foundUser) {
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        foundUser.password
      );
      if (isValidPassword) {
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        foundUser.password = newPasswordHash;
        await foundUser.save();
        return res
          .status(200)
          .json({ message: "Password Changed Successfully", success: true });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      return res.status(404).json({ message: "Email not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetCurrentUser = async (req: Request, res: Response) => {
  try {
    const { userId, userRole } = req.body;
    if (userRole) {
      const user: any = await User.findById(userId).select({
        email: 1,
        firstName: 1,
        lastName: 1,
        role: 1,
        avatar: 1,
      });

      if (user) {
        return res.status(200).json({
          success: true,
          user: user,
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      const customer: any = await Customer.findById(userId).select({
        email: 1,
        name: 1,
        phone: 1,
        address: 1,
        points: 1,
      });
      if (customer) {
        return res.status(200).json({
          success: true,
          user: customer,
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const CustomerLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const foundCustomer: any = await Customer.findOne({ email: email });
    if (foundCustomer) {
      const isValidPassword = await bcrypt.compare(
        password,
        foundCustomer.password
      );
      if (isValidPassword) {
        if (foundCustomer.status === false) {
          return res.status(401).json({ message: "User is not allowed" });
        }

        const payload = {
          id: foundCustomer._id,
          exp: Math.floor(Date.now() / 1000) + EXPIRE_IN,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
          algorithm: "HS256",
        });
        return res
          .status(200)
          .json({ message: "Login successful", token: token });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      return res.status(404).json({ message: "Email not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const CustomerRegister = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, address } = req.body;
    const foundCustomer: any = await Customer.findOne({ email: email });
    if (foundCustomer) {
      return res.status(404).json({ message: "Email already exists" });
    } else {
      const newPassword = await bcrypt.hash(password, 10);
      const newCustomer = new Customer({
        email: email,
        name: name,
        password: newPassword,
        phone: phone,
        address: address,
      });
      await newCustomer.save();
      return res
        .status(200)
        .json({ message: "Register successful", success: true });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const CustomerGoogleAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { data } = userInfo;

    const customer = await Customer.findOne({ email: data.email });
    if (customer) {
      const provider = await Provider.findOne({
        customer: customer._id,
        provider: "Google",
        uid: data.sub,
      });
      if (!provider) {
        const newProvider = new Provider({
          customer: customer._id,
          provider: "Google",
          uid: data.sub,
        });
        await newProvider.save();
      }
      const payload = {
        id: customer._id,
        exp: Math.floor(Date.now() / 1000) + EXPIRE_IN,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
        algorithm: "HS256",
      });
      return res
        .status(200)
        .json({ message: "Google Login successful", token: token });
    } else {
      const newCustomer = new Customer({
        email: data.email,
        name: data.name,
      });
      const savedCustomer = await newCustomer.save();
      const newProvider = new Provider({
        customer: savedCustomer._id,
        provider: "Google",
        uid: data.sub,
      });
      await newProvider.save();

      const payload = {
        id: savedCustomer._id,
        exp: Math.floor(Date.now() / 1000) + EXPIRE_IN,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
        algorithm: "HS256",
      });
      return res
        .status(200)
        .json({ message: "Google Login successful", token: token });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const AuthController = {
  AdminLogin,
  AdminChangePassword,
  CustomerLogin,
  CustomerRegister,
  GetCurrentUser,
  CustomerGoogleAuth,
};
