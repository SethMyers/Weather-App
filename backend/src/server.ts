import axios from "axios";
import cors from "cors";
import express, { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

require("dotenv").config({ path: "./backend/.env" });
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const SECRET_KEY: string = process.env.JWT_API_TOKEN as string;
const USERS = [{ id: 1, username: "SethMyers", password: "test-password" }];

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("You must provide a token.");

  if (!SECRET_KEY) return res.status(401).send("Missing secret key.");

  jwt.verify(token, SECRET_KEY, (err) => {
    if (err)
      return res.status(403).send("You are not authorized to see the weather!");
    next();
  });
};

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

const getWeatherData = async (
  endpoint: string,
  req: Request,
  res: Response
) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/${endpoint}?id=${req.params.cityId}&appid=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
};

app.get("/weather/:cityId", authenticateToken, (req: Request, res: Response) =>
  getWeatherData("weather", req, res)
);
app.get("/forecast/:cityId", authenticateToken, (req: Request, res: Response) =>
  getWeatherData("forecast", req, res)
);

app.use((err: Error, req: Request, res: Response) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("You are not authorized to see the weather!");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
