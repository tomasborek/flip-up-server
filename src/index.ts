import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
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

app.use(express.json());
app.use(cors({ credentials: true, origin: "*" }));
app.use(cookieParser());

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/social", SocialRouter);
app.use("/city", CityRouter);
app.use("/category", CategoryRouter);
app.use("/listing", ListingRouter);
app.use("/uploads", UploadRouter);
app.use("/chat", ChatRouter);

app.listen(Number(process.env.SERVER_PORT) || 8080, "0.0.0.0", () => {
  console.log(`⚡ Server running on port ${process.env.SERVER_PORT || 8080}`);
});
