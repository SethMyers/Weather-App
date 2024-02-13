import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { SECRET_KEY } from "./config";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Missing authorization token.");

  if (!SECRET_KEY) return res.status(401).send("Missing secret key.");

  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.status(403).send("Your token is incorrect.");
    next();
  });
};
