import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
  const { name, role, email, password, age, phone, address } = req.body;
  try {
    const result = await authServices.signupUser(name, role, email, password, age, phone, address);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};



export const authController = {
  signupUser,
  loginUser,
};
