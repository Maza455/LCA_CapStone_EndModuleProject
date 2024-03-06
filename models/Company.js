import {
    Sequelize,
    DataTypes
} from "sequelize";

const Company = (sequelize, DataTypes) => {
    return sequelize.define('Company', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        phoneNo: DataTypes.STRING,
        icon: DataTypes.STRING,
        logo: DataTypes.STRING,
        code: DataTypes.STRING,
        header: DataTypes.STRING,
        motive: DataTypes.STRING,
        details: DataTypes.TEXT,
        location: DataTypes.STRING
    });
};

export {
    Company,
    Sequelize,
    DataTypes
};

export default Company;