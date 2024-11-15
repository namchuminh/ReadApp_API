const Library = require("../models/library.model");
const User = require("../models/user.model");
const Book = require("../models/book.model");
const { Op } = require("sequelize");

class libraryController {
    // [GET] /library 
    // [GET] /library 
    async index(req, res) {
        try {
            const { search = "", page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            // Điều kiện tìm kiếm
            const whereCondition = search
                ? {
                    [Op.or]: [
                        { "$user.TaiKhoan$": { [Op.like]: `%${search}%` } },
                        { "$user.Email$": { [Op.like]: `%${search}%` } },
                        { "$user.SoDienThoai$": { [Op.like]: `%${search}%` } },
                        { "$book.TenSach$": { [Op.like]: `%${search}%` } },
                    ],
                }
                : {};

            // Truy vấn
            const { rows: libraries, count } = await Library.findAndCountAll({
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["TaiKhoan", "HoTen", "Email", "SoDienThoai"],
                    },
                    {
                        model: Book,
                        as: "book",
                        attributes: ["TenSach", "TacGia"],
                    },
                ],
                where: whereCondition,
                offset: parseInt(offset),
                limit: parseInt(limit),
                order: [["createdAt", "DESC"]],
            });

            res.render("library/index", {
                libraries,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                search,
                error: "",
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tải danh sách Library", error });
        }
    }


    // [GET] /library/add
    async create(req, res) {
        try {
            const users = await User.findAll({ attributes: ["MaNguoiDung", "TaiKhoan", "HoTen"] });
            const books = await Book.findAll({ attributes: ["MaSach", "TenSach", "TacGia"] });

            res.render("library/create", { users, books, error: "" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tải dữ liệu", error });
        }
    }

    // [POST] /library/add
    async store(req, res) {
        try {
            const { MaNguoiDung, MaSach } = req.body;

            await Library.create({ MaNguoiDung, MaSach });

            res.redirect("/library");
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi thêm Library", error });
        }
    }

    // [GET] /library/:id
    async edit(req, res) {
        try {
            const { id } = req.params;
            const library = await Library.findByPk(id, {
                include: ["user", "book"],
            });

            if (!library) {
                return res.status(404).json({ message: "Không tìm thấy Library" });
            }

            const users = await User.findAll({ attributes: ["MaNguoiDung", "TaiKhoan", "HoTen"] });
            const books = await Book.findAll({ attributes: ["MaSach", "TenSach", "TacGia"] });

            res.render("library/edit", { library, users, books, error: "" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tải dữ liệu Library", error });
        }
    }

    // [POST] /library/:id
    async update(req, res) {
        try {
            const { id } = req.params;
            const { MaNguoiDung, MaSach } = req.body;

            const library = await Library.findByPk(id);

            if (!library) {
                return res.status(404).json({ message: "Không tìm thấy Library" });
            }

            library.MaNguoiDung = MaNguoiDung;
            library.MaSach = MaSach;
            await library.save();

            res.redirect("/library");
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi cập nhật Library", error });
        }
    }

    // [GET] /library/:id/delete
    async destroy(req, res) {
        try {
            const { id } = req.params;

            const library = await Library.findByPk(id);

            if (!library) {
                return res.status(404).json({ message: "Không tìm thấy Library" });
            }

            await library.destroy();

            res.redirect("/library");
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi xóa Library", error });
        }
    }
}

module.exports = new libraryController();
