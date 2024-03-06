import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use('/static', express.static('static'));

import './passport.js';
import routes from "./routes.js";
routes(app);

if (process.env.NODE_ENV !== 'production') {
    import('dotenv').then((dotenv) => {
        dotenv.config({
            path: "./.env"
        });
    });
}

// Import all models dynamically
const importModels = async () => {
    const files = await import('./models/index.js');
    const {
        sequelize,
        models
    } = files;
    await sequelize.sync({
        force: false
    });
    app.listen(config.port, () => console.log(`Express server running on port ${config.port}`));
};

console.log("server started-Zukisa");

importModels();