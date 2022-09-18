const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const cors = require("cors");
app.use(cors());
app.listen(5000, () => {
  console.log("Hello from server");
});
const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/authRouter");

app.use("/user", userRouter);
app.use("/auth", authRouter);
