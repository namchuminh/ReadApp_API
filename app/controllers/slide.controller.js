const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const Slide = require("../models/slide.model.js");
const Category = require("../models/category.model.js");
const Book = require("../models/book.model.js");
const { error } = require("console");

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/slide"); // Lưu ảnh vào thư mục uploads/slide/image
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file unique
  },
});

const upload = multer({ storage });

// Slide Controller
class slideController {
  // [GET] /slide
  async index(req, res) {
    try {
      const { search = "", page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
  
      // Lấy danh sách slide với phân trang và tìm kiếm theo TenSach hoặc TenChuyenMuc
      const { rows: slides, count } = await Slide.findAndCountAll({
        include: [
          { model: Category, as: "category" },
          { model: Book, as: "book" },
        ],
        where: {
          [Op.or]: [
            { HinhAnh: { [Op.like]: `%${search}%` } }, // Tìm kiếm theo ảnh slide
            { "$book.TenSach$": { [Op.like]: `%${search}%` } }, // Tìm kiếm theo tên sách
            { "$category.TenChuyenMuc$": { [Op.like]: `%${search}%` } }, // Tìm kiếm theo tên chuyên mục
          ],
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
      });
  
      return res.render("slide/index", {
        slides,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        search,
        error: "",
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tải slide", error });
    }
  }

  // [GET] /slide/add
  async create(req, res) {
    try {
      const categories = await Category.findAll();
      const books = await Book.findAll();
      res.render("slide/create", { categories, books, error: "" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tải chuyên mục hoặc sách", error });
    }
  }

  // [POST] /slide/add
  async store(req, res) {
    const uploadFiles = upload.single("HinhAnh"); // Chỉ upload một ảnh cho slide

    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Lỗi khi upload file", error: err.message });
      }

      const { MaChuyenMuc, MaSach } = req.body;
      const HinhAnh = req.file ? `/uploads/slide/${req.file.filename}` : "";

      try {
        await Slide.create({
          HinhAnh,
          MaChuyenMuc: !MaChuyenMuc ? null : MaChuyenMuc,
          MaSach: !MaSach ? null : MaSach,
        });
        res.redirect("/slide");
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm slide", error });
      }
    });
  }

  // [GET] /slide/:id
  async edit(req, res) {
    const { id } = req.params;

    try {
      const slide = await Slide.findByPk(id);
      const categories = await Category.findAll();
      const books = await Book.findAll();

      if (!slide) {
        return res.status(404).json({ message: "Slide không tồn tại" });
      }

      res.render("slide/edit", { slide, categories, books, error: "" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tải slide", error });
    }
  }

  // [POST] /slide/:id
  async update(req, res) {
    const { id } = req.params;
    const uploadFiles = upload.single("HinhAnh"); // Chỉ upload một ảnh cho slide

    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Lỗi khi upload file", error: err.message });
      }

      const { MaChuyenMuc, MaSach } = req.body;
      const HinhAnh = req.file ? `/uploads/slide/${req.file.filename}` : null;

      try {
        const slide = await Slide.findByPk(id);

        if (!slide) {
          return res.status(404).json({ message: "Slide không tồn tại" });
        }

        slide.MaChuyenMuc = !MaChuyenMuc ? null : MaChuyenMuc;
        slide.MaSach = !MaSach ? null : MaSach;
        if (HinhAnh) slide.HinhAnh = HinhAnh;

        await slide.save();
        res.redirect("/slide");
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật slide", error });
      }
    });
  }

  // [GET] /slide/:id/delete
  async destroy(req, res) {
    const { id } = req.params;

    try {
      const slide = await Slide.findByPk(id);
      if (!slide) {
        return res.status(404).json({ message: "Slide không tồn tại" });
      }

      await slide.destroy();
      res.redirect("/slide");
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa slide", error });
    }
  }
}

module.exports = new slideController();
