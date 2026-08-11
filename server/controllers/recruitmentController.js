const Recruitment = require("../models/Recruitment");

exports.getRecruitments = async (req, res) => {

    try {

        const data = await Recruitment.find().sort({ createdAt: -1 });

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.createRecruitment = async (req, res) => {

    try {

        const recruitment = await Recruitment.create(req.body);

        res.status(201).json(recruitment);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.updateRecruitment = async (req, res) => {

    try {

        const data = await Recruitment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

exports.deleteRecruitment = async (req, res) => {

    try {

        await Recruitment.findByIdAndDelete(req.params.id);

        res.json({
            message: "Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};