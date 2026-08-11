const mongoose = require("mongoose");

const recruitmentSchema = new mongoose.Schema(
    {
        jobTitle: {
            type: String,
            required: true
        },

        department: {
            type: String,
            required: true
        },

        openings: {
            type: Number,
            default: 1
        },

        candidateName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String
        },

        experience: {
            type: String
        },

        skills: [String],

        resume: {
            type: String,
            default: ""
        },

        interviewDate: {
            type: Date
        },

        interviewer: {
            type: String
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Screening",
                "Interview",
                "HR Round",
                "Selected",
                "Rejected",
                "Offered",
                "Joined"
            ],
            default: "Applied"
        },

        remarks: {
            type: String,
            default: ""
        }

    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Recruitment", recruitmentSchema);