require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./lib/db");
const userRouter = require("./routes/userRoutes");
const { chat } = require("./controllers/messageController");

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://chatter-app-x9lb.vercel.app",
  "https://comforting-dusk-52744b.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/user", userRouter);

app.get("/testapi", (req, res) => {
  console.log("hii");
  return res.json({ success: true, message: "server is live" });
});

app.get("/", (req, res) => {
  console.log("server is live");
  return res.json({ success: true, message: "server is live" });
});

// DB connection
(async () => {
  await connectDB();
})();

// Socket IO
chat(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("server running on", PORT);
});

module.exports = server;
