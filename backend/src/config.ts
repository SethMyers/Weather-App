require("dotenv").config({ path: "./backend/.env" });

export const SECRET_KEY: string = process.env.JWT_API_TOKEN as string;
export const USERS = [
  { id: 1, username: "SethMyers", password: "test-password" },
];
