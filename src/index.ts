import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { Request } from "express";
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

var allowlist = ["https://flipup.cz", "http://localhost:3000"];
const corsOptionsDelegate = function (req: Request, callback: any) {
  var corsOptions;
  if (allowlist.includes(req.header("Origin") || "")) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(express.json());
app.use(cors(corsOptionsDelegate));
app.use(cookieParser());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

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

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running on port 8080");
});
