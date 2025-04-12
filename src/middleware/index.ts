import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decodedData: any = jwt.verify(
        token,
        process.env.SECRET_KEY as string
      );
      req.body.userId = decodedData.id;
      req.body.userRole = decodedData.role;
      next();
    } else {
      return res
        .status(401)
        .json({
          message: "Authentication failed: No token provided",
          auth: true,
        });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token", auth: true });
  }
};

export const OnlyAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decodedData: any = jwt.verify(
        token,
        process.env.SECRET_KEY as string
      );
      req.body.userId = decodedData.id;
      if (decodedData.role === "ADMIN" || decodedData.role === "SUPER_ADMIN")
        next();
    } else {
      return res
        .status(401)
        .json({
          message: "Authentication failed: No token provided",
          auth: true,
        });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token", auth: true });
  }
};

export const OnlySuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decodedData: any = jwt.verify(
        token,
        process.env.SECRET_KEY as string
      );
      req.body.userId = decodedData.id;
      if (decodedData.role === "SUPER_ADMIN") next();
    } else {
      return res
        .status(401)
        .json({
          message: "Authentication failed: No token provided",
          auth: true,
        });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token", auth: true });
  }
};
