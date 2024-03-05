import config from "../config/config.js";
import {
    Sequelize,
    DataTypes
} from "sequelize";

const sequelize = new Sequelize(config..database, config.db.user, config.db.password, {
    dialect: config.db.dialect,
    host: config.db.host,
    storage: config.db.storage
});

const db = {};
db.User = (sequelize, DataTypes) => require("./User")(sequelize, DataTypes);
db.Company = (sequelize, DataTypes) => require("./Company")(sequelize, DataTypes);
db.Showcase = (sequelize, DataTypes) => require("./Showcase")(sequelize, DataTypes);
db.Category = (sequelize, DataTypes) => require("./Category")(sequelize, DataTypes);
db.SubCategory = (sequelize, DataTypes) => require("./SubCategory")(sequelize, DataTypes);
db.SubSubCategory = (sequelize, DataTypes) => require("./SubSubCategory")(sequelize, DataTypes);
db.OrderItem = (sequelize, DataTypes) => require("./OrderItem")(sequelize, DataTypes);
db.Wishlist = (sequelize, DataTypes) => require("./Wishlist")(sequelize, DataTypes);
db.Product = (sequelize, DataTypes) => require("./Product")(sequelize, DataTypes);
db.Review = (sequelize, DataTypes) => require("./Review")(sequelize, DataTypes);
db.Order = (sequelize, DataTypes) => require("./Order")(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db)
    }
});
export {
    Sequelize,
    sequelize
};
export default db;