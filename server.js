const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

mongoose
  .connect("mongodb+srv://admin:admin@cluster0.1apqdc6.mongodb.net/job-posting")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/users", require("./internship_routes"));

app.get("/populate", async (req, res) => {
  try {
    const Internship = require("./internship");
    const fs = require("fs");
    const data = JSON.parse(fs.readFileSync("./internship.JSON", "utf8"));

    await Internship.deleteMany({});

    for (const item of data) {
      const min = Math.min(item.salary.min, item.salary.max);
      const max = Math.max(item.salary.min, item.salary.max);

      const internship = new Internship({
        id: item.id,
        title: item.title,
        salary: { min, max, currency: item.salary.currency },
        job_type: item.skills,
        referal_link: item.referal_link,
      });

      await internship.save();
    }

    res.send("Data populated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE an internship by MongoDB _id
app.delete("/api/users", async (req, res) => {
  try {
    const { id } = req.body; // Read id from JSON body

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const Internship = require("./internship"); // Your Mongoose model
    const deletedData = await Internship.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.json({
      message: "Internship deleted successfully",
      data: deletedData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE an internship by MongoDB _id
// app.put("/api/job-posting/:id", async (req, res) => {
//   try {
//     let { id } = req.params; // get id from URL
//     id = id.trim(); // <-- remove whitespace/newlines

//     const updateData = req.body;

//     const mongoose = require("mongoose");
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid ID format" });
//     }

//     const Internship = require("./internship");

//     const updatedInternship = await Internship.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedInternship) {
//       return res.status(404).json({ message: "Internship not found" });
//     }

//     res.json({
//       message: "Internship updated successfully",
//       data: updatedInternship
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.use("/api/users", require("./internship_routes"));

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
