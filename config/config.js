import { createPool } from "mysql";
import dotenv from "dotenv";

dotenv.config();

const connection = createPool({
    database: process.env.DB_Name,
    host: process.env.DB_HOST,
    user: process.env.DB_UserName,
    password: process.env.DB_UserPass,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    multipleStatements: true,
    connectionLimit: 30
});

const authentication = {
    jwtSecret: process.env.SECRET_KEY
};

export default { connection, authentication };
