// higher order function  return korbe function k

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

// roles = ["admin", "customer"]
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "You are not authorized!" });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Token is required!" });
      }
      const decoded = jwt.verify(token, config.jwtSecret!) as JwtPayload;
      console.log({ decoded });
      (req as any).user = decoded;

      //["admin"]
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(500).json({
          error: "unauthorized!!!",
        });
      }

      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
        details: err,
      });
    }
  };
};

export default auth;
