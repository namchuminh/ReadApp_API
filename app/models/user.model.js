const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config.js");

const User = sequelize.define("user", {
    MaNguoiDung: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    HoTen: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    TaiKhoan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    SoDienThoai: {
        type: DataTypes.STRING(11),
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    MatKhau: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    PhanQuyen: {
        type: DataTypes.ENUM("admin", "user", "staff"),
        allowNull: false,
    },
    TrangThai: {
        type: DataTypes.ENUM("activate", "blocked"),
        allowNull: false,
    },
}, {
    tableName: "users",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

module.exports = User;
