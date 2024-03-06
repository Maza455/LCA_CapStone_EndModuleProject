import config from "../config/config.js";
import {
    Sequelize,
    DataTypes
} from "sequelize";
import User from "./User.js";
import Company from "./Company.js";
import Showcase from "./ShowCase.js";
import Category from "./Category.js";
import SubCategory from "./SubCategory.js";
import SubSubCategory from "./SubSubCategory.js";
import OrderItem from "./OrderItem.js";
import Wishlist from "./Wishlist.js";
import Product from "./Products.js";
import Review from "./Review.js";
import Order from "./Order.js";

const sequelize = new Sequelize(config.connection.database, config.connection.user, config.connection.password, {
    dialect: 'mysql',
    host: config.connection.host,
    storage: config.connection.storage
});

const db = {
    User: User(sequelize, DataTypes),
    Company: Company(sequelize, DataTypes),
    Showcase: Showcase(sequelize, DataTypes),
    Category: Category(sequelize, DataTypes),
    SubCategory: SubCategory(sequelize, DataTypes),
    SubSubCategory: SubSubCategory(sequelize, DataTypes),
    OrderItem: OrderItem(sequelize, DataTypes),
    Wishlist: Wishlist(sequelize, DataTypes),
    Product: Product(sequelize, DataTypes),
    Review: Review(sequelize, DataTypes),
    Order: Order(sequelize, DataTypes)
};

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

export {
    Sequelize,
    sequelize,
    db
};
