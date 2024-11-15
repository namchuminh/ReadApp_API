const express = require("express");
const router = express.Router();
const slideController = require("../controllers/slide.controller");

router.get("/add", slideController.create);
router.post("/add", slideController.store);
router.get("/:id", slideController.edit);
router.post("/:id", slideController.update);
router.get("/:id/delete", slideController.destroy);
router.get("/", slideController.index);

module.exports = router;
