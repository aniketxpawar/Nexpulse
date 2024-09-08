import { execSync } from "child_process";
import express from "express";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import appRouter from "./routers";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(morgan('dev'))
app.use('/',appRouter)

// Automatically run migrations and generate Prisma client
try {
  console.log("Running migrations and generating Prisma client...");
  execSync("npm run prisma:migrate-and-generate", { stdio: "inherit" });
} catch (error) {
  console.error("Migration and generation failed:", error);
}

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
