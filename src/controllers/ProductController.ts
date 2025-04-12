import { Request, Response } from "express";
import { Types } from "mongoose";
import Product from "../models/Product";
import fs from "fs";
import path from "path";
import multer from "multer";

const ProductPhotoStorage = multer.diskStorage({
  destination: "./public/img/",
  filename: (req, file, cb) => {
    cb(null, "product-" + Date.now() + path.extname(file.originalname));
  },
});

const UploadProductPhoto = multer({
  storage: ProductPhotoStorage,
  limits: { fileSize: 150 * 1024 * 1024 },
}).single("file");

export const UploadPhoto = async (req: any, res: any) => {
  UploadProductPhoto(req, res, () => {
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

const CreateProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const foundProduct = await Product.findOne({ itemNo: data.itemNo });
    if (foundProduct) {
      return res.status(404).json({ message: "Item No already exists" });
    } else {
      const newProduct = new Product(data);
      const savedProduct: any = await newProduct.save();
      const product = await Product.findById(savedProduct._id).populate([
        { path: "supplier", select: { _id: 1, name: 1 } },
        { path: "category.category" },
        { path: "tags" },
      ]);
      return res.status(200).json({
        success: true,
        product: product,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetProductList = async (req: Request, res: Response) => {
  try {
    const { current, size, search } = req.query;
    const skip = (Number(current) - 1) * Number(size);
    const limit = Number(size);

    const criteria =
      search !== ""
        ? {
            $or: [
              { name: new RegExp(search as string, "i") },
              { itemNo: new RegExp(search as string, "i") },
            ],
          }
        : {};
    const products = await Product.find(criteria)
      .populate([
        { path: "supplier", select: { _id: 1, name: 1 } },
        { path: "category.category" },
        { path: "tags" },
      ])
      .skip(skip)
      .limit(limit);
    const total = await Product.countDocuments(criteria);

    return res.status(200).json({
      success: true,
      products: products,
      total: total,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const DeleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundProduct: any = await Product.findById(id);
    if (foundProduct) {
      if (foundProduct.photo) {
        const filePath = "public/" + foundProduct.photo;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }

      if (foundProduct.thumbnails) {
        foundProduct.thumbnails.forEach((thumbnail: string) => {
          const filePath = "public/" + thumbnail;
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) throw err;
            });
          }
        });
      }

      await Product.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } else res.status(404).json({ message: "Not product found" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const EditProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const foundProduct: any = await Product.findById(id);
    if (foundProduct) {
      if (data.photo && foundProduct.photo) {
        const filePath = "public/" + foundProduct.photo;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }

      if (data.thumbnails) {
        const removedThumbs = foundProduct.thumbnails.filter(
          (thumbnail: string) => !data.thumbnails.includes(thumbnail)
        );
        removedThumbs.forEach((thumbnail: string) => {
          const filePath = "public/" + thumbnail;
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) throw err;
            });
          }
        });
      }

      const updatedProduct: any = await Product.findByIdAndUpdate(id, data, {
        new: true,
      }).populate([
        { path: "supplier", select: { _id: 1, name: 1 } },
        { path: "category.category" },
        { path: "tags" },
      ]);
      return res.status(200).json({
        success: true,
        product: updatedProduct,
      });
    } else return res.status(404).json({ message: "Product not found" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .select({ purchasePrice: 0, itemNo: 0 })
      .populate([
        { path: "supplier", select: { _id: 1, name: 1 } },
        { path: "category.category" },
        { path: "tags" },
      ]);
    return res.status(200).json({
      success: true,
      product: product,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetProductListForGuest = async (req: Request, res: Response) => {
  try {
    const { category, size, current, search } = req.query;
    const skip = (Number(current) - 1) * Number(size);
    const limit = Number(size);

    let products: any = [];
    let total = 0;
    if (category) {
      let id = null;
      let pos = <any>[];
      String(category)
        .split(",")
        .forEach((str: string, index: number) => {
          if (index === 0) {
            id = str;
          } else {
            pos.push(Number(str));
          }
        });

      if (pos.length > 0) {
        products = await Product.find({
          status: true,
          "category.category": id,
          $expr: {
            $eq: [
              {
                $reduce: {
                  input: { $slice: ["$category.pos", 0, pos.length] },
                  initialValue: "",
                  in: { $concat: ["$$value", { $toString: "$$this" }] },
                },
              },
              pos.map(String).join(""),
            ],
          },
          ...(search !== "" && {
            $or: [
              { name: new RegExp(search as string, "i") },
              { itemNo: new RegExp(search as string, "i") },
            ],
          }),
        })
          .sort({ itemNo: 1 })
          .select({ supplier: 0, tags: 0, purchasePrice: 0, itemNo: 0 })
          .populate([
            { path: "supplier", select: { _id: 1, name: 1 } },
            { path: "category.category" },
            { path: "tags" },
          ])
          .skip(skip)
          .limit(limit);
        total = await Product.countDocuments({
          status: true,
          "category.category": id,
          $expr: {
            $eq: [
              {
                $reduce: {
                  input: { $slice: ["$category.pos", 0, pos.length] },
                  initialValue: "",
                  in: { $concat: ["$$value", { $toString: "$$this" }] },
                },
              },
              pos.map(String).join(""),
            ],
          },
          ...(search !== "" && {
            $or: [
              { name: new RegExp(search as string, "i") },
              { itemNo: new RegExp(search as string, "i") },
            ],
          }),
        });
      } else {
        products = await Product.find({
          status: true,
          "category.category": id,
          ...(search !== "" && {
            $or: [
              { name: new RegExp(search as string, "i") },
              { itemNo: new RegExp(search as string, "i") },
            ],
          }),
        })
          .sort({ itemNo: 1 })
          .select({ supplier: 0, tags: 0, purchasePrice: 0, itemNo: 0 })
          .populate([
            { path: "supplier", select: { _id: 1, name: 1 } },
            { path: "category.category" },
            { path: "tags" },
          ])
          .skip(skip)
          .limit(limit);
        total = await Product.countDocuments({
          status: true,
          "category.category": id,
          ...(search !== "" && {
            $or: [
              { name: new RegExp(search as string, "i") },
              { itemNo: new RegExp(search as string, "i") },
            ],
          }),
        });
      }
    } else {
      products = await Product.find({
        status: true,
        ...(search !== "" && {
          $or: [
            { name: new RegExp(search as string, "i") },
            { itemNo: new RegExp(search as string, "i") },
          ],
        }),
      })
        .sort({ itemNo: 1 })
        .populate([
          { path: "supplier", select: { _id: 1, name: 1 } },
          { path: "category.category" },
          { path: "tags" },
        ])
        .skip(skip)
        .limit(limit);
      total = await Product.countDocuments({
        status: true,
        ...(search !== "" && {
          $or: [
            { name: new RegExp(search as string, "i") },
            { itemNo: new RegExp(search as string, "i") },
          ],
        }),
      });
    }
    return res.status(200).json({
      success: true,
      products: products,
      total: total,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetDisplayList = async (req: Request, res: Response) => {
  try {
    const { tag } = req.query;
    const products = await Product.find({
      status: true,
      tags: { $in: [new Types.ObjectId(String(tag))] },
    }).select({
      supplier: 0,
      category: 0,
      tags: 0,
      purchasePrice: 0,
      itemNo: 0,
    });
    return res.status(200).json({
      success: true,
      products: products,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetAlertList = async (req: Request, res: Response) => {
  try {
    const { size, current } = req.query;
    const skip = (Number(current) - 1) * Number(size);
    const limit = Number(size);

    const products = await Product.find({
      $expr: { $gt: ["$alertQuantity", "$quantity"] },
    })
      .populate([
        { path: "supplier", select: { _id: 1, name: 1 } },
        { path: "category.category" },
        { path: "tags" },
      ])
      .skip(skip)
      .limit(limit);
    const total = await Product.countDocuments({
      $expr: { $gt: ["$alertQuantity", "$quantity"] },
    });

    return res.status(200).json({
      success: true,
      products: products,
      total: total,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const FetchProductListbyItemNo = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const products = await Product.find({
      itemNo: new RegExp(search as string, "i"),
    });
    return res.status(200).json({
      success: true,
      products: products,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const FetchProductListbyName = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const products = await Product.find({
      name: new RegExp(search as string, "i"),
    });
    return res.status(200).json({
      success: true,
      products: products,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const ProductController = {
  CreateProduct,
  DeleteProduct,
  EditProduct,
  GetProductList,
  UploadPhoto,
  GetProductListForGuest,
  GetProductById,
  GetDisplayList,
  GetAlertList,
  FetchProductListbyItemNo,
  FetchProductListbyName,
};
