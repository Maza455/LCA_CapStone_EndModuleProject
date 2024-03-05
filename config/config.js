import {
    createPool
} from "mysql";
import dotenv from "dotenv";
dotenv.config();

let connection = createPool({
    database: process.env.DB_Name,
    host: process.env.DB_HOST,
    user: process.env.DB_UserName,
    password: process.env.DB_UserPass,
    multipleStatements: true,
    connectionLimit: 30
});

export default {
    connection
};