import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Customer from "../models/Customer";
import Cart from "../models/Cart";

export const GetCustomerList = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find();
    return res.status(200).json({
      success: true,
      customers: customers,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const DeleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundCustomer = await Customer.findById(id);
    if (foundCustomer) {
      await Customer.findByIdAndDelete(id);
      await Cart.findOneAndDelete({ customer: foundCustomer._id });
      return res.status(200).json({ success: true });
    } else res.status(404).json({ message: "Not customer found" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const EditCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name, phone, password, address, points } = req.body;

    const foundCustomer: any = await Customer.findById(id);
    if (foundCustomer) {
      const newPoints = points ? points : foundCustomer.points;
      const newPassword = password
        ? await bcrypt.hash(password, 10)
        : foundCustomer.password;

      const updatedCustomer: any = await Customer.findByIdAndUpdate(
        id,
        {
          email: email,
          name: name,
          phone: phone,
          address: address,
          points: newPoints,
          password: newPassword,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        customer: {
          _id: updatedCustomer._id,
          email: updatedCustomer.email,
          name: updatedCustomer.name,
          phone: updatedCustomer.phone,
          address: updatedCustomer.address,
          points: updatedCustomer.points,
        },
      });
    } else return res.status(404).json({ message: "Customer not found" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const CreateCustomer = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, address, points } = req.body;

    const newPassword = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({
      email: email,
      name: name,
      phone: phone,
      address: address,
      points: points,
      password: newPassword,
    });

    const savedCustomer = await newCustomer.save();
    return res.status(200).json({
      success: true,
      customer: {
        _id: savedCustomer._id,
        email: savedCustomer.email,
        name: savedCustomer.name,
        phone: phone,
        address: address,
        points: points,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const CustomerController = {
  GetCustomerList,
  DeleteCustomer,
  EditCustomer,
  CreateCustomer,
};
