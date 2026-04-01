import express from "express";
import bodyParser from "body-parser";
//import initWebRoutes from "./route/web.js";
import connectToMongoDB from "./config/mongodb.js";

import routes from "./route/web.js";
import cors from "cors";
require('dotenv').config();
import cookieParser from "cookie-parser";
let app = express();

app.use(cors());
//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//initWebRoutes(app);
app.use(cookieParser());

routes(app);


let port = process.env.PORT || 8089;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Connect to MongoDB
connectToMongoDB();
