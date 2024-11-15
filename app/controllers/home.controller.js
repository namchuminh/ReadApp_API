class homeController {
  //[GET] /
  async index(req, res) {
    try {
      return res.render("home/index");
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tải trang chủ", error });
    }
  }

}

module.exports = new homeController();
