const { Op } = require("sequelize");

const Category = require("../models/category.model.js");
const multer = require("multer");
const path = require("path");

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/category"); // Thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file unique
  },
});
const upload = multer({ storage });

class categoryController {
  //[GET] /category
  async index(req, res) {
    try {
      const { search = "", page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Tìm kiếm và phân trang
      const { rows: categories, count } = await Category.findAndCountAll({
        where: {
          TenChuyenMuc: {
            [Op.like]: `%${search}%`, // Tìm kiếm gần đúng
          },
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']],
      });

      return res.render("category/index", { 
        categories, 
        currentPage: parseInt(page), 
        totalPages: Math.ceil(count / limit), 
        search, 
        error: ""
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tải chuyên mục", error });
    }
  }

  //[GET] /category/add
  async create(req, res) {
    res.render("category/create");
  }

  //[POST] /category/add
  async store(req, res) {
    const uploadSingle = upload.single("HinhAnh"); // Tên trường upload từ form
    uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Lỗi khi upload ảnh", error: err.message });
      }

      const { TenChuyenMuc } = req.body;
      const HinhAnh = req.file ? `/uploads/category/${req.file.filename}` : "";

      try {
        await Category.create({ TenChuyenMuc, HinhAnh });
        res.redirect("/category");
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm chuyên mục", error });
      }
    });
  }

  //[GET] /category/:id
  async edit(req, res) {
    const { id } = req.params;

    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "Chuyên mục không tồn tại" });
      }

      res.render("category/edit", { category });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy chuyên mục", error });
    }
  }

  //[POST] /category/:id
  async update(req, res) {
    const { id } = req.params;
    const uploadSingle = upload.single("HinhAnh");

    uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Lỗi khi upload ảnh", error: err.message });
      }

      const { TenChuyenMuc } = req.body;
      const HinhAnh = req.file ? `/uploads/category/${req.file.filename}` : null;

      try {
        const category = await Category.findByPk(id);
        if (!category) {
          return res.status(404).json({ message: "Chuyên mục không tồn tại" });
        }

        if (HinhAnh) {
          category.HinhAnh = HinhAnh; // Cập nhật ảnh nếu có
        }
        category.TenChuyenMuc = TenChuyenMuc;

        await category.save();
        res.redirect("/category");
      } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật chuyên mục", error });
      }
    });
  }

  //[GET] /category/:id/delete
  async destroy(req, res) {
    const { id } = req.params;

    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "Chuyên mục không tồn tại" });
      }

      await category.destroy();
      res.redirect("/category");
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa chuyên mục", error });
    }
  }
}

module.exports = new categoryController();
