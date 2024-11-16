const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api.controller");

router.get("/slides", apiController.slides);
router.get("/books", apiController.books);
router.get("/categories", apiController.categories);
router.get("/recommendBook", apiController.recommendBook);
router.get("/topRead", apiController.topRead);
router.get("/bookByCategory", apiController.bookByCategory);

module.exports = router;
