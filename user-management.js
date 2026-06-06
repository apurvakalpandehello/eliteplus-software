document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Sidebar Open/Close Toggle Mechanism
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', (e) => {
        sidebar.classList.toggle('open');
        e.stopPropagation();

        // आयकॉन बदलणे (Bars <-> Xmark)
        if (sidebar.classList.contains('open')) {
            toggleIcon.className = 'fa-solid fa-xmark';
        } else {
            toggleIcon.className = 'fa-solid fa-bars';
        }
    });

    // साईडबारच्या बाहेर कुठेही क्लिक केल्यास साईडबार बंद करणे
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 991 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && e.target !== menuToggle) {
                sidebar.classList.remove('open');
                toggleIcon.className = 'fa-solid fa-bars';
            }
        }
    });
});




document.addEventListener('DOMContentLoaded', () => {
    
    // १. Mobile Sidebar Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = menuToggle ? menuToggle.querySelector('i') : null;

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            sidebar.classList.toggle('open');
            e.stopPropagation();
            toggleIcon.className = sidebar.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 991 && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && e.target !== menuToggle) {
                    sidebar.classList.remove('open');
                    toggleIcon.className = 'fa-solid fa-bars';
                }
            }
        });
    }

    // २. Search Functionality
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const filter = this.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#userTableBody tr');
            rows.forEach(row => {
                row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
            });
        });
    }

    // ३. CRUD Operations (Event Delegation)
    const userTableBody = document.getElementById('userTableBody');
    if (userTableBody) {
        userTableBody.addEventListener('click', function(e) {
            // Delete Logic
            if (e.target.closest('.btn-action-delete')) {
                if(confirm("Are you sure you want to delete this user?")) {
                    e.target.closest('tr').remove();
                }
            }
            // Edit Logic
            if (e.target.closest('.btn-action-edit')) {
                openUserModal(e.target.closest('tr'));
            }
        });
    }

    // ४. Add User Button
    const addBtn = document.querySelector('.btn-add-user');
    if (addBtn) {
        addBtn.addEventListener('click', () => openUserModal(null));
    }
});

// --- Modal Management Functions ---
let editingRow = null;

function openUserModal(row = null) {
    const modal = document.getElementById('userModal');
    modal.style.display = 'flex';
    
    if(row) {
        editingRow = row;
        document.getElementById('modalTitle').innerText = "Edit User";
        document.getElementById('fName').value = row.cells[0].innerText;
        document.getElementById('uName').value = row.cells[1].innerText;
        document.getElementById('role').value = row.cells[2].innerText;
        document.getElementById('email').value = row.cells[3].innerText;
        document.getElementById('phone').value = row.cells[4].innerText;
    } else {
        editingRow = null;
        document.getElementById('modalTitle').innerText = "Add New User";
        document.querySelectorAll('.modal-content input').forEach(i => i.value = '');
    }
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

function saveUser() {
    const fName = document.getElementById('fName').value;
    const uName = document.getElementById('uName').value;
    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if(!fName) { alert("Please enter a name"); return; }

    if(editingRow) {
        editingRow.cells[0].innerText = fName;
        editingRow.cells[1].innerText = uName;
        editingRow.cells[2].innerText = role;
        editingRow.cells[3].innerText = email;
        editingRow.cells[4].innerText = phone;
    } else {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${fName}</td><td>${uName}</td><td>${role}</td><td>${email}</td><td>${phone}</td>
            <td>
                <button class="btn-action-edit"><i class="fa-solid fa-pen"></i> Edit</button>
                <button class="btn-action-delete"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
        `;
        document.getElementById('userTableBody').appendChild(newRow);
    }
    closeModal();
}