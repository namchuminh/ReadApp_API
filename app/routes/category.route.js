const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.get("/add", categoryController.create);
router.post("/add", categoryController.store);
router.get("/:id", categoryController.edit);
router.post("/:id", categoryController.update);
router.get("/:id/delete", categoryController.destroy);
router.get("/", categoryController.index);

module.exports = router;
