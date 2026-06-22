document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Sidebar Toggle ---
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const toggleIcon = menuToggle?.querySelector("i");

    if (menuToggle && sidebar && toggleIcon) {
        menuToggle.addEventListener("click", (e) => {
            sidebar.classList.toggle("open");
            e.stopPropagation();
            toggleIcon.className = sidebar.classList.contains("open") ? "fa-solid fa-xmark" : "fa-solid fa-bars";
        });
    }

    // --- 2. Item Master Logic ---
    const itemForm = document.getElementById('itemMasterForm');
    const itemTableBody = document.querySelector('.premium-table tbody');

    // Modal Elements
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const closeModalBtn = document.getElementById('closeModal');

    // फाइल इनपुट्स आणि लेबल्स
    const itemImgInput = document.getElementById('itemImg');
    const imgLabel = document.querySelector('label[for="itemImg"]');
    const itemPdfInput = document.getElementById('itemPdf');
    const pdfLabel = document.querySelector('label[for="itemPdf"]');

    // डेटा लोड करा
    let items = JSON.parse(localStorage.getItem('myItems')) || [];
    renderTable();

    // सेव्ह करणे (New Item)
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newItem = {
            id: Date.now(),
            name: document.getElementById('itemName').value,
            code: document.getElementById('itemCode').value,
            printName: document.getElementById('itemPrintName').value,
            type: document.getElementById('itemType').value,
            group: document.getElementById('itemGroup').value,
            brand: document.getElementById('itemBrand').value,
            unit: document.getElementById('itemUnit').value,
            hsn: document.getElementById('itemHsnCode').value,
            stock: document.getElementById('itemOpeningStock').value,
            price: document.getElementById('itemSalesPrice').value
        };

        items.push(newItem);
        localStorage.setItem('myItems', JSON.stringify(items));
        renderTable();

        itemForm.reset();
        resetLabels();
        alert('Item Saved Successfully!');
    });

    // टेबल रेंडर करणे
    function renderTable() {
        itemTableBody.innerHTML = '';
        items.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="item-name-bold">${item.name}</td>
                <td>${item.code}</td>
                // renderTable मध्ये हे वापरा:
                <td>${item.hsn && item.hsn !== "N/A" ? item.hsn : '-'}</td>
                <td>${item.type}</td>
                <td>${item.brand}</td>
                <td>${item.group}</td>
                <td class="price-td">₹${item.price}</td>
                <td class="stock-td highlight-stock">${item.stock}</td>
                <td class="action-td-buttons" style="text-align: center; gap: 8px; display: flex; justify-content: center;">
                    <button class="t-btn btn-edit" onclick="openEditModal(${index})" title="Edit" style="background-color: #3b82f6; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="t-btn btn-delete" onclick="deleteItem(${index})" title="Delete" style="background-color: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            itemTableBody.appendChild(tr);
        });
    }

    // पॉPअप उघडणे
    window.openEditModal = (index) => {
        const item = items[index];
        document.getElementById('editIndex').value = index;
        document.getElementById('editName').value = item.name;
        document.getElementById('editCode').value = item.code;
        document.getElementById('editHsnCode').value = item.hsn || '';
        document.getElementById('editType').value = item.type;
        document.getElementById('editBrand').value = item.brand;
        document.getElementById('editGroup').value = item.group;
        document.getElementById('editPrice').value = item.price;
        document.getElementById('editStock').value = item.stock;

        document.getElementById('editModal').style.display = 'flex';
    };

    // अपडेट करणे
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = document.getElementById('editIndex').value;

        items[index] = {
            ...items[index], // जुना डेटा टिकवून ठेवतो
            name: document.getElementById('editName').value,
            code: document.getElementById('editCode').value,
            hsn: document.getElementById('editHsnCode').value, // हे फील्ड वाढवले
            type: document.getElementById('editType').value,
            brand: document.getElementById('editBrand').value,
            group: document.getElementById('editGroup').value,
            price: document.getElementById('editPrice').value,
            stock: document.getElementById('editStock').value
        };

        localStorage.setItem('myItems', JSON.stringify(items));
        renderTable();
        document.getElementById('editModal').style.display = 'none';
    });

    // Modal बंद करणे
    closeModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // डिलीट फंक्शन
    window.deleteItem = (index) => {
        if (confirm('Are you sure you want to delete this item?')) {
            items.splice(index, 1);
            localStorage.setItem('myItems', JSON.stringify(items));
            renderTable();
        }
    };

    // फाइल इव्हेंट्स
    itemImgInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) {
            imgLabel.innerHTML = `<i class="fa-solid fa-check"></i> ${this.files[0].name}`;
            imgLabel.style.borderColor = "#10b981";
        }
    });

    itemPdfInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) {
            pdfLabel.innerHTML = `<i class="fa-solid fa-file-pdf"></i> ${this.files[0].name}`;
            pdfLabel.style.borderColor = "#ef4444";
        }
    });

    function resetLabels() {
        imgLabel.innerHTML = '<i class="fa-solid fa-image"></i> Upload';
        pdfLabel.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Upload';
        imgLabel.style.borderColor = "";
        pdfLabel.style.borderColor = "";
    }

    const refreshBtn = document.querySelector('button[type="reset"]');
    refreshBtn.addEventListener('click', () => {
        resetLabels();
    });

    const addNewDetailsBtn = document.getElementById('addNewDetailsBtn');
    const formContainer = document.getElementById('formContainer');

    if (addNewDetailsBtn && formContainer) {
        addNewDetailsBtn.addEventListener('click', () => {
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // --- Import & Export Logic ---
    const importBtn = document.getElementById('importItemBtn');
    const importInput = document.getElementById('importFileInput');
    const exportBtn = document.getElementById('exportItemBtn');

    // Import Trigger
    importBtn.addEventListener('click', () => importInput.click());

    // Import Process
    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];

                // Excel डेटा JSON मध्ये घ्या
                const importedData = XLSX.utils.sheet_to_json(sheet);

                if (importedData.length === 0) {
                    alert("फाईलमध्ये कोणताही डेटा सापडला नाही!");
                    return;
                }

                // नवीन आयटम्स मूळ लिस्टमध्ये ॲड करा
                importedData.forEach(item => {
                    // इथे आपण एक्सेलच्या अचूक हेडर्सनुसार (स्पेससह) डेटा मॅप करत आहोत
                    items.push({
                        id: Date.now() + Math.random(),
                        // एक्सेल हेडर्स: "Item Name", "Code", "Type", "Brand", "Group", "Sales Price", "Stock"
                        name: item["Item Name"] || item.name || item.Name || "N/A",
                        code: item.Code || item.code || "N/A",
                        // बदललेला भाग:
                        // जुन्या ओळीऐवजी ही ओळ वापरा:
                        hsn: item["HSN / SAC"] || item["HSN / SAC Code"] || item.hsn || item.HSN || "N/A",
                        type: item.Type || item.type || "Product",
                        brand: item.Brand || item.brand || "",
                        group: item.Group || item.group || "",
                        price: parseFloat(item["Sales Price"] || item.price || item.Price) || 0,
                        stock: parseInt(item.Stock || item.stock) || 0
                    });
                });

                localStorage.setItem('myItems', JSON.stringify(items));
                renderTable();
                alert('Data Imported Successfully!');
            } catch (error) {
                console.error(error);
                alert("फाईल वाचताना काहीतरी त्रुटी आली, कृपया योग्य Excel फाईल वापरा.");
            } finally {
                // ही ओळ सर्वात महत्त्वाची आहे - ती इनपुट रिसेट करते!
                e.target.value = '';
            }
        };
        reader.readAsArrayBuffer(file);
    });

    // Export Process
    exportBtn.addEventListener('click', () => {
        if (items.length === 0) return alert('No data to export!');

        // हेडिंग्स व्यवस्थित राहण्यासाठी json_to_sheet वापरणे सुरक्षित आहे
        const worksheet = XLSX.utils.json_to_sheet(items);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

        XLSX.writeFile(workbook, "ItemList.xlsx");
    });

    const searchInput = document.getElementById('itemSearch');

    // सर्च इनपुट इव्हेंट
    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        renderTable(filter); // फिल्टर व्हॅल्यू पाठवा
    });

    function renderTable(filter = '') {
    itemTableBody.innerHTML = '';

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().startsWith(filter.toLowerCase())
    );

    filteredItems.forEach((item) => {
        const originalIndex = items.indexOf(item);
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td class="item-name-bold">${item.name}</td>
            <td>${item.code}</td>
            <td>${item.hsn ? item.hsn : '-'}</td>
            <td>${item.type}</td>
            <td>${item.brand}</td>
            <td>${item.group}</td>
            <td class="price-td">₹${item.price}</td>
            <td class="stock-td highlight-stock">${item.stock}</td>
            <td class="action-td-buttons" style="text-align: center; gap: 8px; display: flex; justify-content: center;">
                <button class="t-btn btn-edit" onclick="openEditModal(${originalIndex})" title="Edit" style="background-color: #3b82f6; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="t-btn btn-delete" onclick="deleteItem(${originalIndex})" title="Delete" style="background-color: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        itemTableBody.appendChild(tr);
    });
}

});