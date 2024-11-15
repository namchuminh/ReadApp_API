const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");
const Category = require("./category.model.js");

const Book = sequelize.define("book", {
    MaSach: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    TenSach: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    HinhAnh: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    TacGia: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    NamXuatBan: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    TepTin: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    MaChuyenMuc: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    LuotDoc: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: "books",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

Book.belongsTo(Category, { foreignKey: "MaChuyenMuc", as: "category" });

module.exports = Book;
