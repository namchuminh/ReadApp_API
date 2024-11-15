const User = require("../models/user.model.js");

class userController {
  //[GET] /
  async index(req, res) {
    const users = await User.findAll();
    return res.json({ users });
  }
}

module.exports = new userController();