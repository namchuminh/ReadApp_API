const User = require('../models/user.model.js'); // Đảm bảo bạn có model User
const bcrypt = require('bcrypt'); // Nếu bạn lưu mật khẩu mã hóa
const { Op } = require("sequelize");

class authController {
    // [GET] /login 
    async login(req, res) {
        try {
            res.render('auth/login', { error: '' }); // Render trang login.ejs
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi hiển thị trang đăng nhập', error });
        }
    }

    // [POST] /login
    async submitLogin(req, res) {
        try {
            const { TaiKhoan, MatKhau } = req.body; // Lấy tài khoản và mật khẩu từ form

            // Kiểm tra tài khoản có tồn tại trong cơ sở dữ liệu không
            const user = await User.findOne({ where: { TaiKhoan } });
            if (!user) {
                return res.render('auth/login', { error: 'Tài khoản không tồn tại' });
            }

            // Kiểm tra mật khẩu
            const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);

            if (!isMatch) {
                return res.render('auth/login', { error: 'Mật khẩu không đúng' });
            }

            // Đặt thông tin người dùng vào session
            req.session.userId = user.MaNguoiDung; // Lưu userId vào session
            req.session.username = user.TaiKhoan;  // Lưu tài khoản vào session
            req.session.role = user.PhanQuyen;     // Lưu quyền vào session

            // Chuyển hướng đến trang dashboard
            return res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi đăng nhập', error });
        }
    }

    // [GET] /logout
    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi khi đăng xuất', err });
            }
            res.redirect('/login'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
        })
    }

    // [GET] /password
    async password(req, res) {
        try {
        res.render('auth/password', { error: '', success: '' }); // Render trang đổi mật khẩu
        } catch (error) {
        res.status(500).json({ message: 'Lỗi khi hiển thị trang đổi mật khẩu', error });
        }
    }
    
    // Phương thức POST để xử lý đổi mật khẩu
    async submitChangePassword(req, res) {
        try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.session.userId;
    
        // Kiểm tra mật khẩu mới và mật khẩu xác nhận có khớp không
        if (newPassword !== confirmPassword) {
            return res.render('auth/password', { error: 'Mật khẩu mới và mật khẩu xác nhận không khớp', success: '' });
        }
    
        // Lấy người dùng từ session
        const user = await User.findByPk(userId);
        if (!user) {
            return res.render('auth/password', { error: 'Người dùng không tồn tại', success: '' });
        }
    
        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.MatKhau);
        if (!isMatch) {
            return res.render('auth/password', { error: 'Mật khẩu cũ không đúng', success: '' });
        }
    
        // Mã hóa mật khẩu mới và lưu vào cơ sở dữ liệu
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.MatKhau = hashedNewPassword;
        await user.save();
    
        res.render('auth/password', { error: '', success: 'Mật khẩu đã được thay đổi thành công' });
        } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thay đổi mật khẩu', error });
        }
    }
}

module.exports = new authController();
