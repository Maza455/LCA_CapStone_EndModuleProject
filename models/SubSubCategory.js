import {
    Sequelize,
    DataTypes
} from "sequelize";

const SubSubCategory = (sequelize, DataTypes) => {
    const SubSubCategory = sequelize.define('SubSubCategory', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING
    });

    SubSubCategory.associate = function (models) {
        SubSubCategory.belongsTo(models.SubCategory);
    };

    return SubSubCategory;
};

export {
    SubSubCategory,
    Sequelize,
    DataTypes
}

export default SubSubCategory;