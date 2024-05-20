const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectToMongo();
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});

//routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/post", require("./routes/post"));
app.use("/api/order", require("./routes/order"));

app.listen(port, () => {
  console.log(`Pass n Play listening on http://localhost:${port}`);
});
