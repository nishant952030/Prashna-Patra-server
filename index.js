const express = require("express");
const cors = require("cors");

require("dotenv").config();

const router = require("./routes/generateTest");
const authroute = require("./routes/Authenticaton");
const subjectRoute = require("./routes/subject");
const paymentRoute = require("./routes/paymentRoute")
const userRoute = require("./routes/userRoute")
const unAuthRoute = require("./routes/unAuth")


const connectDB = require("./connections/mongodb");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");
const getSolutions = require("./controllers/testRelated/solutions");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ["https://prashna-patra-client.vercel.app", "http://localhost:3000", "https://www.prashnapatra.co.in"],
    credentials: true
}));

connectDB();

app.use("/test", router);
app.use("/auth", authroute);
app.use("/subject", subjectRoute);
app.use("/payment", paymentRoute);
app.use("/user", userRoute);
app.use("/unAuth", unAuthRoute);

app.post("/logout", (req, res) => {
    res.clearCookie("token", { path: "/", httpOnly: true, secure: true, sameSite: "strict" });
    res.status(200).json({ message: "Logged out successfully" });
});

app.get("/solutions/get-solutions/:testId", authMiddleware, getSolutions);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
