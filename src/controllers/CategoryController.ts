import { Request, Response } from "express";
import Category from "../models/Category";

const CreateCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name: name });
    const savedCategory = await newCategory.save();
    return res.status(200).json({
      success: true,
      category: savedCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const updateSubCategory = (category: any, indices: any, newValue: string) => {
  let index = Number(indices[0]);
  if (indices.length === 1) {
    category[index].subCategory.push({ name: newValue, subCategory: [] });
  } else {
    indices.shift();
    updateSubCategory(category[index].subCategory, indices, newValue);
  }
};

const deleteByIndices = (category: any, indices: any) => {
  if (indices.length === 1) {
    category = category.splice(Number(indices[0]), 1);
  } else {
    var index = Number(indices.shift());
    deleteByIndices(category[index].subCategory, indices);
  }
};

const updateSubCategoryName = (
  category: any,
  indices: any,
  newName: string
) => {
  if (indices.length === 1) {
    category[indices[0]].name = newName;
  } else {
    var index = Number(indices.shift());
    updateSubCategoryName(category[index].subCategory, indices, newName);
  }
};

const AddSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pos, name } = req.body;
    const foundCategory: any = await Category.findById(id);
    let category = [...foundCategory?.subCategory];
    if (pos.length > 0) updateSubCategory(category, pos, name);
    else {
      category.push({ name: name, subCategory: [] });
    }
    const savedCategory: any = await Category.findByIdAndUpdate(
      id,
      {
        subCategory: category,
      },
      { new: true }
    ).select({ name: 1, subCategory: 1 });
    return res.status(200).json({
      success: true,
      category: savedCategory,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const EditCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pos, name } = req.body;
    const foundCategory: any = await Category.findById(id);
    if (pos.length > 0) {
      let category = [...foundCategory?.subCategory];
      updateSubCategoryName(category, pos, name);
      const updatedCategory: any = await Category.findByIdAndUpdate(
        id,
        { subCategory: category },
        { new: true }
      ).select({ name: 1, subCategory: 1 });
      return res.status(200).json({
        success: true,
        category: updatedCategory,
      });
    } else {
      const updatedCategory: any = await Category.findByIdAndUpdate(
        id,
        { name: name },
        { new: true }
      ).select({ name: 1, subCategory: 1 });
      return res.status(200).json({
        success: true,
        category: updatedCategory,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetCategoryList = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().select({
      name: 1,
      subCategory: 1,
    });
    return res.status(200).json({
      success: true,
      categoryList: categories,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const DeleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category } = req.query;
    if (category === "") {
      await Category.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } else {
      const pos = String(category).split(",");
      const foundCategory: any = await Category.findById(id);
      const subCategory = [...foundCategory?.subCategory];
      deleteByIndices(subCategory, pos);
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { subCategory: subCategory },
        { new: true }
      );
      return res.status(200).json({ success: true, category: updatedCategory });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const CategoryController = {
  CreateCategory,
  DeleteCategory,
  GetCategoryList,
  AddSubCategory,
  EditCategory,
};
