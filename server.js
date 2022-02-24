import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import csurf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");

// * add support env
dotenv.config();

//* initial csrf protection
const csrfProtection = csurf({ cookie: true });

//* create app
const app = express();

//* connect to database
mongoose
    .connect(process.env.DATABASE)
    .then(() => {
        console.log("connected to db!");
    })
    .catch((e) => {
        console.log("error connecting to db : ", e);
    });

//* apply middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(csrfProtection);
app.use((req, res, next) => {
    next();
});

//* add routes
readdirSync("./routes").map((route) => {
    app.use("/api", require(`./routes/${route}`));
});

//* add csrf
app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

//* initialing port start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`server start on port ${PORT}`);
});

//* notes
//? this is for mongoose options
// {
//     userNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
// }
