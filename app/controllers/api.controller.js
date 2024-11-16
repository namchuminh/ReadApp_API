const User = require('../models/user.model.js'); // Đảm bảo bạn có model User
const Book = require('../models/book.model.js'); // Đảm bảo bạn có model Book
const Category = require('../models/category.model.js'); // Đảm bảo bạn có model Category
const Slide = require('../models/slide.model.js'); // Đảm bảo bạn có model Banner
const { Op, Sequelize } = require("sequelize");

class authController {
    // [GET] /api/slides (order by DESC)
    async slides(req, res) {
        try {
            const slides = await Slide.findAll({
                order: [["createdAt", "DESC"]],
            });
            return res.status(200).json(slides);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tải slide", error });
        }
    }

    // [GET] /api/book/?limit= &search (order by DESC limit mặc định 6)
    async books(req, res) {
        try {
            const { limit = 6, search = "" } = req.query;
            const books = await Book.findAll({
                where: {
                    TenSach: { [Op.like]: `%${search}%` },
                },
                limit: parseInt(limit),
                order: [["createdAt", "DESC"]],
            });
            return res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tải sách", error });
        }
    }

    // [GET] /api/bookByCategory/?limit= &offset &MaChuyenMuc (order by DESC limit mặc định 6)
    async bookByCategory(req, res) {
        try {
            const { limit = 6, offset = 0, search = "", MaChuyenMuc } = req.query;
    
            const whereCondition = {
                TenSach: { [Op.like]: `%${search}%` },
            };
    
            if (MaChuyenMuc) {
                whereCondition.MaChuyenMuc = MaChuyenMuc;
            }
    
            // Lấy tên chuyên mục từ bảng Category
            const category = await Category.findOne({
                where: { MaChuyenMuc },
                attributes: ['TenChuyenMuc'], // Chỉ lấy tên chuyên mục
            });
    
            if (!category) {
                return res.status(404).json({ message: "Chuyên mục không tồn tại" });
            }
    
            const categoryName = category.TenChuyenMuc;
    
            // Lấy danh sách sách và tổng số sách
            const { rows: books, count: totalBooks } = await Book.findAndCountAll({
                where: whereCondition,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["createdAt", "DESC"]],
            });
    
            return res.status(200).json({ books, totalBooks, categoryName });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tải sách", error });
        }
    }

    // [GET] /api/categories/?limit= &search (order by DESC limit mặc định 6)
    async categories(req, res) {
        try {
            const { limit = 6, search = "" } = req.query;
            const categories = await Category.findAll({
                where: {
                    TenChuyenMuc: { [Op.like]: `%${search}%` },
                },
                limit: parseInt(limit),
                order: [["createdAt", "DESC"]],
            });
            return res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tải chuyên mục", error });
        }
    }

    // [GET] /api/recommendBooks (order by RANDOM limit 6)
    async recommendBook(req, res) {
        try {
            const books = await Book.findAll({
                order: [Sequelize.literal("RAND()")], // Sử dụng RAND() cho MySQL
                limit: 6,
            });
            return res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tải sách gợi ý", error });
        }
    }
    
    // [GET] /api/topRead (order by LuotDoc DESC limit 12)
    async topRead(req, res) {
        try {
            const books = await Book.findAll({
                order: [["LuotDoc", "DESC"]],
                limit: 12,
            });
            return res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tải top sách đọc nhiều", error });
        }
    }
}

module.exports = new authController();
