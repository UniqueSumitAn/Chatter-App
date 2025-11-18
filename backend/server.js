require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectdb = require("./lib/db");
const userRouter = require("./routes/userRoutes");
const {chat} = require("./controllers/messageController");
// const websocket = require("./webSocket/websocket");


const app = express();
const server = http.createServer(app);
chat(server);
app.use(express.json());
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173", // your React app
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//routes
app.use("/user", userRouter);

// connect mongoose database
connectdb();

// WebSocket(server);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("server connected: ", PORT);
});
