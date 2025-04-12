import { Request, Response } from "express";
import Tag from "../models/Tag";

const CreateTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newTag = new Tag({ name: name });
    const savedTag = await newTag.save();
    return res.status(200).json({
      success: true,
      tag: savedTag,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetTagList = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find().select({ name: 1 });
    return res.status(200).json({
      success: true,
      tags: tags,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const DeleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Tag.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const TagController = {
  CreateTag,
  DeleteTag,
  GetTagList,
};
