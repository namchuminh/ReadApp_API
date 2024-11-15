const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const Category = sequelize.define("category", {
    MaChuyenMuc: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    TenChuyenMuc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    HinhAnh: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: "categories",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

module.exports = Category;
