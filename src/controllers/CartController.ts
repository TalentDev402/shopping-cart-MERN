import { Request, Response } from "express";
import Cart from "../models/Cart";

const AddToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, userId } = req.body;
    const cart = await Cart.findOne({ customer: userId });
    if (cart) {
      let updatedItems: any = [...cart.items];
      const foundIndex = updatedItems.findIndex(
        (item: any) => String(item.product) === String(productId)
      );
      if (foundIndex === -1) {
        updatedItems = [
          ...updatedItems,
          { product: productId, quantity: quantity },
        ];
      } else {
        updatedItems[foundIndex].quantity =
          updatedItems[foundIndex].quantity + quantity;
      }
      const updatedCart: any = await Cart.findByIdAndUpdate(
        cart._id,
        { items: updatedItems },
        { new: true }
      ).populate({
        path: "items.product",
        select: {
          supplier: 0,
          category: 0,
          tags: 0,
          purchasePrice: 0,
          itemNo: 0,
        },
      });
      return res.status(200).json({
        success: true,
        cart: updatedCart.items,
      });
    } else {
      const newCart = new Cart({
        customer: userId,
        items: [
          {
            product: productId,
            quantity: 1,
          },
        ],
      });
      const savedCart = await newCart.save();
      const updatedCart: any = await Cart.findById(savedCart._id).populate({
        path: "items.product",
        select: {
          supplier: 0,
          category: 0,
          tags: 0,
          purchasePrice: 0,
          itemNo: 0,
        },
      });
      return res.status(200).json({
        success: true,
        cart: updatedCart.items,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const cart: any = await Cart.findOne({ customer: userId }).populate({
      path: "items.product",
      select: {
        supplier: 0,
        category: 0,
        tags: 0,
        purchasePrice: 0,
        itemNo: 0,
      },
    });
    if (cart) {
      return res.status(200).json({
        success: true,
        cart: cart.items,
      });
    } else {
      return res.status(200).json({
        success: true,
        cart: [],
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const ChangeQuantity = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart: any = await Cart.findOne({ customer: userId });
    const updatedItems = [...cart.items];
    const index = updatedItems.findIndex(
      (item: any) => String(item.product) === String(productId)
    );
    updatedItems[index].quantity = quantity;
    const updatedCart: any = await Cart.findByIdAndUpdate(
      cart._id,
      { items: updatedItems },
      { new: true }
    ).populate({
      path: "items.product",
      select: {
        supplier: 0,
        category: 0,
        tags: 0,
        purchasePrice: 0,
        itemNo: 0,
      },
    });
    return res.status(200).json({
      success: true,
      cart: updatedCart.items,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const RemoveItem = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;
    const cart: any = await Cart.findOne({ customer: userId });
    const updatedItems = cart.items.filter(
      (item: any) => String(item.product) !== String(productId)
    );
    const updatedCart: any = await Cart.findByIdAndUpdate(
      cart._id,
      { items: updatedItems },
      { new: true }
    ).populate({
      path: "items.product",
      select: {
        supplier: 0,
        category: 0,
        tags: 0,
        purchasePrice: 0,
        itemNo: 0,
      },
    });
    return res.status(200).json({
      success: true,
      cart: updatedCart.items,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const CartController = {
  AddToCart,
  GetCart,
  ChangeQuantity,
  RemoveItem,
};
