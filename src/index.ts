import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

app.use(express.json());
app.use(cors());

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/social", SocialRouter);
app.use("/city", CityRouter);
app.use("/category", CategoryRouter);
app.use("/listing", ListingRouter);
app.use("/uploads", UploadRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`⚡ Server running on port ${process.env.SERVER_PORT}`);
});
