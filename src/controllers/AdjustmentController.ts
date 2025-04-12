import { Request, Response } from "express";
import Product from "../models/Product";
import Adjustment from "../models/Adjustment";

const CreateAdjustment = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const adjustmentId = await Adjustment.findOne()
      .sort({ adjustmentId: -1 })
      .then((adjustment: any) => {
        return adjustment ? adjustment.adjustmentId + 1 : 1;
      });
    const newAdjustment = new Adjustment({
      ...data,
      adjustmentId: adjustmentId,
    });
    const savedAdjustment: any = await newAdjustment.save();
    const product = await Product.findById(data.product);
    await Product.findByIdAndUpdate(data.product, {
      quantity: product?.quantity + data.quantity,
    });
    const adjustment = await Adjustment.findById(savedAdjustment._id).populate([
      { path: "product", select: { _id: 1, name: 1, itemNo: 1, photo: 1 } },
    ]);
    return res.status(200).json({
      success: true,
      adjustment: adjustment,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetAdjustmentList = async (req: Request, res: Response) => {
  try {
    const { current, size } = req.query;
    const skip = (Number(current) - 1) * Number(size);
    const limit = Number(size);

    const adjustments = await Adjustment.find()
      .populate([
        { path: "product", select: { _id: 1, name: 1, itemNo: 1, photo: 1 } },
      ])
      .skip(skip)
      .limit(limit);
    const total = await Adjustment.countDocuments();

    return res.status(200).json({
      success: true,
      adjustments: adjustments,
      total: total,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const DeleteAdjustment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundAdjustment: any = await Adjustment.findById(id);
    if (foundAdjustment) {
      await Adjustment.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } else res.status(404).json({ message: "Not Adjustment found" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const EditAdjustment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const foundAdjustment: any = await Adjustment.findById(id);
    if (foundAdjustment) {
      const updatedAdjustment: any = await Adjustment.findByIdAndUpdate(
        id,
        data,
        { new: true }
      ).populate([
        { path: "product", select: { _id: 1, name: 1, itemNo: 1, photo: 1 } },
      ]);
      return res.status(200).json({
        success: true,
        adjustment: updatedAdjustment,
      });
    } else return res.status(404).json({ message: "Product not found" });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const AdjustmentController = {
  CreateAdjustment,
  DeleteAdjustment,
  EditAdjustment,
  GetAdjustmentList,
};
