const API = "http://localhost:5000/api/job-posting";
const table = document.getElementById("table-data");

// Modal Inputs
const iid = document.getElementById("iid");
const title = document.getElementById("title");
const minSalary = document.getElementById("minSalary");
const maxSalary = document.getElementById("maxSalary");
const skills = document.getElementById("skills");
const link = document.getElementById("link");

// Search
const searchInput = document.getElementById("searchInput");
let currentSearch = "";

// Edit/View State
let isEdit = false;
let isView = false;
let editId = null;

/* ================= FETCH ================= */
async function fetchInternships(searchTerm = currentSearch) {
  const res = await fetch(API);
  const data = await res.json();

  let filteredData = data;

  if (searchTerm) {

    filteredData = data.filter(i =>
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.job_type && i.job_type.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  table.innerHTML = "";

  filteredData.forEach(i => {
                console.log("Filtered Data:", i.job_type);

    // Parse missing fields from job_type if not present
    const skills = (i.job_type && i.job_type.length > 0) ? i.job_type.join(", ") : '-';
 

    table.innerHTML += `
      <tr>
        <td>${i.id}</td>
        <td>${i.title}</td>
        <td>${i.salary.currency}${i.salary.min} - ${i.salary.max}</td>
        <td>${skills}</td>  
        <td>
          <a href="${i.referal_link}" target="_blank">Open</a>
        </td>
        <td>
          <button onclick="viewInternship('${i._id}')">👁️</button>
          <button onclick="editInternship('${i._id}')">✏️</button>
          <button onclick="deleteInternship('${i._id}')">❌</button>
        </td>
      </tr>
    `;
  });
}

/* ================= SAVE / UPDATE ================= */
async function saveInternship() {
  const body = {
    id: iid.value.trim(),
    title: title.value.trim(),
    salary: {
      min: Number(minSalary.value),
      max: Number(maxSalary.value)
    },
    job_type: skills.value.split(",").map(s => s.trim()),
    referal_link: link.value.trim()
  };
  if (isEdit) {
    await fetch(`${API}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  } else {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  }

  closeModal();
  fetchInternships();
}

/* ================= VIEW ================= */
async function viewInternship(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();

  iid.value = data.id;
  title.value = data.title;
  minSalary.value = data.salary.min;
  maxSalary.value = data.salary.max;
  skills.value = (data.job_type || []).join(", ");
  link.value = data.referal_link;

  isView = true;
  editId = id;

  // Set readonly
  setModalReadonly(true);

  document.querySelector(".modal-header h2").innerText = "View Internship";
  document.querySelector(".save-btn").style.display = "none";

  openModal();
}

/* ================= EDIT ================= */
async function editInternship(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();

  iid.value = data.id;
  title.value = data.title;
  minSalary.value = data.salary.min;
  maxSalary.value = data.salary.max;
  skills.value = (data.job_type || []).join(", ");
  link.value = data.referal_link;

  isEdit = true;
  editId = id;

  setModalReadonly(false);

  document.querySelector(".modal-header h2").innerText = "Update Internship";
  document.querySelector(".save-btn").innerText = "Update";
  document.querySelector(".save-btn").style.display = "block";

  openModal();
}

/* ================= DELETE ================= */
async function deleteInternship(id) {
  if (!confirm("Are you sure you want to delete this internship?")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  fetchInternships();
}

/* ================= MODAL ================= */
function openModal() {
  document.getElementById("internshipModal").style.display = "block";
}

function closeModal() {
  document.getElementById("internshipModal").style.display = "none";
  resetForm();
}

function setModalReadonly(readonly) {
  const inputs = document.querySelectorAll("#internshipModal input");
  inputs.forEach(input => input.readOnly = readonly);
}

/* ================= RESET ================= */
function resetForm() {
  iid.value = "";
  title.value = "";
  minSalary.value = "";
  maxSalary.value = "";
  skills.value = "";
  link.value = "";

  isEdit = false;
  isView = false;
  editId = null;

  setModalReadonly(false);

  document.querySelector(".modal-header h2").innerText = "Add Internship";
  document.querySelector(".save-btn").innerText = "Save";
  document.querySelector(".save-btn").style.display = "block";
}

/* ================= SEARCH ================= */
searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value.trim();
  fetchInternships();
});

/* ================= INIT ================= */
fetchInternships();
