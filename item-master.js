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

    // फाइल इनपुट्स आणि लेबल्स (Main Form)
    const itemImgInput = document.getElementById('itemImg');
    const imgLabel = document.querySelector('label[for="itemImg"]');
    const itemPdfInput = document.getElementById('itemPdf');
    const pdfLabel = document.querySelector('label[for="itemPdf"]');

    // फाइल इनपुट आणि लेबल (Edit Modal)
    const editImgInput = document.getElementById('editImg');
    const editImgLabel = document.getElementById('editImgLabel');

    // डेटा लोड करा
    let items = JSON.parse(localStorage.getItem('myItems')) || [];
    let currentBase64Image = ""; // फाईल अपलोडसाठी डेटा सुरक्षित ठेवणे
    let editBase64Image = ""; // एडिट फाईल अपलोडसाठी डेटा
    renderTable();

    // फाईल अपलोड वाचक (Base64) - Main Form
    itemImgInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) {
            const file = this.files[0];
            imgLabel.innerHTML = `<i class="fa-solid fa-check"></i> ${file.name}`;
            imgLabel.style.borderColor = "#10b981";
            
            const reader = new FileReader();
            reader.onload = function(e) {
                currentBase64Image = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // फाईल अपलोड वाचक (Base64) - Edit Modal
    editImgInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) {
            const file = this.files[0];
            editImgLabel.innerHTML = `<i class="fa-solid fa-check"></i> ${file.name}`;
            editImgLabel.style.borderColor = "#10b981";
            
            const reader = new FileReader();
            reader.onload = function(e) {
                editBase64Image = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    itemPdfInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) {
            pdfLabel.innerHTML = `<i class="fa-solid fa-file-pdf"></i> ${this.files[0].name}`;
            pdfLabel.style.borderColor = "#ef4444";
        }
    });

    // सेव्ह करणे (New Item)
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const imageUrlField = document.getElementById('itemImageUrl').value.trim();
        const savedImage = imageUrlField !== "" ? imageUrlField : currentBase64Image;

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
            price: document.getElementById('itemSalesPrice').value,
            description: document.getElementById('itemDescription').value,
            image: savedImage || ""
        };

        items.push(newItem);
        localStorage.setItem('myItems', JSON.stringify(items));
        renderTable();

        itemForm.reset();
        resetLabels();
        alert('Item Saved Successfully!');
    });

    // टेबल रेंडर करणे
    function renderTable(filter = '') {
        itemTableBody.innerHTML = '';

        const filteredItems = items.filter(item =>
            item.name.toLowerCase().startsWith(filter.toLowerCase())
        );

        filteredItems.forEach((item) => {
            const originalIndex = items.indexOf(item);
            const tr = document.createElement('tr');
            
            let imgHtml = `<div class="table-item-icon-placeholder"><i class="fa-solid fa-box"></i></div>`;
            if (item.image && item.image.trim() !== "") {
                imgHtml = `<img src="${item.image}" alt="${item.name}" class="table-item-img" onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\'table-item-icon-placeholder\'><i class=\'fa-solid fa-image-broken\'></i></div>';">`;
            }

            tr.innerHTML = `
                <td>${imgHtml}</td>
                <td class="item-name-bold">${item.name}</td>
                <td>${item.code}</td>
                <td>${item.hsn && item.hsn !== "N/A" ? item.hsn : '-'}</td>
                <td>${item.type}</td>
                <td>${item.brand}</td>
                <td>${item.group}</td>
                <td class="price-td">₹${item.price}</td>
                <td class="stock-td highlight-stock">${item.stock}</td>
                <td class="action-td-buttons">
                    <button class="t-btn btn-edit" onclick="openEditModal(${originalIndex})" title="Edit" style="background-color: #3b82f6; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="t-btn btn-delete" onclick="deleteItem(${originalIndex})" title="Delete" style="background-color: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            itemTableBody.appendChild(tr);
        });
    }

    // पॉपअप मॉडेल उघडणे
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
        
        // रीसेट एडिट इमेज व्हेरिएबल आणि लेबल
        editBase64Image = "";
        editImgLabel.innerHTML = '<i class="fa-solid fa-image"></i> Choose Image';
        editImgLabel.style.borderColor = "";
        editImgInput.value = "";

        if(item.image && item.image.startsWith('http')) {
            document.getElementById('editImageUrl').value = item.image;
        } else {
            document.getElementById('editImageUrl').value = '';
        }

        document.getElementById('editModal').style.display = 'flex';
    };

    // अपडेट करणे
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = document.getElementById('editIndex').value;
        const editUrl = document.getElementById('editImageUrl').value.trim();

        // पहिली पसंती Edit URL ला, नंतर नवीन Upload केलेल्या फाईलला, काहीच नसेल तर जुनीच इमेज कायम ठेवावी
        let updatedImage = items[index].image;
        if (editUrl !== "") {
            updatedImage = editUrl;
        } else if (editBase64Image !== "") {
            updatedImage = editBase64Image;
        }

        items[index] = {
            ...items[index], 
            name: document.getElementById('editName').value,
            code: document.getElementById('editCode').value,
            hsn: document.getElementById('editHsnCode').value,
            type: document.getElementById('editType').value,
            brand: document.getElementById('editBrand').value,
            group: document.getElementById('editGroup').value,
            price: document.getElementById('editPrice').value,
            stock: document.getElementById('editStock').value,
            image: updatedImage
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

    function resetLabels() {
        imgLabel.innerHTML = '<i class="fa-solid fa-image"></i> Upload';
        pdfLabel.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Upload';
        imgLabel.style.borderColor = "";
        pdfLabel.style.borderColor = "";
        currentBase64Image = "";
    }

    const refreshBtn = document.querySelector('button[type="reset"]');
    if(refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            resetLabels();
        });
    }

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

    importBtn.addEventListener('click', () => importInput.click());

    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const importedData = XLSX.utils.sheet_to_json(sheet);

                if (importedData.length === 0) {
                    alert("No data found in file!");
                    return;
                }

                importedData.forEach(item => {
                    items.push({
                        id: Date.now() + Math.random(),
                        name: item["Item Name"] || item.name || item.Name || "N/A",
                        code: item.Code || item.code || "N/A",
                        hsn: item["HSN / SAC"] || item["HSN / SAC Code"] || item.hsn || item.HSN || "N/A",
                        type: item.Type || item.type || "Product",
                        brand: item.Brand || item.brand || "",
                        group: item.Group || item.group || "",
                        price: parseFloat(item["Sales Price"] || item.price || item.Price) || 0,
                        stock: parseInt(item.Stock || item.stock) || 0,
                        image: item.Image || item.image || item["Image URL"] || "" 
                    });
                });

                localStorage.setItem('myItems', JSON.stringify(items));
                renderTable();
                alert('Data Imported Successfully!');
            } catch (error) {
                console.error(error);
                alert("An error occurred while reading the file. Please use a valid Excel file.");
            } finally {
                e.target.value = '';
            }
        };
        reader.readAsArrayBuffer(file);
    });

    exportBtn.addEventListener('click', () => {
        if (items.length === 0) return alert('No data to export!');
        
        const exportCleanList = items.map(item => ({
            "Item Name": item.name,
            "Code": item.code,
            "HSN / SAC": item.hsn,
            "Type": item.type,
            "Brand": item.brand,
            "Group": item.group,
            "Sales Price": item.price,
            "Stock": item.stock,
            "Image URL": item.image
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportCleanList);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Items");
        XLSX.writeFile(workbook, "ItemList.xlsx");
    });

    const searchInput = document.getElementById('itemSearch');
    searchInput.addEventListener('input', () => {
        renderTable(searchInput.value);
    });
});