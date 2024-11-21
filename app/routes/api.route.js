const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api.controller");

router.get("/slides", apiController.slides);
router.get("/books", apiController.books);
router.get("/categories", apiController.categories);
router.get("/recommendBook", apiController.recommendBook);
router.get("/topRead", apiController.topRead);
router.get("/bookByCategory", apiController.bookByCategory);
router.post("/login", apiController.login);
router.post("/register", apiController.register);
router.get("/profile/:id", apiController.profile);
router.post("/library", apiController.addLibrary);
router.get("/library/:id", apiController.getLibrary);
router.get("/books/:id", apiController.book);


module.exports = router;
