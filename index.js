import express from "express";
import cors from "cors";
import morgan from "morgan";
import {
    sequelize
} from "./models/index.js";

const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use('./static', express.static('static'));

import './passport.js';
import routes from "./routes.js";
routes(app);

console.log("server started");

if (process.env.NODE_ENV !== 'production') {
    import('dotenv').then((dotenv) => {
        dotenv.config({
            path: "./.env"
        });
    });
}

sequelize.sync({
        force: false
    })
    .then(() => {
        app.listen(config.port, () => console.log(`Express server running on port ${config.port}`));
    });