import { authenticateToken } from "./auth";
import cors from "cors";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { SECRET_KEY, USERS } from "./config";
import { getWeatherData } from "./weather";

require("dotenv").config({ path: "./backend/.env" });
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Weather API Wrapper",
      version: "1.0.0",
      description:
        "API Documentation for Custom Weather API Wrapper, which wraps the public OpenWeatherMap API",
    },
    components: {
      schemas: {
        WeatherData: {
          type: "object",
          properties: {
            main: { type: "string" },
            description: { type: "string" },
            temp: { type: "number" },
            wind: { type: "number" },
          },
        },
        ForecastData: {
          type: "object",
          properties: {
            date: { type: "string" },
            description: { type: "string" },
            temp: { type: "number" },
            minTemp: { type: "number" },
            maxTemp: { type: "number" },
            wind: { type: "number" },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./backend/src/server.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
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

/**
 * @swagger
 * /weather/{cityId}:
 *   get:
 *     summary: Get weather data for a city
 *     tags: [Weather]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the city to fetch weather data for
 *     responses:
 *       200:
 *         description: Weather data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherData'
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Incorrect token
 *       500:
 *         description: OpenWeatherMap call failed
 */
app.get("/weather/:cityId", authenticateToken, (req: Request, res: Response) =>
  getWeatherData("weather", req, res)
);

/**
 * @swagger
 * /forecast/{cityId}:
 *   get:
 *     summary: Get detailed forecast data for a city foor the next 5 days
 *     tags: [Forecast]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cityId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the city to fetch forecast data for
 *     responses:
 *       200:
 *         description: Weather data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                 $ref: '#/components/schemas/ForecastData'
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Incorrect token
 *       500:
 *         description: OpenWeatherMap call failed
 */
app.get("/forecast/:cityId", authenticateToken, (req: Request, res: Response) =>
  getWeatherData("forecast", req, res)
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
