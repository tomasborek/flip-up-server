import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import http from "http";
import fs from "fs";
const app = express();
dotenv.config();
//routers
import UserRouter from "@routes/user";
import AuthRouter from "@routes/auth";
import SocialRouter from "@routes/social";
import CityRouter from "@routes/city";
import CategoryRouter from "@routes/category";
import ListingRouter from "@routes/listing";
import UploadRouter from "@routes/uploads";
import ChatRouter from "@routes/chat";
import MessageRouter from "@routes/message";

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser());

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/social", SocialRouter);
app.use("/city", CityRouter);
app.use("/category", CategoryRouter);
app.use("/listing", ListingRouter);
app.use("/uploads", UploadRouter);
app.use("/chat", ChatRouter);
app.use("/message", MessageRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "404 Not Found",
  });
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(
  {
    key: fs.readFileSync("/etc/letsencrypt/live/my_api_url/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/my_api_url/fullchain.pem"),
  },
  app
);

httpServer.listen(80, () => {
  console.log("⚡ HTTP Server running on port 80");
});
httpsServer.listen(443, () => {
  console.log("⚡ HTTPS Server running on port 443");
});
