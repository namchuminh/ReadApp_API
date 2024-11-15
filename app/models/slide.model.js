const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");
const Book = require("./book.model.js");
const Category = require("./category.model.js");

const Slide = sequelize.define("slide", {
    MaSlide: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    HinhAnh: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    MaChuyenMuc: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    MaSach: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: "slides",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

Slide.belongsTo(Category, { foreignKey: "MaChuyenMuc", as: "category" });
Slide.belongsTo(Book, { foreignKey: "MaSach", as: "book" });

module.exports = Slide;
