const express = require("express");
const app = express();

const cors = require('cors')
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const messageRoute = require('./routes/message')
const conversationRoute = require('./routes/conversation')


dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors())

app.use("/api/message",messageRoute);
app.use("/api/conversation",conversationRoute);


app.listen(3003, () => {
  console.log("Chat service is running!");
});