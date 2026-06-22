document.addEventListener('DOMContentLoaded', () => {
    // --- 1. मोबाईल सायनबार टॉगल ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            sidebar.classList.toggle('open');
            e.stopPropagation();
        });
    }

    // --- 2. डेटा मॅनेजमेंट ---
    const accountForm = document.getElementById('accountForm');
    const accountTableBody = document.getElementById('accountTableBody');
    const editAccountForm = document.getElementById('editAccountForm');
    const editModal = new bootstrap.Modal(document.getElementById('editAccountModal'));

    let accounts = JSON.parse(localStorage.getItem('myAccounts')) || [];

    // सुरुवातीला टेबल रेंडर करा
    renderTable();

    // फॉर्म सबमिट (नवीन अकाउंट)
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newAccount = {
            id: Date.now(),
            name: document.getElementById('printName').value,
            group: document.getElementById('accGroup').value,
            gstStatus: document.getElementById('dealerType').value,
            whatsapp: document.getElementById('whatsappNo').value,
            creditLimit: document.getElementById('creditLimit').value,
            gstNo: document.getElementById('gstinNo').value,
            panNo: document.getElementById('panNo').value
        };
        accounts.push(newAccount);
        saveData();
        renderTable();
        accountForm.reset();
        alert('Account Saved Successfully!');
    });

    // डेटा सेव्ह आणि टेबल अपडेट
    function saveData() {
        localStorage.setItem('myAccounts', JSON.stringify(accounts));
    }

    function renderTable() {
        accountTableBody.innerHTML = '';
        accounts.forEach((acc, index) => {
            const tr = document.createElement('tr');
            tr.className = "table-row-hover";
            tr.innerHTML = `
                <td>${acc.name}</td>
                <td>${acc.group}</td>
                <td>${acc.gstStatus}</td>
                <td>${acc.whatsapp}</td>
                <td>${acc.creditLimit}</td>
                <td>${acc.gstNo}</td>
                <td>${acc.panNo}</td>
                <td><span class="badge-active">Active</span></td>
                <td>
                    <div class="table-actions-btns" style="display: flex; gap: 5px; justify-content: center;">
                        <button class="btn btn-sm btn-info" onclick="editAccount(${index})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteAccount(${index})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            accountTableBody.appendChild(tr);
        });
    }

    // डिलीट आणि एडिट ग्लोबल फंक्शन्स
    window.deleteAccount = (index) => {
        if (confirm('Are you sure you want to delete this account?')) {
            accounts.splice(index, 1);
            saveData();
            renderTable();
        }
    };

    window.editAccount = (index) => {
        const acc = accounts[index];
        document.getElementById('editRowIndex').value = index;
        document.getElementById('editPrintName').value = acc.name;
        document.getElementById('editAccGroup').value = acc.group;
        document.getElementById('editGstStatus').value = acc.gstStatus;
        document.getElementById('editWhatsapp').value = acc.whatsapp;
        document.getElementById('editCreditLimit').value = acc.creditLimit;
        document.getElementById('editGstinNo').value = acc.gstNo;
        document.getElementById('editPanNo').value = acc.panNo;
        editModal.show();
    };

    editAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = document.getElementById('editRowIndex').value;
        accounts[index] = {
            id: accounts[index].id,
            name: document.getElementById('editPrintName').value,
            group: document.getElementById('editAccGroup').value,
            gstStatus: document.getElementById('editGstStatus').value,
            whatsapp: document.getElementById('editWhatsapp').value,
            creditLimit: document.getElementById('editCreditLimit').value,
            gstNo: document.getElementById('editGstinNo').value,
            panNo: document.getElementById('editPanNo').value
        };
        saveData();
        renderTable();
        editModal.hide();
    });

    // --- 3. स्क्रोलिंग फंक्शन्स ---
    document.getElementById('scrollListBtn')?.addEventListener('click', () => {
        document.getElementById('accountListCard').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('addAccountBtn')?.addEventListener('click', () => {
        document.getElementById('accountFormCard').scrollIntoView({ behavior: 'smooth' });
    });

    // --- 4. Import / Export फंक्शन्स ---
    document.getElementById('importAccountBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            
            rows.forEach(row => {
                accounts.push({
                    id: Date.now() + Math.random(),
                    name: row.Name || '',
                    group: row.Type || '',
                    gstStatus: row['GST Status'] || '',
                    whatsapp: row.WhatsApp || '',
                    creditLimit: row['Credit Limit'] || '',
                    gstNo: row['GST No'] || '',
                    panNo: row['PAN No'] || ''
                });
            });
            saveData();
            renderTable();
            alert('Data Imported Successfully!');
        };
        reader.readAsArrayBuffer(file);
    });

    document.getElementById('exportAccountBtn').addEventListener('click', () => {
        const wb = XLSX.utils.table_to_book(document.querySelector('.table-custom'), { sheet: "Accounts" });
        XLSX.writeFile(wb, 'Account_List.xlsx');
    });

    // --- नवीन सर्च फंक्शनॅलिटी ---
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    renderTable(filter); // फिल्टर पास करून टेबल पुन्हा रेंडर करा
});

// renderTable फंक्शन अपडेट करा
function renderTable(filter = '') {
    accountTableBody.innerHTML = '';
    
    // फिल्टर लावून डेटा फिल्टर करा
    const filteredAccounts = accounts.filter(acc => 
        acc.name.toLowerCase().startsWith(filter) // 'startsWith' वापरल्यामुळे तुम्ही टाकलेल्या अक्षरापासून सुरू होणारी नावे येतील
    );

    filteredAccounts.forEach((acc, index) => {
        // मुळ इंडेक्स शोधण्यासाठी (जेणेकरून डिलीट/एडिट व्यवस्थित काम करेल)
        const originalIndex = accounts.indexOf(acc);
        
        const tr = document.createElement('tr');
        tr.className = "table-row-hover";
        tr.innerHTML = `
            <td>${acc.name}</td>
            <td>${acc.group}</td>
            <td>${acc.gstStatus}</td>
            <td>${acc.whatsapp}</td>
            <td>${acc.creditLimit}</td>
            <td>${acc.gstNo}</td>
            <td>${acc.panNo}</td>
            <td><span class="badge-active">Active</span></td>
            <td>
                <div class="table-actions-btns" style="display: flex; gap: 5px; justify-content: center;">
                    <button class="btn btn-sm btn-info" onclick="editAccount(${originalIndex})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAccount(${originalIndex})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        accountTableBody.appendChild(tr);
    });
}

// Reset बटण निवडणे
const resetBtn = document.querySelector('button[type="reset"], .btn-secondary'); // तुमच्या फॉर्ममधील 'Reset' बटण

resetBtn.addEventListener('click', () => {
    // फॉर्ममधील सर्व इनपुट फील्ड्स रिसेट करणे
    accountForm.reset();
    
    // जर काही कस्टम ड्रॉपडाऊन किंवा फाइल इनपुट असतील जे .reset() ने क्लिअर होत नसतील, 
    // तर त्यांना मॅन्युअली क्लिअर करण्यासाठी खालील ओळी वापरा:
    const inputs = accountForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.value = '';
    });

    // टॅब्स पुन्हा पहिल्या (Active) टॅबवर नेण्यासाठी (ऐच्छिक)
    const firstTab = document.querySelector('#accountTabs button:first-child');
    if (firstTab) {
        const tab = new bootstrap.Tab(firstTab);
        tab.show();
    }
});

});