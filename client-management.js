document.addEventListener('DOMContentLoaded', () => {
    
    // १. Mobile Sidebar Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        const toggleIcon = menuToggle.querySelector('i');
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
            const filter = this.value.toLowerCase();
            document.querySelectorAll('#userTableBody tr').forEach(row => {
                row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
            });
        });
    }

    // ३. Event Delegation (Edit/Delete)
    const userTableBody = document.getElementById('userTableBody');
    if (userTableBody) {
        userTableBody.addEventListener('click', function(e) {
            // Delete
            if (e.target.closest('.btn-action-delete')) {
                if(confirm("Delete this user?")) e.target.closest('tr').remove();
            }
            // Edit
            if (e.target.closest('.btn-action-edit')) {
                editingRow = e.target.closest('tr');
                openUserModal(true);
            }
        });
    }
});

// ४. Global Modal Logic
let editingRow = null;

function openUserModal(isEdit = false) {
    const modal = document.getElementById('userModal');
    if(!modal) return; // सेफ्टी चेक
    
    modal.style.display = 'flex';
    const title = document.getElementById('modalTitle');
    
    if (isEdit && editingRow) {
        title.innerText = "Edit User";
        document.getElementById('fName').value = editingRow.cells[0].innerText;
        document.getElementById('email').value = editingRow.cells[1].innerText;
        document.getElementById('role').value = editingRow.cells[2].innerText;
    } else {
        editingRow = null;
        title.innerText = "Add New User";
        document.getElementById('fName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('role').value = '';
    }
}

function saveUser() {
    const fName = document.getElementById('fName').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    if (editingRow) {
        // Update
        editingRow.cells[0].innerHTML = `<strong>${fName}</strong>`;
        editingRow.cells[1].innerText = email;
        editingRow.cells[2].innerHTML = `<span class="badge-role">${role}</span>`;
    } else {
        // Create
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><strong>${fName}</strong></td>
            <td>${email}</td>
            <td><span class="badge-role">${role}</span></td>
            <td><span class="badge-active">Active</span></td>
            <td>
                <button class="btn-action-edit"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                <button class="btn-action-delete"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
        `;
        document.getElementById('userTableBody').appendChild(newRow);
    }
    closeModal();
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}