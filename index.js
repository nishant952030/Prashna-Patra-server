const express = require("express");
const cors = require("cors");

require("dotenv").config();

const router = require("./routes/generateTest");
const authroute=require("./routes/Authenticaton");
const subjectRoute = require("./routes/subject");
const connectDB = require("./connections/mongodb");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");
const { makeOrder } = require("./controllers/payment/orders");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin:[ "https://prashna-patra-client.vercel.app","http://localhost:3000"], // Replace with your frontend URL
    credentials: true // ✅ Allows cookies to be sent/received
}));



connectDB();

app.use("/test", router);
app.use("/auth", authroute);
app.use("/subject", subjectRoute);
app.post("/payment/orders", authMiddleware, makeOrder);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
