// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const authMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const jwtSecret: string = process.env.JWTSECRET!;
//     const decoded = jwt.verify(token, jwtSecret) as { userId: string };
//     req.userData = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Authentication failed" });
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  userData?: {
    userId: string;
  };
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    // const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const jwtSecret: string = process.env.JWTSECRET!;
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
