const User = require('../models/user.model.js'); // Đảm bảo bạn có model User
const Book = require('../models/book.model.js'); // Đảm bảo bạn có model Book
const Category = require('../models/category.model.js'); // Đảm bảo bạn có model Category
const Slide = require('../models/slide.model.js'); // Đảm bảo bạn có model Banner
const Library = require('../models/library.model.js'); // Đảm bảo bạn có model Banner
const { Op, Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = "your_jwt_secret_key";

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

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Vui lòng nhập tài khoản mật khẩu." });
      }

      // Tìm user theo tài khoản, email hoặc số điện thoại
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { TaiKhoan: username },
            { Email: username },
            { SoDienThoai: username },
          ],
        },
      });

      // Kiểm tra user có tồn tại
      if (!user) {
        return res.status(401).json({ message: "Tài khoản không tồn tại." });
      }

      // So sánh mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.MatKhau);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Mật khẩu không chính xác." });
      }

      // Tạo payload JWT
      const payload = {
        MaNguoiDung: user.MaNguoiDung,
        HoTen: user.HoTen,
        TaiKhoan: user.TaiKhoan,
        SoDienThoai: user.SoDienThoai,
        Email: user.Email,
        PhanQuyen: user.PhanQuyen,
      };

      // Tạo token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

      return res.json({ message: "Đăng nhập thành công.", token });
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại." });
    }
  }

  async register(req, res) {
    try {
      const { HoTen, TaiKhoan, SoDienThoai, Email, MatKhau } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!HoTen || !TaiKhoan || !SoDienThoai || !Email || !MatKhau) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
      }

      // Kiểm tra trùng lặp tài khoản, email hoặc số điện thoại
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { TaiKhoan },
            { Email },
            { SoDienThoai },
          ],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Tài khoản, email hoặc số điện thoại đã được sử dụng.",
        });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(MatKhau, 10);

      // Tạo người dùng mới
      const newUser = await User.create({
        HoTen,
        TaiKhoan,
        SoDienThoai,
        Email,
        MatKhau: hashedPassword,
        PhanQuyen: "user", // Mặc định là user nếu không truyền vào
        TrangThai: "activate", // Mặc định trạng thái là kích hoạt
      });

      // Tạo payload JWT
      const payload = {
        MaNguoiDung: newUser.MaNguoiDung,
        HoTen: newUser.HoTen,
        TaiKhoan: newUser.TaiKhoan,
        SoDienThoai: newUser.SoDienThoai,
        Email: newUser.Email,
        PhanQuyen: newUser.PhanQuyen,
      };

      // Tạo token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

      return res.status(201).json({
        message: "Đăng ký thành công.",
        token,
      });
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại." });
    }
  }

  async profile(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Không tìm thấy user" });
      }

      // Tìm user theo tài khoản, email hoặc số điện thoại
      const user = await User.findOne({
        where: {
          MaNguoiDung: id
        },
      });

      // Kiểm tra user có tồn tại
      if (!user) {
        return res.status(401).json({ message: "Không tìm thấy user" });
      }

      return res.json(user);
    } catch (error) {
      console.error("Lấy thông tin user thất bại:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại." });
    }
  }

  async addLibrary(req, res) {
    try {
      const { MaSach, MaNguoiDung } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!MaSach || !MaNguoiDung) {
        return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ MaSach và MaNguoiDung." });
      }

      // Kiểm tra xem sách đã tồn tại trong thư viện người dùng chưa
      const existingLibrary = await Library.findOne({
        where: {
          MaSach,
          MaNguoiDung
        }
      });

      if (existingLibrary) {
        return res.status(400).json({ message: "Sách đã tồn tại trong thư viện!" });
      }

      // Thêm sách vào thư viện
      const newLibraryEntry = await Library.create({ MaSach, MaNguoiDung });

      return res.status(201).json({
        message: "Thêm sách vào thư viện thành công.",
        library: newLibraryEntry
      });
    } catch (error) {
      console.error("Thêm sách vào thư viện thất bại:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại." });
    }
  }

  async getLibrary(req, res) {
    const { id } = req.params;

    try {
      // Kiểm tra đầu vào
      if (!id) {
        return res.status(400).json({ message: "Vui lòng cung cấp mã người dùng." });
      }

      // Tìm tất cả sách trong thư viện của người dùng
      const library = await Library.findAll({
        where: { MaNguoiDung: id },
        include: [
          {
            model: Book,
            as: "book",
            attributes: ["MaSach", "TenSach", "TacGia", "HinhAnh"], // Chỉ lấy các cột cần thiết
          },
        ],
      });

      // Nếu không có sách nào trong thư viện
      if (library.length === 0) {
        return res.status(200).json({ data: [] });
      }

      // Trả về danh sách sách
      return res.status(200).json({
        message: "Lấy thư viện thành công.",
        data: library.map(entry => ({
          MaSach: entry.book.MaSach,
          TenSach: entry.book.TenSach,
          TacGia: entry.book.TacGia,
          HinhAnh: entry.book.HinhAnh,
        })),
      });
    } catch (error) {
      console.error("Lấy thư viện thất bại:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại." });
    }
  }

  async book(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Không tìm thấy sách" });
      }

      const book = await Book.findOne({
        where: {
          MaSach: id
        },
      });

      if (!book) {
        return res.status(401).json({ message: "Không tìm thấy sách" });
      }

      return res.json(book);
    } catch (error) {
      console.error("Lấy thông tin sách thất bại:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại." });
    }
  }

}

module.exports = new authController();
