const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");
const User = require("./user.model.js");
const Book = require("./book.model.js");

const Library = sequelize.define("library", {
    MaThuVien: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    MaNguoiDung: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    MaSach: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "libraries",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

Library.belongsTo(User, { foreignKey: "MaNguoiDung", as: "user" });
Library.belongsTo(Book, { foreignKey: "MaSach", as: "book" });

module.exports = Library;
