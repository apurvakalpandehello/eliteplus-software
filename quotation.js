document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", (e) => {
      sidebar.classList.toggle("open");
      e.stopPropagation();
    });
  }

  const dateField = document.getElementById("qDate");
  if (dateField) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    dateField.value = dd + "-" + mm + "-" + yyyy;
  }

  const partyDatabase = [
    "Maharshi Karve Stree Shikshan Samstha's",
    "Government of Assam",
    "Government of Maharashtra",
    "Government of Gujarat",
    "Apollo Hospitals Enterprise",
    "All India Institute of Medical Sciences (AIIMS)",
    "Anand Medical Laboratories",
    "Apex Healthcare Ltd",
    "Bharati Vidyapeeth Hospital",
    "Bombay Hospital & Medical Research",
    "Cipla Pharmaceuticals",
    "Dr. Reddy's Laboratories",
  ];

  const partyInput = document.getElementById("qParty");
  const suggestionsBox = document.getElementById("partySuggestionsList");

  if (partyInput && suggestionsBox) {
    partyInput.addEventListener("input", () => {
      const inputValue = partyInput.value.trim().toLowerCase();
      suggestionsBox.innerHTML = "";

      if (inputValue.length === 0) {
        suggestionsBox.style.display = "none";
        return;
      }

      const filteredParties = partyDatabase.filter((party) =>
        party.toLowerCase().includes(inputValue),
      );

      if (filteredParties.length > 0) {
        filteredParties.forEach((partyName) => {
          const div = document.createElement("div");
          div.className = "suggestion-item";
          div.textContent = partyName;

          div.addEventListener("click", () => {
            partyInput.value = partyName;
            suggestionsBox.style.display = "none";
          });

          suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = "block";
      } else {
        suggestionsBox.style.display = "none";
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target !== partyInput && e.target !== suggestionsBox) {
        suggestionsBox.style.display = "none";
      }
    });
  }

  let voucherDatabase = [
    {
      series: "Main",
      date: "26-05-2026",
      vchNo: "QTN/2026-27/26",
      saleType: "I/GST-MultiRate",
      partyName: "Maharshi Karve Stree Shikshan Samstha's",
      matCentre: "Main Store",
      narration:
        "Elite Healthcare simulation infrastructure allocation assignment setup.",
      discountPercent: 0.0,
      items: [
        { name: "qubeZERO (NASCO)", qty: 1.0, unit: "Nos", price: 1100000.0 },
      ],
    },
  ];

  let currentItemsList = [];

  const itemTableBody = document.getElementById("itemTableBody");
  const voucherMasterTableBody = document.getElementById(
    "voucherMasterTableBody",
  );
  const modalItemForm = document.getElementById("modalItemForm");
  const modalEditIndex = document.getElementById("modalEditIndex");
  const modalFormMode = document.getElementById("modalFormMode");
  const modalSubmitBtn = document.getElementById("modalSubmitBtn");

  const manualDiscountInput = document.getElementById(
    "manualDiscountPercentage",
  );
  const manualDiscountAmountDisplay = document.getElementById(
    "manualDiscountAmountDisplay",
  );
  const grandTotalDisplay = document.getElementById("grandTotalDisplay");

  const bootstrapItemModal = new bootstrap.Modal(
    document.getElementById("addItemModal"),
  );
  const printPreviewModal = new bootstrap.Modal(
    document.getElementById("printPreviewModal"),
  );
  const catalogPreviewModal = new bootstrap.Modal(
    document.getElementById("catalogPreviewModal"),
  );

  function computeItemTaxParameters(item) {
    let rate = 18;
    let taxable = item.qty * item.price;
    let amt = (taxable * rate) / 100;
    return { rate: rate, taxAmount: amt, aggregate: taxable + amt };
  }

  window.calculateQuotationTotals = () => {
    let itemsSubTotal = 0;
    let gst18Taxable = 0;
    let gst18Amt = 0;
    let gst5Taxable = 0;
    let gst5Amt = 0;

    currentItemsList.forEach((item) => {
      let sub = item.qty * item.price;
      itemsSubTotal += sub;

      let taxDetails = computeItemTaxParameters(item);
      if (taxDetails.rate === 18) {
        gst18Taxable += sub;
        gst18Amt += taxDetails.taxAmount;
      } else {
        gst5Taxable += sub;
        gst5Amt += taxDetails.taxAmount;
      }
    });

    let totalTaxAmount = gst18Amt + gst5Amt;
    let discountPercent = parseFloat(manualDiscountInput.value) || 0;
    let discountAmount = (itemsSubTotal * discountPercent) / 100;
    let finalGrandTotal = itemsSubTotal + totalTaxAmount - discountAmount;

    if (document.getElementById("taxableAmt18"))
      document.getElementById("taxableAmt18").textContent =
        gst18Taxable.toFixed(2);
    if (document.getElementById("taxAmt18"))
      document.getElementById("taxAmt18").textContent = gst18Amt.toFixed(2);
    if (document.getElementById("sundryAmt18"))
      document.getElementById("sundryAmt18").textContent = gst18Amt.toFixed(2);

    if (document.getElementById("taxableAmt5"))
      document.getElementById("taxableAmt5").textContent =
        gst5Taxable.toFixed(2);
    if (document.getElementById("taxAmt5"))
      document.getElementById("taxAmt5").textContent = gst5Amt.toFixed(2);
    if (document.getElementById("sundryAmt5"))
      document.getElementById("sundryAmt5").textContent = gst5Amt.toFixed(2);

    if (document.getElementById("totalTaxableAmtDisplay"))
      document.getElementById("totalTaxableAmtDisplay").textContent = (
        gst18Taxable + gst5Taxable
      ).toFixed(2);
    if (document.getElementById("totalTaxAmtDisplay"))
      document.getElementById("totalTaxAmtDisplay").textContent =
        totalTaxAmount.toFixed(2);

    if (manualDiscountAmountDisplay)
      manualDiscountAmountDisplay.textContent = "-" + discountAmount.toFixed(2);
    if (grandTotalDisplay)
      grandTotalDisplay.textContent = finalGrandTotal.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    return {
      subtotal: itemsSubTotal,
      tax: totalTaxAmount,
      discount: discountAmount,
      grandTotal: finalGrandTotal,
    };
  };

  window.renderItemsTable = () => {
    if (!itemTableBody) return;
    itemTableBody.innerHTML = "";
    currentItemsList.forEach((item, index) => {
      const amount = (item.qty * item.price).toFixed(2);
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${index + 1}</td>
            <td class="text-start fw-semibold text-dark">${item.name}</td>
            <td>${parseFloat(item.qty).toFixed(2)}</td>
            <td>${item.unit}</td>
            <td>${parseFloat(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="fw-bold">${parseFloat(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>
                <button type="button" class="btn-row-edit" onclick="editItemRow(${index})"><i class="fa-solid fa-pen"></i> Edit</button>
                <button type="button" class="btn-row-delete" onclick="deleteItemRow(${index})"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
        `;
      itemTableBody.appendChild(tr);
    });
    calculateQuotationTotals();
  };

  window.renderVoucherMasterDirectory = () => {
    if (!voucherMasterTableBody) return;
    voucherMasterTableBody.innerHTML = "";
    if (voucherDatabase.length === 0) {
      voucherMasterTableBody.innerHTML = `<tr><td colspan="7" class="text-muted py-3">No quotation vouchers available in directory.</td></tr>`;
      return;
    }

    voucherDatabase.forEach((vch, index) => {
      let subTot = 0;
      let taxTot = 0;
      vch.items.forEach((it) => {
        subTot += it.qty * it.price;
        let checkTax = computeItemTaxParameters(it);
        taxTot += checkTax.taxAmount;
      });
      let discAmt = (subTot * vch.discountPercent) / 100;
      let finalTot = subTot + taxTot - discAmt;

      const tr = document.createElement("tr");
      tr.innerHTML = `
              <td><b>${index + 1}</b></td>
              <td class="text-danger fw-bold">${vch.vchNo}</td>
              <td>${vch.date}</td>
              <td class="text-start fw-semibold text-dark">${vch.partyName}</td>
              <td><span class="badge bg-light text-dark border">${vch.saleType}</span></td>
              <td class="fw-bold text-primary">₹${finalTot.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>
                  <button type="button" class="btn btn-sm btn-row-edit px-2" onclick="loadVoucherToForm(${index})"><i class="fa-solid fa-file-pen"></i> Edit</button>
                  <button type="button" class="btn btn-sm btn-row-delete px-2" onclick="deleteVoucherRecord(${index})"><i class="fa-solid fa-trash-can"></i> Delete</button>
              </td>
          `;
      voucherMasterTableBody.appendChild(tr);
    });
  };

  window.loadVoucherToForm = (index) => {
    const vch = voucherDatabase[index];

    document.getElementById("qVoucherTrackIndex").value = index;
    document.getElementById("qSeries").value = vch.series;
    document.getElementById("qDate").value = vch.date;
    document.getElementById("qVchNo").value = vch.vchNo;
    document.getElementById("qSaleType").value = vch.saleType;
    document.getElementById("qParty").value = vch.partyName;
    document.getElementById("qMatCentre").value = vch.matCentre;
    document.getElementById("qNarration").value = vch.narration;
    document.getElementById("manualDiscountPercentage").value =
      vch.discountPercent.toFixed(2);

    currentItemsList = JSON.parse(JSON.stringify(vch.items));

    document.getElementById("formVoucherHeaderTitle").innerHTML =
      `<i class="fa-solid fa-file-pen text-warning"></i> Editing Voucher: ${vch.vchNo}`;
    document.getElementById("mainVoucherSaveBtn").innerHTML =
      `<i class="fa-solid fa-check-double"></i> Update Voucher`;

    renderItemsTable();
    document
      .getElementById("voucherFormCard")
      .scrollIntoView({ behavior: "smooth" });
  };

  window.deleteVoucherRecord = (index) => {
    if (
      confirm(
        "Are you sure you want to completely delete this Voucher from directory?",
      )
    ) {
      voucherDatabase.splice(index, 1);
      renderVoucherMasterDirectory();
      clearVoucherForm();
    }
  };

  window.clearVoucherForm = () => {
    document.getElementById("quotationForm").reset();
    document.getElementById("qVoucherTrackIndex").value = "";
    document.getElementById("formVoucherHeaderTitle").innerHTML =
      `<i class="fa-solid fa-file-signature text-success"></i> Voucher Entry Panel`;
    document.getElementById("mainVoucherSaveBtn").innerHTML =
      `<i class="fa-solid fa-floppy-disk"></i> Save Voucher`;
    currentItemsList = [];
    renderItemsTable();
  };

  if (document.getElementById("createNewVchBtn")) {
    document.getElementById("createNewVchBtn").addEventListener("click", () => {
      clearVoucherForm();
      document
        .getElementById("voucherFormCard")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  if (document.getElementById("topVchDetailBtn")) {
    document.getElementById("topVchDetailBtn").addEventListener("click", () => {
      document
        .getElementById("voucherDirectoryCard")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  if (document.getElementById("openAddModalBtn")) {
    document.getElementById("openAddModalBtn").addEventListener("click", () => {
      modalItemForm.reset();
      modalEditIndex.value = "";
      modalFormMode.textContent = "Add";
      modalSubmitBtn.innerHTML =
        '<i class="fa-solid fa-plus me-1"></i> Add to Table';
      bootstrapItemModal.show();
    });
  }

  window.editItemRow = (index) => {
    const item = currentItemsList[index];
    document.getElementById("modalItemName").value = item.name;
    document.getElementById("modalItemQty").value = item.qty;
    document.getElementById("modalItemUnit").value = item.unit;
    document.getElementById("modalItemPrice").value = item.price;

    modalEditIndex.value = index;
    modalFormMode.textContent = "Edit";
    modalSubmitBtn.innerHTML =
      '<i class="fa-solid fa-plus me-1"></i> Add to Table';
    bootstrapItemModal.show();
  };

  window.deleteItemRow = (index) => {
    if (confirm("Delete this item line from form?")) {
      currentItemsList.splice(index, 1);
      renderItemsTable();
    }
  };

  if (modalItemForm) {
    modalItemForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("modalItemName").value;
      const qty = parseFloat(document.getElementById("modalItemQty").value);
      const unit = document.getElementById("modalItemUnit").value;
      const price = parseFloat(document.getElementById("modalItemPrice").value);
      const editIndexValue = modalEditIndex.value;

      if (editIndexValue !== "") {
        currentItemsList[parseInt(editIndexValue)] = { name, qty, unit, price };
      } else {
        currentItemsList.push({ name, qty, unit, price });
      }
      renderItemsTable();
      bootstrapItemModal.hide();
    });
  }

  if (manualDiscountInput) {
    manualDiscountInput.addEventListener("input", () => {
      calculateQuotationTotals();
    });
  }

  if (document.getElementById("quotationForm")) {
    document.getElementById("quotationForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (currentItemsList.length === 0) {
        alert("Please add at least one item detail line before saving.");
        return;
      }

      const vchNo = document.getElementById("qVchNo").value;
      const partyName = document.getElementById("qParty").value;
      const trackingIndex = document.getElementById("qVoucherTrackIndex").value;

      const voucherPayload = {
        series: document.getElementById("qSeries").value,
        date: document.getElementById("qDate").value,
        vchNo: vchNo,
        saleType: document.getElementById("qSaleType").value,
        partyName: partyName,
        matCentre: document.getElementById("qMatCentre").value,
        narration: document.getElementById("qNarration").value,
        discountPercent: parseFloat(manualDiscountInput.value) || 0,
        items: JSON.parse(JSON.stringify(currentItemsList)),
      };

      if (trackingIndex !== "") {
        voucherDatabase[parseInt(trackingIndex)] = voucherPayload;
        alert("Voucher Updated Successfully!");
      } else {
        voucherDatabase.push(voucherPayload);
        alert("New Voucher Saved Successfully into Directory!");
      }

      renderVoucherMasterDirectory();
      clearVoucherForm();
    });
  }

  function translateAmountIntoWords(amount) {
    let fractions = Math.round((amount - Math.floor(amount)) * 100);
    let wordsOutput = "";
    let primaryValue = Math.floor(amount);

    if (primaryValue == 0) return "Zero Rupees Only";

    let unitsList = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    let tensList = [
      "",
      "",
      "Two Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    function computeHundreds(num) {
      let out = "";
      if (num > 99) {
        out += unitsList[Math.floor(num / 100)] + " Hundred ";
        num %= 100;
      }
      if (num > 19) {
        out += tensList[Math.floor(num / 10)] + " ";
        num %= 10;
      }
      if (num > 0) {
        out += unitsList[num] + " ";
      }
      return out;
    }

    if (Math.floor(primaryValue / 10000000) > 0) {
      wordsOutput +=
        computeHundreds(Math.floor(primaryValue / 10000000)) + "Crore ";
      primaryValue %= 10000000;
    }
    if (Math.floor(primaryValue / 100000) > 0) {
      wordsOutput +=
        computeHundreds(Math.floor(primaryValue / 100000)) + "Lakh ";
      primaryValue %= 100000;
    }
    if (Math.floor(primaryValue / 1000) > 0) {
      wordsOutput +=
        computeHundreds(Math.floor(primaryValue / 1000)) + "Thousand ";
      primaryValue %= 1000;
    }
    wordsOutput += computeHundreds(primaryValue);
    wordsOutput += "Rupees";

    if (fractions > 0) {
      wordsOutput += " and " + computeHundreds(fractions) + "Paise";
    }
    return wordsOutput + " Only";
  }

  if (document.getElementById("btnPrintQuotation")) {
    document
      .getElementById("btnPrintQuotation")
      .addEventListener("click", () => {
        if (currentItemsList.length === 0) {
          alert(
            "Cannot display visual print layout context: Item Details stack is empty.",
          );
          return;
        }

        const activeParty = document.getElementById("qParty").value;
        if (activeParty) {
          document.getElementById("pdfClientInstitution").textContent =
            activeParty;
          document.getElementById("pdfClientSubName").textContent = "";
        } else {
          document.getElementById("pdfClientInstitution").textContent =
            "Maharshi Karve Stree Shikshan Samstha's";
          document.getElementById("pdfClientSubName").textContent =
            "Smt. Bakul Tambat Institute of Nursing";
        }

        document.getElementById("pdfMetaDate").textContent =
          document.getElementById("qDate").value;
        document.getElementById("pdfMetaQtnNo").textContent =
          document.getElementById("qVchNo").value;

        const rowsContainer = document.getElementById("pdfItemRowsTarget");
        rowsContainer.innerHTML = "";

        currentItemsList.forEach((item, index) => {
          let calculatedTaxInfo = computeItemTaxParameters(item);
          let targetBrandString = "NASCO";

          let tr = document.createElement("tr");
          tr.innerHTML = `
                  <td>${index + 1}</td>
                  <td class="text-start fw-bold text-dark">${item.name}</td>
                  <td class="text-dark">${targetBrandString}</td>
                  <td class="text-end font-monospace">${item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td>${item.qty}</td>
                  <td>${item.unit}</td>
                  <td>${calculatedTaxInfo.rate}%</td>
                  <td class="text-end font-monospace">${calculatedTaxInfo.taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td class="text-end font-monospace fw-bold">${calculatedTaxInfo.aggregate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              `;
          rowsContainer.appendChild(tr);
        });

        const currentItemsCount = currentItemsList.length;
        const emptyRowsToAdd = 16;

        for (let i = 0; i < emptyRowsToAdd; i++) {
          let emptyTr = document.createElement("tr");
          emptyTr.className = "pdf-empty-row-tr";
          emptyTr.innerHTML = `
                  <td>${currentItemsCount + i + 1}</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
              `;
          rowsContainer.appendChild(emptyTr);
        }

        const metrics = calculateQuotationTotals();
        document.getElementById("pdfAmountInWords").textContent =
          translateAmountIntoWords(metrics.grandTotal);

        printPreviewModal.show();
      });
  }

  if (document.getElementById("modalDownloadPdfBtn")) {
    document
      .getElementById("modalDownloadPdfBtn")
      .addEventListener("click", () => {
        const sourceElement = document.getElementById("pdfPrintTargetArea");
        const runningInvoiceNumber = document
          .getElementById("pdfMetaQtnNo")
          .textContent.replace(/\//g, "-");

        const conversionOptions = {
          margin: 0,
          filename: `Quotation-${runningInvoiceNumber}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            scrollY: 0,
            scrollX: 0,
          },
          jsPDF: {
            unit: "pt",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: { mode: ["avoid-all"] },
        };

        html2pdf()
          .set(conversionOptions)
          .from(sourceElement)
          .save()
          .then(() => {
            alert(
              "Quotation document downloaded successfully into a single A4 layout!",
            );
          })
          .catch((err) => {
            console.error("PDF Engine error pipeline failure:", err);
            alert("Error rendering binary stream download process.");
          });
      });
  }

  /* PRINT CATALOG OVERLAY CONTEXT DISPATCH ENGINE */
  if (document.getElementById("btnPrintCatalog")) {
    document.getElementById("btnPrintCatalog").addEventListener("click", () => {
      catalogPreviewModal.show();
    });
  }

  /* DOWNLOAD CATALOG PDF TRIGGER */
  if (document.getElementById("modalDownloadCatalogBtn")) {
    document
      .getElementById("modalDownloadCatalogBtn")
      .addEventListener("click", () => {
        const catalogElement = document.getElementById(
          "catalogPrintTargetArea",
        );
        const catalogOptions = {
          margin: 0,
          filename: "Product-Catalog.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            scrollY: 0,
            scrollX: 0,
          },
          jsPDF: {
            unit: "pt",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["css", "legacy"],
            before: ".catalog-page-break",
          },
        };

        html2pdf()
          .set(catalogOptions)
          .from(catalogElement)
          .save()
          .then(() => {
            alert(
              "Product Catalog PDF Document Downloaded Successfully with Proper Layouts!",
            );
          })
          .catch((err) => {
            console.error("Catalog processing compilation fault:", err);
            alert("Error processing document stream pipelines.");
          });
      });
  }

  /* WHATSAPP DIRECT MESSAGE INTEGRATION ENGINE */
      if (document.getElementById('btnWhatsAppConfig')) {
        document.getElementById('btnWhatsAppConfig').addEventListener('click', () => {
          const targetMobileNumber = "7721092805";
          const clientCustomMessage = " I am interested in this product. Please share more details.";
          const formattedUrlNode = `https://web.whatsapp.com/send?phone=${targetMobileNumber}&text=${encodeURIComponent(clientCustomMessage)}`;
          window.open(formattedUrlNode, '_blank');
        });
      }

      /* EMAIL SYSTEM CONFIGURATION NODE (DIRECT GMAIL WEB INTEGRATION) */
      if (document.getElementById('btnEmailConfig')) {
        document.getElementById('btnEmailConfig').addEventListener('click', () => {
          const recipientEmail = "kalpande402@gmail.com";
          const emailSubject = "Product Inquiry - ElitePlus Training Center";
          
          // Formatting the custom structured text body
          const emailBody = "Dear Sir/Madam,\n" +
            "Greetings.\n\n" +
            "We are interested in your products and would like to request detailed information regarding the items mentioned in the attached catalogue.\n" +
            "Kindly share the following details:\n\n" +
            "- Product specifications\n" +
            "- Latest pricing\n" +
            "- Minimum order quantity (MOQ)\n" +
            "- Availability/Lead time\n" +
            "- Warranty details (if applicable)\n" +
            "- Payment and delivery terms\n\n" +
            "Please find the attached catalogue for your reference.\n" +
            "We look forward to your response and hope to establish a business relationship with your organization.\n\n" +
            "Thank you for your time and support.\n\n" +
            "Best Regards,\n" +
            "Apurva Kalpande\n" +
            "ElitePlus Training Center\n" +
            "+91-7721092805\n" +
            "kalpande402@gmail.com";

          // Creating a direct link to open the official Gmail web interface window
          const directGmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
          window.open(directGmailWebUrl, '_blank');
        });
      }

  currentItemsList = [
    { name: "qubeZERO", qty: 1.0, unit: "Nos", price: 1100000.0 },
  ];

  renderVoucherMasterDirectory();
  renderItemsTable();
});
