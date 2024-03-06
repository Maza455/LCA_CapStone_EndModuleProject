import {
    Sequelize,
    DataTypes
} from "sequelize";
import Review from "./Review.js";

const Showcase = (sequelize, DataTypes) => {
    const Showcase = sequelize.define('Showcase', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        type: DataTypes.STRING,
        caption: DataTypes.STRING,
        image: DataTypes.STRING,
        routerLink: DataTypes.STRING,
        priority: DataTypes.INTEGER
    });

    Showcase.associate = function (models) {
        Showcase.belongsTo(models.Company);
    };

    return Showcase;
};

export {
    Showcase,
    Sequelize,
    DataTypes
}

export default Review;