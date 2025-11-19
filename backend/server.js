require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./lib/db");
const userRouter = require("./routes/userRoutes");
const { chat } = require("./controllers/messageController");
// const websocket = require("./webSocket/websocket");

const app = express();
const server = http.createServer(app);
chat(server);
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://chatter-app-mu.vercel.app/", // Vercel frontend
];

app.use(
  cors({
    origin: allowedOrigins, // simple array whitelist
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies and auth headers
  })
);

//routes
app.use("/user", userRouter);
app.get("/testapi", async (req, res) => {
  console.log("hii");
  return res.json({ success: true, message: "server is live" });
});

// connect mongoose database


(async () => {
  await connectDB();
})();


// WebSocket(server);
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log("server connected: ", PORT);
  });
}
module.exports = server;
