import express, { Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { Request } from "express";
import morgan from "morgan";
const app = express();
dotenv.config();
//routers
import UserRouter from "@routes/UserRoute";
import SocialRouter from "@routes/SocialRoute";
import CityRouter from "@routes/CityRoute";
import CategoryRouter from "@routes/CategoryRoute";
import ListingRouter from "@routes/ListingRoute";
import UploadRouter from "@routes/UploadRouter";
import ChatRouter from "@routes/ChatRoute";
import MessageRouter from "@routes/MessageRoute";
import logger from "./utils/logger";
import { response } from "@utils/response";
import ResetTokenRouter from "@routes/ResetTokenRoute";
import ReportRouter from "@routes/ReportRoute";

const allowlist = [
  "https://flipup.cz",
  "https://www.flipup.cz",
  "http://localhost:3000",
];
const corsOptionsDelegate = function (req: Request, callback: any) {
  let corsOptions;
  if (allowlist.includes(req.header("Origin") || "")) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json());
app.use(cors(corsOptionsDelegate));
app.use(cookieParser());
app.use(
  morgan(":method [:url] :status = :response-time ms - :res[content-length]")
);

app.use("/user", UserRouter);
app.use("/social", SocialRouter);
app.use("/city", CityRouter);
app.use("/category", CategoryRouter);
app.use("/listing", ListingRouter);
app.use("/uploads", UploadRouter);
app.use("/chat", ChatRouter);
app.use("/message", MessageRouter);
app.use("/reset-token", ResetTokenRouter);
app.use("/report", ReportRouter);
app.use("/health", (req: Request, res: Response) => {
  response({ res, status: 200, message: "OK" });
});

app.use((req: Request, res: Response) => {
  response({
    res,
    status: 404,
    message: "Not found",
  });
});

app.listen(process.env.PORT || 8080, () => {
  logger.info("Server is running on port 8080");
});
