import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "../routes/auth.routes.js";
import problemsRouter from "../routes/problems.routes.js";
import codeExecutionRouter from "../routes/execute-code.routes.js";
import submissionRouter from "../routes/submission.route.js";
import playListRoutes from "../routes/playlists.routes.js";
import contestRoutes from "../routes/contest.routes.js";

dotenv.config();

const port = process.env.PORT || 4000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/user", authRouter);
app.use("/api/v1/problems", problemsRouter);
app.use("/api/v1/execute-code", codeExecutionRouter);
app.use("/api/v1/submissions", submissionRouter);
app.use("/api/v1/playlist", playListRoutes);
app.use("/api/v1/contest", contestRoutes);

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
