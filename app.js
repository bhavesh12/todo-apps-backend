const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors     = require("cors");
const path  = require('path');
dotenv.config();

// Connect to db

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
  },(err) => {
    if(err) {
      console.log('connection err', err);
    } else {
      console.log('Database connected');
    }
});

// import routes

const userRoutes    = require("./routes/users/user");
const toDoRoutes    = require("./routes/To-doapp/to-doapp");

app.use(express.json());
app.use(cors());
app.use("/api/users",userRoutes);
app.use("/api/todoapp",toDoRoutes);

app.use('/public/', express.static(path.join(__dirname, 'public')));


app.listen(8000,() => console.log("App running in port 8000 !"));
