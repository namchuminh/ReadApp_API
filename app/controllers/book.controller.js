const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const Book = require("../models/book.model.js");
const Category = require("../models/category.model.js");

// Cấu hình multer cho upload ảnh và tệp PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const uploadPath = isImage ? "uploads/book/image" : "uploads/book/pdf";
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file unique
  },
});

const upload = multer({ storage });

class bookController {
  //[GET] /book
  async index(req, res) {
    try {
      const { search = "", page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Lấy danh sách sách với phân trang
      const { rows: books, count } = await Book.findAndCountAll({
        include: [{ model: Category, as: "category" }],
        where: {
          TenSach: { [Op.like]: `%${search}%` },
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']],
      });

      return res.render("book/index", {
        books,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        search,
        error: "",
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tải sách", error });
    }
  }

  //[GET] /book/add
  async create(req, res) {
    try {
      const categories = await Category.findAll();
      res.render("book/create", { categories });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tải chuyên mục", error });
    }
  }

  //[POST] /book/add
  async store(req, res) {
    const uploadFiles = upload.fields([
      { name: "HinhAnh", maxCount: 1 },
      { name: "TepTin", maxCount: 1 },
    ]);

    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Lỗi khi upload file", error: err.message });
      }

      const { TenSach, TacGia, NamXuatBan, MaChuyenMuc } = req.body;
      const HinhAnh = req.files["HinhAnh"] ? `/uploads/book/image/${req.files["HinhAnh"][0].filename}` : "";
      const TepTin = req.files["TepTin"] ? `/uploads/book/pdf/${req.files["TepTin"][0].filename}` : "";

      try {
        await Book.create({
          TenSach,
          TacGia,
          NamXuatBan,
          MaChuyenMuc,
          HinhAnh,
          TepTin,
        });
        res.redirect("/book");
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm sách", error });
      }
    });
  }

  //[GET] /book/:id
  async edit(req, res) {
    const { id } = req.params;

    try {
      const book = await Book.findByPk(id);
      const categories = await Category.findAll();

      if (!book) {
        return res.status(404).json({ message: "Sách không tồn tại" });
      }

      res.render("book/edit", { book, categories });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tải sách", error });
    }
  }

  //[POST] /book/:id
  async update(req, res) {
    const { id } = req.params;
    const uploadFiles = upload.fields([
      { name: "HinhAnh", maxCount: 1 },
      { name: "TepTin", maxCount: 1 },
    ]);

    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Lỗi khi upload file", error: err.message });
      }

      const { TenSach, TacGia, NamXuatBan, MaChuyenMuc } = req.body;
      const HinhAnh = req.files["HinhAnh"] ? `/uploads/book/image/${req.files["HinhAnh"][0].filename}` : null;
      const TepTin = req.files["TepTin"] ? `/uploads/book/pdf/${req.files["TepTin"][0].filename}` : null;

      try {
        const book = await Book.findByPk(id);

        if (!book) {
          return res.status(404).json({ message: "Sách không tồn tại" });
        }

        // Cập nhật thông tin sách
        book.TenSach = TenSach;
        book.TacGia = TacGia;
        book.NamXuatBan = NamXuatBan;
        book.MaChuyenMuc = MaChuyenMuc;
        if (HinhAnh) book.HinhAnh = HinhAnh;
        if (TepTin) book.TepTin = TepTin;

        await book.save();
        res.redirect("/book");
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật sách", error });
      }
    });
  }

  //[GET] /book/:id/delete
  async destroy(req, res) {
    const { id } = req.params;

    try {
      const book = await Book.findByPk(id);
      if (!book) {
        return res.status(404).json({ message: "Sách không tồn tại" });
      }

      await book.destroy();
      res.redirect("/book");
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa sách", error });
    }
  }
}

module.exports = new bookController();
