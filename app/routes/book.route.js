const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");

router.get("/add", bookController.create);
router.post("/add", bookController.store);
router.get("/:id", bookController.edit);
router.post("/:id", bookController.update);
router.get("/:id/delete", bookController.destroy);
router.get("/", bookController.index);

module.exports = router;
