document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // 1. Mobile Sidebar Open/Close Toggle Mechanism
    // ----------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        const toggleIcon = menuToggle.querySelector('i');
        
        menuToggle.addEventListener('click', (e) => {
            sidebar.classList.toggle('open');
            e.stopPropagation();

            if (sidebar.classList.contains('open')) {
                if (toggleIcon) toggleIcon.className = 'fa-solid fa-xmark';
            } else {
                if (toggleIcon) toggleIcon.className = 'fa-solid fa-bars';
            }
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 991 && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && e.target !== menuToggle) {
                    sidebar.classList.remove('open');
                    if (toggleIcon) toggleIcon.className = 'fa-solid fa-bars';
                }
            }
        });
    }

    // ----------------------------------------------------
    // 2. Account Master Setup & Elements Mapping
    // ----------------------------------------------------
    const accountForm = document.getElementById('accountForm');
    const accountTableBody = document.getElementById('accountTableBody');
    const accountSearch = document.getElementById('accountSearch');
    const editRowIndex = document.getElementById('editRowIndex');
    const formCardTitle = document.getElementById('formCardTitle');
    const btnSubmitForm = document.getElementById('btnSubmitForm');
    const btnResetForm = document.getElementById('btnResetForm');
    
    const accountFormCard = document.getElementById('accountFormCard');
    const accountListCard = document.getElementById('accountListCard');
    const scrollListBtn = document.getElementById('scrollListBtn');
    const scrollToFormBtn = document.getElementById('scrollToFormBtn');

    // Smooth Scroll View Navigation
    if (scrollListBtn && accountListCard) {
        scrollListBtn.addEventListener('click', () => {
            accountListCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (scrollToFormBtn && accountFormCard) {
        scrollToFormBtn.addEventListener('click', () => {
            resetFormState();
            accountFormCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ----------------------------------------------------
    // 3. Form Submission Handler (Add & Update Mode)
    // ----------------------------------------------------
    if (accountForm) {
        accountForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Default refresh थांबवा

            // सर्व फॉर्म डेटा गोळा करा
            const type = document.getElementById('masterType').value;
            const gstStatus = document.getElementById('gstStatus').value;
            const name = document.getElementById('accountName').value.trim();
            const contact = document.getElementById('contactPerson').value.trim() || '-';
            const mobile = document.getElementById('mobileNumber').value.trim() || '-';
            const whatsapp = document.getElementById('whatsappNumber').value.trim() || '-';
            const email = document.getElementById('emailAddress').value.trim() || '-';
            const gstNo = document.getElementById('gstNumber').value.trim().toUpperCase() || '-';
            const panNo = document.getElementById('panNumber').value.trim().toUpperCase() || '-';
            const limit = document.getElementById('creditLimit').value.trim() || '0.00';
            const openBal = document.getElementById('openingBalance').value.trim() || '0.00';
            const balType = document.getElementById('balanceType').value;
            const status = document.getElementById('accountStatus').value;
            const billing = document.getElementById('billingAddress').value.trim() || '-';
            const shipping = document.getElementById('shippingAddress').value.trim() || '-';

            const isEditMode = editRowIndex.value !== "";

            if (isEditMode) {
                // UPDATE CURRENT EXISTING ROW
                const targetIdx = parseInt(editRowIndex.value);
                const targetRow = accountTableBody.rows[targetIdx];

                if (targetRow) {
                    targetRow.querySelector('.account-td-name').textContent = name;
                    targetRow.querySelector('.account-td-type').textContent = type;
                    targetRow.querySelector('.account-td-gst').textContent = gstStatus;
                    targetRow.querySelector('.account-td-contact').textContent = contact;
                    targetRow.querySelector('.account-td-whatsapp').textContent = whatsapp;
                    targetRow.querySelector('.account-td-limit').textContent = limit;

                    const statusTd = targetRow.querySelector('.account-td-status');
                    statusTd.textContent = status;
                    statusTd.className = status === 'Active' ? 'badge-active account-td-status' : 'badge-inactive account-td-status';

                    // Update custom HTML tracking parameters
                    targetRow.setAttribute('data-email', email);
                    targetRow.setAttribute('data-gstno', gstNo);
                    targetRow.setAttribute('data-panno', panNo);
                    targetRow.setAttribute('data-openbal', openBal);
                    targetRow.setAttribute('data-baltype', balType);
                    targetRow.setAttribute('data-billing', billing);
                    targetRow.setAttribute('data-shipping', shipping);
                }
            } else {
                // INSERT BRAND NEW ROW TO THE TABLE LIST
                const newRow = document.createElement('tr');
                newRow.className = 'table-row-hover';
                
                // Extra parameters pass करण्यासाठी data-* ॲट्रिब्युट्स वापरले आहेत
                newRow.setAttribute('data-email', email);
                newRow.setAttribute('data-gstno', gstNo);
                newRow.setAttribute('data-panno', panNo);
                newRow.setAttribute('data-openbal', openBal);
                newRow.setAttribute('data-baltype', balType);
                newRow.setAttribute('data-billing', billing);
                newRow.setAttribute('data-shipping', shipping);

                const badgeClass = status === 'Active' ? 'badge-active' : 'badge-inactive';

                newRow.innerHTML = `
                    <td class="fw-semibold text-dark account-td-name">${name}</td>
                    <td class="account-td-type">${type}</td>
                    <td class="account-td-gst">${gstStatus}</td>
                    <td class="account-td-contact">${contact}</td>
                    <td class="account-td-whatsapp">${whatsapp}</td>
                    <td class="fw-medium account-td-limit">${limit}</td>
                    <td><span class="${badgeClass} account-td-status">${status}</span></td>
                    <td>
                        <div class="table-actions-btns">
                            <button type="button" class="btn-table-edit btn-row-edit"><i class="fa-solid fa-pen me-1"></i> Edit</button>
                            <button type="button" class="btn-table-delete btn-row-delete"><i class="fa-solid fa-trash me-1"></i> Delete</button>
                        </div>
                    </td>
                `;

                accountTableBody.appendChild(newRow);
            }

            // फॉर्म रिसेट करा आणि खाली लिस्टकडे स्क्रोल करा
            resetFormState();
            if (accountListCard) {
                accountListCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (btnResetForm) {
        btnResetForm.addEventListener('click', (e) => {
            e.preventDefault();
            resetFormState();
        });
    }

    // ----------------------------------------------------
    // 4. Click Management (Edit / Delete Delegate Core)
    // ----------------------------------------------------
    if (accountTableBody) {
        accountTableBody.addEventListener('click', (event) => {
            const targetBtn = event.target.closest('button');
            if (!targetBtn) return;

            const targetRow = targetBtn.closest('tr');
            if (!targetRow) return;

            const allRowsArray = Array.from(accountTableBody.rows);
            const currentRowIndex = allRowsArray.indexOf(targetRow);

            // A. EDIT LOGIC
            if (targetBtn.classList.contains('btn-row-edit')) {
                event.preventDefault();
                
                document.getElementById('masterType').value = targetRow.querySelector('.account-td-type').textContent;
                document.getElementById('gstStatus').value = targetRow.querySelector('.account-td-gst').textContent;
                document.getElementById('accountName').value = targetRow.querySelector('.account-td-name').textContent;
                
                const rawContact = targetRow.querySelector('.account-td-contact').textContent;
                document.getElementById('contactPerson').value = rawContact === '-' ? '' : rawContact;
                
                const rawPhone = targetRow.querySelector('.account-td-whatsapp').textContent;
                document.getElementById('mobileNumber').value = rawPhone === '-' ? '' : rawPhone;
                document.getElementById('whatsappNumber').value = rawPhone === '-' ? '' : rawPhone;
                
                document.getElementById('emailAddress').value = targetRow.getAttribute('data-email') === '-' ? '' : targetRow.getAttribute('data-email');
                document.getElementById('gstNumber').value = targetRow.getAttribute('data-gstno') === '-' ? '' : targetRow.getAttribute('data-gstno');
                document.getElementById('panNumber').value = targetRow.getAttribute('data-panno') === '-' ? '' : targetRow.getAttribute('data-panno');
                
                document.getElementById('creditLimit').value = targetRow.querySelector('.account-td-limit').textContent;
                document.getElementById('openingBalance').value = targetRow.getAttribute('data-openbal') || '0.00';
                document.getElementById('balanceType').value = targetRow.getAttribute('data-baltype') || 'Credit';
                document.getElementById('accountStatus').value = targetRow.querySelector('.account-td-status').textContent;
                
                document.getElementById('billingAddress').value = targetRow.getAttribute('data-billing') === '-' ? '' : targetRow.getAttribute('data-billing');
                document.getElementById('shippingAddress').value = targetRow.getAttribute('data-shipping') === '-' ? '' : targetRow.getAttribute('data-shipping');

                // Switch Form to Edit UI
                editRowIndex.value = currentRowIndex;
                if (formCardTitle) {
                    formCardTitle.innerHTML = `✏️ Edit Account Master <span class="badge-enhanced" style="background:#FBBF24; color:#B45309;">Editing Row #${currentRowIndex + 1}</span>`;
                }
                if (btnSubmitForm) {
                    btnSubmitForm.innerHTML = `<i class="fa-solid fa-arrows-rotate me-2"></i>Update Changes`;
                }
                
                accountFormCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // B. DELETE LOGIC
            if (targetBtn.classList.contains('btn-row-delete')) {
                event.preventDefault();
                const currentAccountName = targetRow.querySelector('.account-td-name').textContent;
                
                if (confirm(`Are you sure you want to remove "${currentAccountName}"?`)) {
                    targetRow.style.transition = "all 0.2s ease";
                    targetRow.style.opacity = "0";
                    targetRow.style.transform = "translateX(30px)";
                    
                    setTimeout(() => {
                        targetRow.remove();
                        resetFormState();
                    }, 200);
                }
            }
        });
    }

    function resetFormState() {
        if (accountForm) accountForm.reset();
        if (editRowIndex) editRowIndex.value = "";
        if (formCardTitle) {
            formCardTitle.innerHTML = `💼 Account Master <span class="badge-enhanced">Enhanced</span>`;
        }
        if (btnSubmitForm) {
            btnSubmitForm.innerHTML = `<i class="fa-solid fa-check me-2"></i>Save Account`;
        }
    }

    // ----------------------------------------------------
    // 5. Dynamic Real-time Filtering Search Control
    // ----------------------------------------------------
    if (accountSearch && accountTableBody) {
        accountSearch.addEventListener('input', (e) => {
            const currentQuery = e.target.value.toLowerCase().trim();
            const matchingRows = accountTableBody.getElementsByTagName('tr');

            for (let i = 0; i < matchingRows.length; i++) {
                const rowElement = matchingRows[i];
                const textDump = rowElement.textContent.toLowerCase();

                if (textDump.includes(currentQuery)) {
                    rowElement.style.display = "";
                } else {
                    rowElement.style.display = "none";
                }
            }
        });
    }
});