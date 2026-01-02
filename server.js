require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/internship";

mongoose.connect(MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Internship Schema
const internshipSchema = new mongoose.Schema({
    title: { type: String, required: true },
    salary: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        currency: { type: String, default: "₹" }
    },
    job_type: [{ type: String, required: true }],
    referal_link: { type: String, required: true }
}, {
    timestamps: true
});

const Internship = mongoose.model("Internship", internshipSchema);

// Seed initial data (only run once)
async function seedData() {
    try {
        const count = await Internship.countDocuments();
        console.log(`📊 Current internship count: ${count}`);

        if (count === 0) {
            const internships = require("./internship.JSON");
            console.log(`📝 Seeding ${internships.length} internships to MongoDB...`);

            await Internship.insertMany(internships);
            console.log("✅ Initial data seeded successfully to MongoDB");

            // Verify seeding
            const newCount = await Internship.countDocuments();
            console.log(`📊 New internship count: ${newCount}`);
        } else {
            console.log("ℹ️ Data already exists, skipping seed");
        }
    } catch (error) {
        console.error("❌ Error seeding data:", error);
    }
}

seedData();

/* =====================
    READ (GET ALL)
===================== */
app.get("/internships", async (req, res) => {
    try {
        const internships = await Internship.find();
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: "Error fetching internships", error: error.message });
    }
});

/* =====================
    READ (GET BY ID)
===================== */
app.get("/internships/:id", async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ message: "Internship not found" });
        }
        res.json(internship);
    } catch (error) {
        res.status(500).json({ message: "Error fetching internship", error: error.message });
    }
});

/* =====================
    CREATE (POST)
===================== */
app.post("/internships", async (req, res) => {
    try {
        const newInternship = new Internship(req.body);
        const savedInternship = await newInternship.save();
        res.status(201).json(savedInternship);
    } catch (error) {
        res.status(400).json({ message: "Error creating internship", error: error.message });
    }
});

/* =====================
    UPDATE (PUT)
===================== */
app.put("/internships/:id", async (req, res) => {
    try {
        const updatedInternship = await Internship.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedInternship) {
            return res.status(404).json({ message: "Internship not found" });
        }
        res.json(updatedInternship);
    } catch (error) {
        res.status(400).json({ message: "Error updating internship", error: error.message });
    }
});

/* =====================
    DELETE
===================== */
app.delete("/internships/:id", async (req, res) => {
    try {
        const deletedInternship = await Internship.findByIdAndDelete(req.params.id);
        if (!deletedInternship) {
            return res.status(404).json({ message: "Internship not found" });
        }
        res.json({ message: "Internship deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting internship", error: error.message });
    }
});

/* =====================
    SERVER
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});