const { Op } = require("sequelize");
const User = require("../models/user.model.js");

class UserController {
  // [GET] /user 
  async index(req, res) {
    try {
      const { search = "", page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
  
      // Lấy danh sách người dùng với tìm kiếm và phân trang
      const { rows: users, count } = await User.findAndCountAll({
        where: {
          [Op.or]: [
            { HoTen: { [Op.like]: `%${search}%` } },
            { TaiKhoan: { [Op.like]: `%${search}%` } },
            { SoDienThoai: { [Op.like]: `%${search}%` } },
            { Email: { [Op.like]: `%${search}%` } },
          ],
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
      });
  
      return res.render("user/index", {
        users,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        search,
        error: "",
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tải danh sách người dùng", error });
    }
  }

  // [GET] /user/:id/block 
  async block(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      // Đổi trạng thái giữa 'activate' và 'blocked'
      user.TrangThai = user.TrangThai === "activate" ? "blocked" : "activate";
      await user.save();

      res.redirect("/user"); // Quay lại danh sách người dùng
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật trạng thái người dùng", error });
    }
  }
}

module.exports = new UserController();
