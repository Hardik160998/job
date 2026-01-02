let allInternships = [];

async function loadInternships() {
    try {
        const response = await fetch('internship.JSON');
        allInternships = await response.json();
        displayInternships(allInternships);
    } catch (error) {
        console.error('Error loading internships:', error);
    }
}

function displayInternships(data) {
    const tableBody = document.getElementById("table-data");
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        const company = item.job_type[0] || "-";
        const skills = item.job_type.slice(1, 5).join(", ");
        const durationStr = item.job_type.find(v => v.toLowerCase().includes("duration")) || "-";
        const duration = durationStr.includes(":") ? durationStr.split(":")[1].trim() : durationStr;
        const stipendStr = item.job_type.find(v => v.toLowerCase().includes("stipend")) || "-";
        const stipend = stipendStr.includes(":") ? stipendStr.split(":")[1].trim() : stipendStr;
        const typeStr = item.job_type.find(v => v.toLowerCase().includes("work")) || "-";
        let type = typeStr.includes(":") ? typeStr.split(":")[1].trim() : typeStr;
        if (index >= data.length - 3) {
            type = company;
        }
        const timeStr = item.job_type.find(v => v.toLowerCase().includes("time")) || "-";
        const time = timeStr.includes(":") ? timeStr.split(":")[1].trim() : timeStr;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${company}</td>
            <td>${skills}</td>
            <td>${item.salary.currency}${item.salary.min} - ${item.salary.currency}${item.salary.max}</td>
            <td>${duration}</td>
            <td>${stipend}</td>
            <td>${type}</td>
            <td>${time}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewInternship('${item.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editInternship('${item.id}')" title="Edit Internship">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteInternship('${item.id}')" title="Delete Internship">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <a href="${item.referal_link}" target="_blank" class="apply-link">Apply</a>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function searchInternships() {
    const searchTerm = document.getElementById('Internship').value.toLowerCase().trim();

    if (searchTerm === '') {
        displayInternships(allInternships);
        return;
    }

    const filteredInternships = allInternships.filter(internship => {
    
        const searchableText = [
            internship.id,
            internship.title,
            internship.job_type.join(' '),
            internship.salary.currency + internship.salary.min,
            internship.salary.currency + internship.salary.max,
            internship.referal_link
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTerm);
    });

    displayInternships(filteredInternships);
}

document.getElementById('searchBtn').addEventListener('click', searchInternships);
document.getElementById('Internship').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchInternships();
    }
});

