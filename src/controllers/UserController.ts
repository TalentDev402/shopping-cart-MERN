import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import path from "path";
import multer from "multer";
import fs from "fs";

const CreateSuperAdmin = async () => {
  try {
    const superAdmin = await User.findOne({
      role: "SUPER_ADMIN",
    });

    if (!superAdmin) {
      const newPassword = await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD as string,
        10
      );
      const newUser = new User({
        email: "super@admin.com",
        firstName: "Super",
        lastName: "Admin",
        password: newPassword,
        role: "SUPER_ADMIN",
        status: true,
      });

      await newUser.save();
    }
  } catch (err) {
    console.log(err);
  }
};

const UserAvatarStorage = multer.diskStorage({
  destination: "./public/img/",
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + path.extname(file.originalname));
  },
});

const UploadUserAvatar = multer({
  storage: UserAvatarStorage,
  limits: { fileSize: 150 * 1024 * 1024 },
}).single("file");

export const UploadAvatar = async (req: any, res: any) => {
  UploadUserAvatar(req, res, () => {
    try {
      return res.status(200).json({
        success: true,
        path: "img/" + req.file?.filename,
      });
    } catch (err) {
      return res.status(500).json({ message: "File uploading error!" });
    }
  });
};

const CreateUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password, role, status, avatar } =
      req.body;

    const newPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email,
      firstName: firstName,
      lastName: lastName,
      status: status,
      role: role,
      avatar: avatar,
      password: newPassword,
    });

    const savedUser = await newUser.save();
    return res.status(200).json({
      success: true,
      user: {
        _id: savedUser._id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        status: savedUser.status,
        avatar: savedUser.avatar,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetUserList = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "ADMIN" }).select({
      firstName: 1,
      lastName: 1,
      role: 1,
      status: 1,
      email: 1,
      avatar: 1,
    });
    return res.status(200).json({
      success: true,
      users: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const DeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundUser = await User.findById(id);
    if (foundUser) {
      if (foundUser.avatar && !foundUser.avatar.includes("https")) {
        const filePath = "public/" + foundUser.avatar;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }
      await User.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } else res.status(404).json({ message: "Not user found" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const EditUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName, password, role, status, avatar } =
      req.body;

    const foundUser: any = await User.findById(id);
    if (foundUser) {
      const newPassword = password
        ? await bcrypt.hash(password, 10)
        : foundUser.password;

      if (avatar && foundUser.avatar && !foundUser.avatar.includes("https")) {
        const filePath = "public/" + foundUser.avatar;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }

      const updatedUser: any = await User.findByIdAndUpdate(
        id,
        {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: newPassword,
          role: role,
          status: status,
          avatar: avatar ? avatar : foundUser.avatar,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        user: {
          _id: updatedUser._id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          status: updatedUser.status,
          avatar: updatedUser.avatar,
        },
      });
    } else return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const UserController = {
  CreateSuperAdmin,
  CreateUser,
  DeleteUser,
  EditUser,
  UploadAvatar,
  GetUserList,
};
