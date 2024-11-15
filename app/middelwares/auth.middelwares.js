function isAuthenticated(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login'); // Nếu không có session, chuyển hướng đến trang đăng nhập
    }
    next(); // Nếu có session, cho phép tiếp tục
}

function isAuthenticatedTrue(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/'); // Nếu có session, chuyển hướng đến trang chủ
    }
    next(); // Nếu không session, cho phép tiếp tục
}

module.exports = { isAuthenticated, isAuthenticatedTrue };