// Action Functions
function viewInternship(id) {
    const internship = allInternships.find(item => item.id === id);
    if (internship) {
        const company = internship.job_type[0] || "N/A";
        const skills = internship.job_type.slice(1, 5);
        const duration = internship.job_type.find(v => v.toLowerCase().includes("duration")) || "N/A";
        const stipend = internship.job_type.find(v => v.toLowerCase().includes("stipend")) || "N/A";
        const workType = internship.job_type.find(v => v.toLowerCase().includes("work")) || "N/A";
        const workTime = internship.job_type.find(v => v.toLowerCase().includes("time")) || "N/A";

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h3>${internship.title}</h3>

            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Salary Range:</strong> ₹${internship.salary.min} - ₹${internship.salary.max} (${internship.salary.currency})</p>
            <p><strong>Duration:</strong> ${duration.replace("Duration:", "").replace("Internship Duration:", "").trim()}</p>
            <p><strong>Stipend:</strong> ${stipend.replace("Stipend:", "").trim()}</p>
            <p><strong>Work Type:</strong> ${workType.replace("Internship Type:", "").replace("Job Type:", "").trim()}</p>
            <p><strong>Work Timing:</strong> ${workTime.replace("Internship Timing:", "").replace("Job Timing:", "").trim()}</p>

            <p><strong>Skills Required:</strong></p>
            <div class="skill-tags">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>

            <p><strong>Internship ID:</strong> ${internship.id}</p>

            <div class="apply-section">
                <a href="${internship.referal_link}" target="_blank" class="apply-btn-modal">Apply Now</a>
            </div>
        `;

        document.getElementById('internshipModal').style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal() {
    document.getElementById('internshipModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('internshipModal');
    if (event.target === modal) {
        closeModal();
    }
}

let currentEditId = null;

function addInternship() {
    currentEditId = null;
    document.getElementById('modal-title').textContent = 'Add Internship';
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form class="edit-form" id="edit-form">
            <div class="form-group">
                <label for="edit-title">Title</label>
                <input type="text" id="edit-title" value="" required>
            </div>

            <div class="form-group">
                <label for="edit-company">Company</label>
                <input type="text" id="edit-company" value="" required>
            </div>

            <div class="form-group">
                <label for="edit-min-salary">Minimum Salary</label>
                <input type="number" id="edit-min-salary" value="" required>
            </div>

            <div class="form-group">
                <label for="edit-max-salary">Maximum Salary</label>
                <input type="number" id="edit-max-salary" value="" required>
            </div>

            <div class="form-group">
                <label for="edit-duration">Duration</label>
                <input type="text" id="edit-duration" value="" placeholder="e.g., 3 months">
            </div>

            <div class="form-group">
                <label for="edit-stipend">Stipend</label>
                <input type="text" id="edit-stipend" value="" placeholder="e.g., 5,000 /Month">
            </div>

            <div class="form-group">
                <label for="edit-work-type">Work Type</label>
                <select id="edit-work-type">
                    <option value="Work From Home">Work From Home</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
            </div>

            <div class="form-group">
                <label for="edit-work-time">Work Timing</label>
                <select id="edit-work-time">
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                </select>
            </div>

            <div class="form-group">
                <label>Skills</label>
                <div class="skill-input-container">
                    <input type="text" id="new-skill" placeholder="Add a skill">
                    <button type="button" class="add-skill-btn" onclick="addSkill()">Add</button>
                </div>
                <div class="skill-tags-edit" id="skill-tags-edit">
                </div>
            </div>

            <div class="form-group">
                <label for="edit-link">Application Link</label>
                <input type="url" id="edit-link" value="" required>
            </div>
        </form>
    `;

    document.getElementById('modal-footer').style.display = 'flex';
    document.getElementById('internshipModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function editInternship(id) {
    const internship = allInternships.find(item => item.id === id);
    if (internship) {
        currentEditId = id;
        const company = internship.job_type[0] || "";
        const skills = internship.job_type.slice(1, 5);
        const duration = internship.job_type.find(v => v.toLowerCase().includes("duration")) || "";
        const stipend = internship.job_type.find(v => v.toLowerCase().includes("stipend")) || "";
        const workType = internship.job_type.find(v => v.toLowerCase().includes("work")) || "";
        const workTime = internship.job_type.find(v => v.toLowerCase().includes("time")) || "";

        document.getElementById('modal-title').textContent = 'Edit Internship';
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <form class="edit-form" id="edit-form">
                <div class="form-group">
                    <label for="edit-title">Title</label>
                    <input type="text" id="edit-title" value="${internship.title}" required>
                </div>

                <div class="form-group">
                    <label for="edit-company">Company</label>
                    <input type="text" id="edit-company" value="${company}" required>
                </div>

                <div class="form-group">
                    <label for="edit-min-salary">Minimum Salary</label>
                    <input type="number" id="edit-min-salary" value="${internship.salary.min}" required>
                </div>

                <div class="form-group">
                    <label for="edit-max-salary">Maximum Salary</label>
                    <input type="number" id="edit-max-salary" value="${internship.salary.max}" required>
                </div>

                <div class="form-group">
                    <label for="edit-duration">Duration</label>
                    <input type="text" id="edit-duration" value="${duration.replace('Duration:', '').replace('Internship Duration:', '').trim()}" placeholder="e.g., 3 months">
                </div>

                <div class="form-group">
                    <label for="edit-stipend">Stipend</label>
                    <input type="text" id="edit-stipend" value="${stipend.replace('Stipend:', '').trim()}" placeholder="e.g., 5,000 /Month">
                </div>

                <div class="form-group">
                    <label for="edit-work-type">Work Type</label>
                    <select id="edit-work-type">
                        <option value="Work From Home" ${workType.includes('Work From Home') ? 'selected' : ''}>Work From Home</option>
                        <option value="On-site" ${workType.includes('On-site') ? 'selected' : ''}>On-site</option>
                        <option value="Hybrid" ${workType.includes('Hybrid') ? 'selected' : ''}>Hybrid</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="edit-work-time">Work Timing</label>
                    <select id="edit-work-time">
                        <option value="Full Time" ${workTime.includes('Full Time') ? 'selected' : ''}>Full Time</option>
                        <option value="Part Time" ${workTime.includes('Part Time') ? 'selected' : ''}>Part Time</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Skills</label>
                    <div class="skill-input-container">
                        <input type="text" id="new-skill" placeholder="Add a skill">
                        <button type="button" class="add-skill-btn" onclick="addSkill()">Add</button>
                    </div>
                    <div class="skill-tags-edit" id="skill-tags-edit">
                        ${skills.map(skill => `<span class="skill-tag-edit">${skill} <span class="remove-skill" onclick="removeSkill('${skill}')">&times;</span></span>`).join('')}
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit-link">Application Link</label>
                    <input type="url" id="edit-link" value="${internship.referal_link}" required>
                </div>
            </form>
        `;

        document.getElementById('modal-footer').style.display = 'flex';
        document.getElementById('internshipModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function removeSkill(skill) {
    const skillTags = document.querySelectorAll('.skill-tag-edit');
    skillTags.forEach(tag => {
        if (tag.textContent.includes(skill)) {
            tag.remove();
        }
    });
}

function addSkill() {
    const newSkillInput = document.getElementById('new-skill');
    const skill = newSkillInput.value.trim();
    if (skill) {
        const skillTagsEdit = document.getElementById('skill-tags-edit');
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag-edit';
        skillTag.innerHTML = `${skill} <span class="remove-skill" onclick="removeSkill('${skill}')">&times;</span>`;
        skillTagsEdit.appendChild(skillTag);
        newSkillInput.value = '';
    }
}

function saveInternship() {
    let internship;
    if (!currentEditId) {
        // Adding new internship
        const newId = allInternships.length > 0 ? Math.max(...allInternships.map(i => parseInt(i.id))) + 1 : 1;
        internship = {
            id: newId.toString(),
            title: '',
            job_type: [],
            salary: { min: 0, max: 0, currency: '₹' },
            referal_link: ''
        };
        allInternships.push(internship);
        currentEditId = newId.toString();
    } else {
        internship = allInternships.find(item => item.id === currentEditId);
    }
    if (internship) {
        // Get form values
        const title = document.getElementById('edit-title').value.trim();
        const company = document.getElementById('edit-company').value.trim();
        const minSalary = parseInt(document.getElementById('edit-min-salary').value);
        const maxSalary = parseInt(document.getElementById('edit-max-salary').value);
        const duration = document.getElementById('edit-duration').value.trim();
        const stipend = document.getElementById('edit-stipend').value.trim();
        const workType = document.getElementById('edit-work-type').value;
        const workTime = document.getElementById('edit-work-time').value;
        const link = document.getElementById('edit-link').value.trim();

        // Get skills
        const skillTags = document.querySelectorAll('.skill-tag-edit');
        const skills = Array.from(skillTags).map(tag => tag.textContent.replace(' ×', '').trim());

        // Validate required fields
        if (!title || !company || !link || isNaN(minSalary) || isNaN(maxSalary)) {
            alert('Please fill in all required fields with valid values.');
            return;
        }

        // Update internship data
        internship.title = title;
        internship.salary.min = minSalary;
        internship.salary.max = maxSalary;
        internship.referal_link = link;

        // Rebuild job_type array
        internship.job_type = [
            company,
            ...skills,
            `Duration: ${duration}`,
            `Stipend: ${stipend}`,
            `Internship Type: ${workType}`,
            `Internship Timing: ${workTime}`,
            "Working Days: 5 Days",
            "Schedule: Flexible Work Hours",
            "Letter of Recommendation"
        ];

        // Refresh table and close modal
        displayInternships(allInternships);
        closeModal();
        alert('Internship updated successfully!');
    }
}

function deleteInternship(id) {
    if (confirm("Are you sure you want to delete this internship?")) {
        const index = allInternships.findIndex(item => item.id === id);
        if (index !== -1) {
            allInternships.splice(index, 1);
            displayInternships(allInternships);
            alert("Internship deleted successfully!");
        }
    }
}

loadInternships();

