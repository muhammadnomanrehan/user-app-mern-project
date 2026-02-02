
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js"; 
import inventoryRouter from "./routes/inventory.route.js";
import vendorRouter from "./routes/vendor.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", userRouter);
app.use("/api/inventory", inventoryRouter); // inventory routes
app.use("/api/vendors", vendorRouter); 
app.use(errorHandler);

export default app;

