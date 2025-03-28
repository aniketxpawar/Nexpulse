import { execSync } from "child_process";
import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import appRouter from "./routers";
import { createServer } from "http";
import { Server } from "socket.io";
import chatSocketHandler from "./socket/chatSocket";
import { config } from "dotenv";
config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Automatically run migrations and generate Prisma client
// try {
//   console.log("Running migrations and generating Prisma client...");
//   execSync("npm run prisma:migrate-and-generate", { stdio: "inherit" });
// } catch (error) {
//   console.error("Migration and generation failed:", error);
// }

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // or specify your frontend domain
    methods: ["GET", "POST"],
  },
});

chatSocketHandler(io);

app.use("/", appRouter);
app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

httpServer.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
