import type { Request, Response, NextFunction } from "express";
import { decodeToken } from "./utils";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    let decoded;
    try {
      const token = authHeader.split(" ")[1];
      decoded = decodeToken(token as any);
      console.log(token);
      console.log(decoded);
      
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    (req as any).user = decoded;

    next(); // MUST call next()
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Authentication failed" });
  }
};
