import { authenticateToken } from "./auth";
import cors from "cors";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { SECRET_KEY, USERS } from "./config";
import { getWeatherData } from "./weather";

require("dotenv").config({ path: "./backend/.env" });
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Sign the JWT token with the user's ID and username
    const token = jwt.sign({ id: user.id, username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.get("/weather/:cityId", authenticateToken, (req: Request, res: Response) =>
  getWeatherData("weather", req, res)
);
app.get("/forecast/:cityId", authenticateToken, (req: Request, res: Response) =>
  getWeatherData("forecast", req, res)
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
