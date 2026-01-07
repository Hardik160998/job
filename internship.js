const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    salary: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: "₹"
        }
    },
    job_type: {
        type: [String],
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
   
    referal_link: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Internship", internshipSchema);
