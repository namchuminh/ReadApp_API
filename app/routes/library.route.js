const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/library.controller");

router.get("/add", libraryController.create);
router.post("/add", libraryController.store);
router.get("/:id", libraryController.edit);
router.post("/:id", libraryController.update);
router.get("/:id/delete", libraryController.destroy);
router.get("/", libraryController.index);

module.exports = router;
