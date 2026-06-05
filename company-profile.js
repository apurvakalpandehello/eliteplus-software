document.addEventListener('DOMContentLoaded', () => {
      
      // Responsive Sidebar Control (Matching dashboard mechanics exactly)
      const menuToggle = document.getElementById('menuToggle');
      const sidebar = document.getElementById('sidebar');
      const toggleIcon = menuToggle.querySelector('i');

      menuToggle.addEventListener('click', (e) => {
        sidebar.classList.toggle('active-mobile');
        e.stopPropagation();
        
        if (sidebar.classList.contains('active-mobile')) {
          toggleIcon.className = 'fa-solid fa-xmark';
        } else {
          toggleIcon.className = 'fa-solid fa-bars';
        }
      });

      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 991 && sidebar.classList.contains('active-mobile')) {
          if (!sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('active-mobile');
            toggleIcon.className = 'fa-solid fa-bars';
          }
        }
      });

      // File Input Name Detector Mechanics
      const fileInputs = document.querySelectorAll('.file-input-detector');
      fileInputs.forEach(input => {
        input.addEventListener('change', () => {
          const previewContainer = input.nextElementSibling;
          if (input.files.length > 0) {
            previewContainer.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> ${input.files[0].name}`;
            previewContainer.style.color = '#15803D';
          } else {
            previewContainer.innerText = 'No file selected';
            previewContainer.style.color = '#64748B';
          }
        });
      });

      // Interactive CRUD Logic Core
      const tableBody = document.getElementById('userTableBody');
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

      document.getElementById('btnAddNewUser').addEventListener('click', () => {
        userForm.reset();
        fieldId.value = '';
        modalTitle.innerHTML = `<i class="fa-solid fa-user-plus me-2"></i> Add New User`;
        userModal.show();
      });

      userForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameValue = fieldName.value.trim();
        const emailValue = fieldEmail.value.trim();
        const roleValue = fieldRole.value;
        const statusValue = fieldStatus.value;
        const targetIdValue = fieldId.value;

        const statusBadgeHTML = statusValue === 'Active' 
          ? `<span class="badge-active-status user-status" data-status="Active">Active</span>`
          : `<span class="badge-inactive-status user-status" data-status="Inactive">Inactive</span>`;

        if (targetIdValue) {
          const matchingRow = tableBody.querySelector(`tr[data-id="${targetIdValue}"]`);
          if (matchingRow) {
            matchingRow.querySelector('.user-name').innerText = nameValue;
            matchingRow.querySelector('.user-email').innerText = emailValue;
            matchingRow.querySelector('.user-role').innerText = roleValue;
            matchingRow.querySelector('.user-status').parentElement.innerHTML = statusBadgeHTML;
            
            matchingRow.style.backgroundColor = 'rgba(30, 136, 229, 0.08)';
            setTimeout(() => matchingRow.style.backgroundColor = '', 800);
          }
        } else {
          const newTableRow = document.createElement('tr');
          newTableRow.setAttribute('data-id', uniqueIncrementId);
          newTableRow.style.opacity = '0';
          newTableRow.style.transform = 'translateY(10px)';
          newTableRow.style.transition = 'all 0.4s ease';

          newTableRow.innerHTML = `
            <td class="fw-semibold text-dark user-name">${nameValue}</td>
            <td class="text-secondary user-email">${emailValue}</td>
            <td><span class="badge bg-light text-dark border px-2 py-1 user-role">${roleValue}</span></td>
            <td>${statusBadgeHTML}</td>
            <td class="text-end">
              <button class="btn btn-table-edit btn-edit-trigger"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
              <button class="btn btn-table-delete btn-delete-trigger"><i class="fa-solid fa-trash-can"></i> Delete</button>
            </td>
          `;

          tableBody.appendChild(newTableRow);
          setTimeout(() => {
            newTableRow.style.opacity = '1';
            newTableRow.style.transform = 'translateY(0)';
          }, 50);

          uniqueIncrementId++;
        }
        userModal.hide();
      });

      tableBody.addEventListener('click', (event) => {
        const targetBtn = event.target.closest('button');
        if (!targetBtn) return;

        const targetRow = targetBtn.closest('tr');
        const currentId = targetRow.getAttribute('data-id');

        if (targetBtn.classList.contains('btn-edit-trigger')) {
          fieldId.value = currentId;
          fieldName.value = targetRow.querySelector('.user-name').innerText;
          fieldEmail.value = targetRow.querySelector('.user-email').innerText;
          fieldRole.value = targetRow.querySelector('.user-role').innerText;
          fieldStatus.value = targetRow.querySelector('.user-status').getAttribute('data-status');

          modalTitle.innerHTML = `<i class="fa-solid fa-user-pen me-2"></i> Edit User Information`;
          userModal.show();
        }

        if (targetBtn.classList.contains('btn-delete-trigger')) {
          if (confirm('Are you sure you want to remove this user entry?')) {
            targetRow.classList.add('row-fade-out');
            setTimeout(() => { targetRow.remove(); }, 400);
          }
        }
      });

    });