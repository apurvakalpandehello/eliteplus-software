document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Sidebar Topbar Toggle Code Engine
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const toggleIcon = menuToggle?.querySelector("i");

  if (menuToggle && sidebar && toggleIcon) {
    menuToggle.addEventListener("click", (e) => {
      sidebar.classList.toggle("open");
      e.stopPropagation();

      if (sidebar.classList.contains("open")) {
        toggleIcon.className = "fa-solid fa-xmark";
      } else {
        toggleIcon.className = "fa-solid fa-bars";
      }
    });

    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 991 && sidebar.classList.contains("open")) {
        if (!sidebar.contains(e.target) && e.target !== menuToggle) {
          sidebar.classList.remove("open");
          toggleIcon.className = "fa-solid fa-bars";
        }
      }
    });
  }

  // ==========================================================================
  // 2. ITEM MASTER ENGINE (FULL CRUD MECHANICAL STORAGE SYSTEM)
  // ==========================================================================
  const itemForm = document.getElementById("itemMasterForm");
  const itemsTableBody = document.querySelector(".premium-table tbody");
  const imageInput = document.getElementById("itemImg");
  const pdfInput = document.getElementById("itemPdf");

  // NEW BUTTON TRIGGER ELEMENTS DEFINITION
  const addNewDetailsBtn = document.getElementById("addNewDetailsBtn");
  const firstInput = document.getElementById("firstInput");

  // Add New Button Global Lifecycle Navigation Click Event Hook
  if (addNewDetailsBtn && firstInput) {
    addNewDetailsBtn.addEventListener("click", () => {
      resetFormConfiguration(); // Form cleans completely up
      window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth view shift to form fields
      setTimeout(() => firstInput.focus(), 400); // Focus input once scrolling settles
    });
  }

  let itemList = JSON.parse(localStorage.getItem("itemMasterData")) || [
    {
      id: "1710000000000",
      name: "CPR Manikin",
      code: "CPR-001",
      printName: "CPR Manikin Elite",
      type: "Product",
      brand: "Elite Plus",
      category: "Medical Training",
      openingQty: "10",
      stockValue: "250000",
      salesPrice: "25000",
      purchasePrice: "18000",
      mrp: "30000",
      taxCategory: "GST 18%",
      hsnCode: "90230010",
      warranty: "1 Year",
      packing: "Box",
      specification:
        "High fidelity medical training manikin for CPR application procedures.",
      image: "",
      videoLink: "",
      brochure: "",
    },
  ];

  let editModeId = null;

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  if (imageInput) {
    imageInput.addEventListener("change", function () {
      const label = this.nextElementSibling;
      label.innerHTML =
        this.files.length > 0
          ? `<i class="fa-solid fa-image"></i> ${this.files[0].name}`
          : `<i class="fa-solid fa-image"></i> Upload Image`;
    });
  }
  if (pdfInput) {
    pdfInput.addEventListener("change", function () {
      const label = this.nextElementSibling;
      label.innerHTML =
        this.files.length > 0
          ? `<i class="fa-solid fa-file-pdf"></i> ${this.files[0].name}`
          : `<i class="fa-solid fa-file-pdf"></i> Upload PDF`;
    });
  }

  // RENDERING READ LOGIC
  function renderTable() {
    if (!itemsTableBody) return;
    itemsTableBody.innerHTML = "";

    if (itemList.length === 0) {
      itemsTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#9CA3AF; padding: 24px;">No inventory catalog elements inside system storage.</td></tr>`;
      return;
    }

    itemList.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                        <td class="item-name-bold">${item.name}</td>
                        <td class="badge-td"><span>${item.code}</span></td>
                        <td>${item.type}</td>
                        <td>${item.brand || "-"}</td>
                        <td>${item.category || "-"}</td>
                        <td class="price-td">₹${parseFloat(item.salesPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td class="stock-td highlight-stock">${item.openingQty || 0}</td>
                        <td class="action-td-buttons">
                            <button class="t-btn btn-edit" data-id="${item.id}" title="Edit Item">
                                <i class="fa-solid fa-pen-to-square"></i>
                                <span>Edit</span>
                            </button>
                            <button class="t-btn btn-delete" data-id="${item.id}" title="Delete Item">
                                <i class="fa-solid fa-trash-can"></i>
                                <span>Delete</span>
                            </button>
                        </td>
                    `;
      itemsTableBody.appendChild(tr);
    });

    localStorage.setItem("itemMasterData", JSON.stringify(itemList));
    attachTableControlEventListeners();
  }

  // FORMS CREATE & UPDATE FLOW LOGIC
  if (itemForm) {
    itemForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const fields = itemForm.querySelectorAll(
        ".input-field-custom, .textarea-field-custom",
      );
      const formData = {
        name: fields[0].value,
        code: fields[1].value,
        printName: fields[2].value,
        type: fields[3].value,
        brand: fields[4].value,
        category: fields[5].value,
        openingQty: fields[6].value,
        stockValue: fields[7].value,
        salesPrice: fields[8].value,
        purchasePrice: fields[9].value,
        mrp: fields[10].value,
        taxCategory: fields[11].value,
        hsnCode: fields[12].value,
        warranty: fields[13].value,
        packing: fields[14].value,
        specification: fields[15].value,
        videoLink: fields[16].value,
      };

      const imgFile = imageInput?.files[0];
      const pdfFile = pdfInput?.files[0];

      if (imgFile) {
        formData.image = await fileToBase64(imgFile);
      } else if (editModeId) {
        const oldItem = itemList.find((i) => i.id === editModeId);
        formData.image = oldItem ? oldItem.image : "";
      } else {
        formData.image = "";
      }

      if (pdfFile) {
        formData.brochure = await fileToBase64(pdfFile);
      } else if (editModeId) {
        const oldItem = itemList.find((i) => i.id === editModeId);
        formData.brochure = oldItem ? oldItem.brochure : "";
      } else {
        formData.brochure = "";
      }

      if (editModeId) {
        itemList = itemList.map((item) =>
          item.id === editModeId ? { ...item, ...formData } : item,
        );
        alert("Item modified successfully within tracking engine.");
        editModeId = null;
        itemForm.querySelector(".action-btn-submit").innerHTML =
          `<i class="fa-solid fa-floppy-disk"></i> Save Item`;
      } else {
        formData.id = Date.now().toString();
        itemList.push(formData);
        alert("Item entry catalog creation processed successfully.");
      }

      resetFormConfiguration();
      renderTable();
    });

    itemForm.addEventListener("reset", () => {
      resetFormConfiguration();
    });
  }

  // ATTACHMENT LOGIC HOOKS INTO EVENT LIFECYCLES
  function attachTableControlEventListeners() {
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const item = itemList.find((i) => i.id === id);

        if (item && itemForm) {
          editModeId = item.id;
          const fields = itemForm.querySelectorAll(
            ".input-field-custom, .textarea-field-custom",
          );

          fields[0].value = item.name;
          fields[1].value = item.code;
          fields[2].value = item.printName;
          fields[3].value = item.type;
          fields[4].value = item.brand;
          fields[5].value = item.category;
          fields[6].value = item.openingQty;
          fields[7].value = item.stockValue;
          fields[8].value = item.salesPrice;
          fields[9].value = item.purchasePrice;
          fields[10].value = item.mrp;
          fields[11].value = item.taxCategory;
          fields[12].value = item.hsnCode;
          fields[13].value = item.warranty;
          fields[14].value = item.packing;
          fields[15].value = item.specification;
          fields[16].value = item.videoLink;

          if (imageInput && item.image)
            imageInput.nextElementSibling.innerHTML = `<i class="fa-solid fa-image"></i> [Uploaded Asset Image]`;
          if (pdfInput && item.brochure)
            pdfInput.nextElementSibling.innerHTML = `<i class="fa-solid fa-file-pdf"></i> [Uploaded Catalog PDF]`;

          itemForm.querySelector(".action-btn-submit").innerHTML =
            `<i class="fa-solid fa-pen-to-square"></i> Update Item`;
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });

    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this item?")) {
          itemList = itemList.filter((item) => item.id !== id);
          if (editModeId === id) {
            editModeId = null;
            if (itemForm)
              itemForm.querySelector(".action-btn-submit").innerHTML =
                `<i class="fa-solid fa-floppy-disk"></i> Save Item`;
          }
          renderTable();
        }
      });
    });
  }

  function resetFormConfiguration() {
    editModeId = null;
    if (itemForm)
      itemForm.querySelector(".action-btn-submit").innerHTML =
        `<i class="fa-solid fa-floppy-disk"></i> Save Item`;
    if (imageInput)
      imageInput.nextElementSibling.innerHTML = `<i class="fa-solid fa-image"></i> Upload Image`;
    if (pdfInput)
      pdfInput.nextElementSibling.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Upload PDF`;
  }

  renderTable();
});



// 'Add New Item' बटण निवडा
const addNewDetailsBtn = document.getElementById("addNewDetailsBtn");

// 'Add New Item' बटणावर क्लिक केल्यावर फक्त स्क्रोल करा
if (addNewDetailsBtn) {
    addNewDetailsBtn.addEventListener("click", () => {
        // १. फॉर्मला वरच्या बाजूला स्क्रोल करा
        window.scrollTo({ 
            top: 0,           // पेजच्या सर्वात वर
            behavior: "smooth" // स्मूथ ॲनिमेशनसह
        });

        // २. फॉर्म रिसेट करा (पर्यायी, जर नवीन एंट्री करायची असेल तर)
        resetFormConfiguration(); 

        // ३. पहिल्या इनपुट फील्डला फोकस करा (जर ID असेल तर)
        const firstInput = document.querySelector(".input-field-custom");
        if(firstInput) {
            setTimeout(() => {
                firstInput.focus();
            }, 500); // स्क्रोल पूर्ण झाल्यावर फोकस होईल
        }
    });
}