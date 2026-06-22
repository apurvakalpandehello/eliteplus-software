document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sidebar Toggle Mechanics ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        const toggleIcon = menuToggle.querySelector('i');
        menuToggle.addEventListener('click', (e) => {
            sidebar.classList.toggle('active-mobile');
            e.stopPropagation();
            toggleIcon.className = sidebar.classList.contains('active-mobile') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });
    }

    // --- 2. Save Company Profile Logic ---
    const saveCompanyBtn = document.getElementById('btnSaveCompany');
    const companyForm = document.querySelector('form');
    const tableBody = document.getElementById('userTableBody');

    if (saveCompanyBtn) {
        saveCompanyBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const compName = document.querySelector('input[placeholder="Enter Company Name"]').value;
            const email = document.querySelector('input[placeholder="Email"]').value;

            if (compName.trim() === "") {
                alert("Please enter Company Name!");
                return;
            }

            const newTableRow = document.createElement('tr');
            newTableRow.setAttribute('data-id', 'company-' + Date.now()); 

            newTableRow.innerHTML = `
                <td class="fw-semibold text-dark user-name">${compName} (Company)</td>
                <td class="text-secondary user-email">${email}</td>
                <td><span class="badge bg-light text-dark border px-2 py-1 user-role">Company</span></td>
                <td><span class="badge-active-status user-status" data-status="Active">Active</span></td>
                <td class="text-end">
                    <button class="btn btn-table-edit btn-edit-trigger"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button class="btn btn-table-delete btn-delete-trigger"><i class="fa-solid fa-trash-can"></i> Delete</button>
                </td>
            `;

            tableBody.prepend(newTableRow); 
            alert("Company profile saved to Table!");
            companyForm.reset();
        });
    }

    // --- 3. User Management Logic ---
    const userModalElement = document.getElementById('userControlModal');
    const userModal = new bootstrap.Modal(userModalElement);
    const userForm = document.getElementById('userControlForm');
    
    const modalTitle = document.getElementById('modalControlTitle');
    const fieldId = document.getElementById('fieldTargetId');
    const fieldName = document.getElementById('fieldUserName');
    const fieldEmail = document.getElementById('fieldUserEmail');
    const fieldRole = document.getElementById('fieldUserRole');
    const fieldStatus = document.getElementById('fieldUserStatus');

    let uniqueIncrementId = 2;

    // बदल: 'Add New User' क्लिक केल्यावर फक्त स्मूथ स्क्रोल होईल, मोडल उघडणार नाही
    const btnAddNewUser = document.getElementById('btnAddNewUser');
    if (btnAddNewUser) {
        btnAddNewUser.addEventListener('click', () => {
            window.scrollTo({
                top: 0, 
                behavior: 'smooth'
            });
            // userModal.show() इथे पूर्णपणे काढून टाकले आहे.
        });
    }

    // Form Submit (User CRUD) - हे अजूनही मोडलमध्येच काम करेल (Edit साठी)
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameValue = fieldName.value.trim();
        const emailValue = fieldEmail.value.trim();
        const roleValue = fieldRole.value;
        const statusValue = fieldStatus.value;
        const targetIdValue = fieldId.value;

        if (targetIdValue) {
            const row = tableBody.querySelector(`tr[data-id="${targetIdValue}"]`);
            row.querySelector('.user-name').innerText = nameValue;
            row.querySelector('.user-email').innerText = emailValue;
            row.querySelector('.user-role').innerText = roleValue;
            row.querySelector('.user-status').innerText = statusValue;
            row.querySelector('.user-status').setAttribute('data-status', statusValue);
        } else {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', uniqueIncrementId++);
            tr.innerHTML = `
                <td class="fw-semibold text-dark user-name">${nameValue}</td>
                <td class="text-secondary user-email">${emailValue}</td>
                <td><span class="badge bg-light text-dark border px-2 py-1 user-role">${roleValue}</span></td>
                <td><span class="badge-active-status user-status" data-status="${statusValue}">${statusValue}</span></td>
                <td class="text-end">
                    <button class="btn btn-table-edit btn-edit-trigger"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button class="btn btn-table-delete btn-delete-trigger"><i class="fa-solid fa-trash-can"></i> Delete</button>
                </td>
            `;
            tableBody.appendChild(tr);
        }
        userModal.hide();
    });

    // Table Click Delegation (Edit/Delete)
    tableBody.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.btn-edit-trigger');
        const deleteBtn = e.target.closest('.btn-delete-trigger');
        
        if (editBtn) {
            const row = editBtn.closest('tr');
            fieldId.value = row.getAttribute('data-id');
            fieldName.value = row.querySelector('.user-name').innerText.replace(' (Company)', '');
            fieldEmail.value = row.querySelector('.user-email').innerText;
            fieldRole.value = row.querySelector('.user-role').innerText;
            fieldStatus.value = row.querySelector('.user-status').getAttribute('data-status');
            
            modalTitle.innerHTML = `<i class="fa-solid fa-user-pen me-2"></i> Edit Information`;
            userModal.show(); // फक्त एडिट करतानाच मोडल उघडेल
        } else if (deleteBtn) {
            if (confirm('Delete this entry?')) deleteBtn.closest('tr').remove();
        }
    });
});