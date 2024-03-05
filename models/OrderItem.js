import {
    Sequelize,
    DataTypes
} from "sequelize";

const OrderItem = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        quantity: DataTypes.INTEGER
    });

    OrderItem.associate = function (models) {
        OrderItem.belongsTo(models.Product);
        OrderItem.belongsTo(models.Order);
    };

    return OrderItem;
};

export {
    OrderItem,
    Sequelize,
   DataTypes 
}