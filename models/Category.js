import {
    Sequelize,
    DataTypes
} from "sequelize";

const Category = (sequelize, DataTypes) => {
    return sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true
        }
    });
};

export {
    Category,
    Sequelize,
    DataTypes
};