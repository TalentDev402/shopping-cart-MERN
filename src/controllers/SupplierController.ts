import { Request, Response } from "express";
import Supplier from "../models/Supplier";
import path from "path";
import multer from "multer";
import fs from "fs";

const SupplierLogoStorage = multer.diskStorage({
  destination: "./public/img/",
  filename: (req, file, cb) => {
    cb(null, "logo-" + Date.now() + path.extname(file.originalname));
  },
});

const UploadUserLogo = multer({
  storage: SupplierLogoStorage,
  limits: { fileSize: 150 * 1024 * 1024 },
}).single("file");

export const UploadLogo = async (req: any, res: any) => {
  UploadUserLogo(req, res, () => {
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

const SupplierFileStorage = multer.diskStorage({
  destination: "./public/file/",
  filename: (req, file, cb) => {
    cb(null, "file-" + Date.now() + path.extname(file.originalname));
  },
});

const UploadRemarkFile = multer({
  storage: SupplierFileStorage,
  limits: { fileSize: 150 * 1024 * 1024 },
}).single("file");

export const UploadFile = async (req: any, res: any) => {
  UploadRemarkFile(req, res, () => {
    try {
      return res.status(200).json({
        success: true,
        path: "file/" + req.file?.filename,
      });
    } catch (err) {
      return res.status(500).json({ message: "File uploading error!" });
    }
  });
};

const CreateSupplier = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newSupplier = new Supplier(data);

    const savedSupplier = await newSupplier.save();
    return res.status(200).json({
      success: true,
      supplier: savedSupplier,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetSupplierList = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find();
    return res.status(200).json({
      success: true,
      suppliers: suppliers,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const DeleteSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundSupplier: any = await Supplier.findById(id);
    if (foundSupplier) {
      if (foundSupplier.logo) {
        const filePath = "public/" + foundSupplier.logo;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }

      if (foundSupplier.remarks?.type === "FILE") {
        const filePath = "public/" + foundSupplier.remarks?.content;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }

      await Supplier.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } else res.status(404).json({ message: "Not supplier found" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const EditSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const foundSupplier: any = await Supplier.findById(id);
    if (foundSupplier) {
      if (data.logo && foundSupplier.logo) {
        const filePath = "public/" + foundSupplier.logo;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }

      if (
        foundSupplier.remarks.type === "FILE" &&
        data.remarks.content !== foundSupplier.remarks.content
      ) {
        const filePath = "public/" + foundSupplier.remarks.content;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }

      const updatedSupplier: any = await Supplier.findByIdAndUpdate(id, data, {
        new: true,
      });
      return res.status(200).json({
        success: true,
        supplier: updatedSupplier,
      });
    } else return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const SupplierController = {
  CreateSupplier,
  DeleteSupplier,
  EditSupplier,
  UploadLogo,
  UploadFile,
  GetSupplierList,
};
