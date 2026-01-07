const express = require("express");
const router = express.Router();
const Internship = require("./internship");
const mongoose = require("mongoose");

/* CREATE Internship */
router.post("/", async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json(internship);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* GET ALL Internships */
router.get("/", async (req, res) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE Internship */
router.delete("/:id", async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: "Internship deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET SINGLE Internship */
router.get("/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    res.json(internship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* UPDATE Internship */
// router.put("/:id", async (req, res) => {
//   try {
//     const updated = await Internship.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

router.put("/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const updated = await Internship.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.json({
      message: "Internship updated successfully",
      data: updated
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
