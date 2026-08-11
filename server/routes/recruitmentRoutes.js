const express = require("express");

const router = express.Router();

const {
    getRecruitments,
    createRecruitment,
    updateRecruitment,
    deleteRecruitment
} = require("../controllers/recruitmentController");

router.get("/", getRecruitments);

router.post("/", createRecruitment);

router.put("/:id", updateRecruitment);

router.delete("/:id", deleteRecruitment);

module.exports = router;