import {
    Sequelize,
    DataTypes
} from "sequelize";

const Wishlist = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define('Wishlist', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }
    });

    Wishlist.associate = function (models) {
        Wishlist.belongsTo(models.User);
        Wishlist.belongsTo(models.Product);
    };

    return Wishlist;
};

export {
    Wishlist,
    Sequelize,
    DataTypes
}

export default Wishlist;