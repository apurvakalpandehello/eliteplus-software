/**
 * Elite Plus Master Account System Database Registries
 */
const corporateCustomerMaster = {
    "CUST-01": { 
        name: "Jeevansetu Lifecare Pvt Ltd", 
        address: "S.No. 21/2A, Shop No. 4A, A-Wing,, Suryapuram Daulat Nagar, Vadgaon Budruk,, Pune, Maharashtra - 411041", 
        phone: "8888884818", 
        state: "Maharashtra ( 27 )" 
    },
    "CUST-02": { 
        name: "Apex Global Healthcare Systems", 
        address: "Tower C, Floor 4, Cyber City Phase II, Gurgaon, Haryana - 122002", 
        phone: "9811022334", 
        state: "Haryana ( 06 )" 
    }
};

const corporateInventoryMaster = {
    "1": { name: "Philips Heartstart FRX Defibrillator (861304, Pad Set, Carry Case)", hsn: "90189094", rate: 87000.00, gst: 5 },
    "2": { name: "Advanced Practiman CPR Manikin (MD-AD01)", hsn: "90230010", rate: 10500.00, gst: 18 },
    "3": { name: "Advanced Practiman Plus CPR Manikin", hsn: "90230010", rate: 18000.00, gst: 18 },
    "4": { name: "CPR Pocket Mask", hsn: "9018", rate: 450.00, gst: 5 },
    "5": { name: "Silicone Resuscitator Adult", hsn: "90191010", rate: 900.00, gst: 5 },
    "6": { name: "Thadani 5000 Series First aid kit", hsn: "30065000", rate: 2200.00, gst: 12 },
    "7": { name: "XFT AED Trainer", hsn: "90230010", rate: 12000.00, gst: 18 },
    "8": { name: "AED Cabinet with Alarm (ACA01)", hsn: "83024190", rate: 5700.00, gst: 18 },
    "9": { name: "AED Response Kit", hsn: "9018", rate: 1200.00, gst: 5 }
};

document.addEventListener('DOMContentLoaded', () => {

    // Mobile Sidebar Visibility Handler
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => { 
            sidebar.classList.toggle('open'); 
            e.stopPropagation(); 
        });
    }

    // Default Timestamp Automation
    document.getElementById('formQuoteDate').valueAsDate = new Date();
    const netValidityDate = new Date(); 
    netValidityDate.setDate(netValidityDate.getDate() + 30);
    document.getElementById('formCompletionDate').valueAsDate = netValidityDate;

    // Client Selector Auto-Fetch Loop Controller
    const clientSelector = document.getElementById('formClientSelector');
    clientSelector.addEventListener('change', (e) => {
        const key = e.target.value;
        const nameField = document.getElementById('formClientName');
        const addrField = document.getElementById('formClientAddress');
        const phoneField = document.getElementById('formClientPhone');
        const stateField = document.getElementById('formClientState');

        if (key === "MANUAL") {
            nameField.value = ""; addrField.value = ""; phoneField.value = ""; 
            nameField.readOnly = false; addrField.readOnly = false;
        } else {
            const data = corporateCustomerMaster[key];
            if (data) {
                nameField.value = data.name; 
                addrField.value = data.address; 
                phoneField.value = data.phone; 
                stateField.value = data.state;
                nameField.readOnly = true; 
                addrField.readOnly = true;
            }
        }
    });

    // Grid Row Injection Controller System
    const itemsTableBody = document.getElementById('formItemsTableBody');
    const addNewLineBtn = document.getElementById('addNewLineBtn');

    let selectDropdownHTML = `<option value="CUSTOM_PRODUCT" selected>-- Manual Custom Item (Type Below) --</option>`;
    for (let id in corporateInventoryMaster) {
        selectDropdownHTML += `<option value="${id}">${corporateInventoryMaster[id].name}</option>`;
    }

    function createMatrixConfigRow() {
        const tr = document.createElement('tr');
        tr.className = 'animate-fade-in';
        tr.innerHTML = `
            <td>
                <select class="form-input-custom row-select-link mb-1" style="padding:4px 8px; font-size:13px; border-color:#94A3B8;">${selectDropdownHTML}</select>
                <input type="text" class="form-input-custom row-name" placeholder="Name of Product / Service Specification Details" required style="padding:6px 10px; font-size:13px;">
            </td>
            <td><input type="text" class="form-input-custom row-hsn text-center" placeholder="HSN/SAC" style="padding:6px; font-size:13px;"></td>
            <td><input type="number" class="form-input-custom row-qty text-center" value="1" min="1" required style="padding:6px; font-size:13px;"></td>
            <td><input type="number" class="form-input-custom row-rate text-end" value="0.00" step="0.01" required style="padding:6px; font-size:13px;"></td>
            <td><input type="number" class="form-input-custom row-gst text-center" value="18" min="0" max="100" style="padding:6px; font-size:13px;"></td>
            <td class="text-end fw-semibold font-monospace row-total-label" style="padding:12px; font-size:14px; color:#334155;">₹0.00</td>
            <td class="text-center"><button type="button" class="btn-row-delete border-0 bg-transparent text-danger"><i class="fa-solid fa-trash-can"></i></button></td>
        `;
        itemsTableBody.appendChild(tr);
        bindLiveRowMathEvents(tr);
    }

    function bindLiveRowMathEvents(row) {
        const select = row.querySelector('.row-select-link');
        const nameInp = row.querySelector('.row-name');
        const hsnInp = row.querySelector('.row-hsn');
        const qtyInp = row.querySelector('.row-qty');
        const rateInp = row.querySelector('.row-rate');
        const gstInp = row.querySelector('.row-gst');

        select.addEventListener('change', (e) => {
            if (e.target.value === "CUSTOM_PRODUCT") {
                nameInp.value = ""; hsnInp.value = ""; rateInp.value = "0.00"; gstInp.value = "18"; nameInp.readOnly = false;
            } else {
                const item = corporateInventoryMaster[e.target.value];
                if (item) {
                    nameInp.value = item.name; hsnInp.value = item.hsn; rateInp.value = item.rate.toFixed(2); gstInp.value = item.gst;
                    nameInp.readOnly = true;
                }
            }
            evaluateRowTotal(row);
        });

        [qtyInp, rateInp, gstInp].forEach(input => {
            input.addEventListener('input', () => evaluateRowTotal(row));
        });

        row.querySelector('.btn-row-delete').addEventListener('click', () => {
            row.remove();
        });
    }

    function evaluateRowTotal(row) {
        const qty = parseFloat(row.querySelector('.row-qty').value) || 0;
        const rate = parseFloat(row.querySelector('.row-rate').value) || 0;
        const subLineGross = qty * rate;
        row.querySelector('.row-total-label').innerText = '₹' + subLineGross.toLocaleString('en-IN', {minimumFractionDigits: 2});
    }

    addNewLineBtn.addEventListener('click', createMatrixConfigRow);
    createMatrixConfigRow(); // Initialize First Row Instance

    // Form Level Submission Data Parsers to A4 Sheet Profile
    const masterForm = document.getElementById('quotationEntryForm');
    masterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hydrate Document Labels
        document.getElementById('pQuoteNo').innerText = document.getElementById('formQuoteNo').value;
        document.getElementById('pQuoteDate').innerText = formatDateStringIn(document.getElementById('formQuoteDate').value);
        document.getElementById('pCompletionDate').innerText = formatDateStringIn(document.getElementById('formCompletionDate').value);
        document.getElementById('printCopyLabel').innerText = document.getElementById('formPrintMode').value;

        // Hydrate Client Metadata Nodes
        document.getElementById('pClientName').innerText = document.getElementById('formClientName').value;
        document.getElementById('pClientAddress').innerText = document.getElementById('formClientAddress').value;
        document.getElementById('pClientPhone').innerText = document.getElementById('formClientPhone').value;
        document.getElementById('pClientState').innerText = document.getElementById('formClientState').value;

        // Render Matrix Table Nodes Flow
        const printBody = document.getElementById('printMatrixTableBody');
        printBody.innerHTML = ''; 

        const inputsRows = itemsTableBody.querySelectorAll('tr');
        let accumTaxable = 0;
        let accumCGST = 0;
        let accumSGST = 0;

        inputsRows.forEach((row, index) => {
            const productSpecName = row.querySelector('.row-name').value;
            const productHsnCode = row.querySelector('.row-hsn').value || '-';
            const quantityVal = parseFloat(row.querySelector('.row-qty').value) || 0;
            const singleRateVal = parseFloat(row.querySelector('.row-rate').value) || 0;
            const baseGstPct = parseFloat(row.querySelector('.row-gst').value) || 0;

            const computedTaxable = quantityVal * singleRateVal;
            const computedTaxPool = computedTaxable * (baseGstPct / 100);
            const cgstAllocatedAmt = computedTaxPool / 2;
            const sgstAllocatedAmt = computedTaxPool / 2;
            const completeAggregateSum = computedTaxable + computedTaxPool;

            accumTaxable += computedTaxable;
            accumCGST += cgstAllocatedAmt;
            accumSGST += sgstAllocatedAmt;

            const rowOutputHTML = `
                <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td><strong>${productSpecName}</strong></td>
                    <td style="text-align: center;">${productHsnCode}</td>
                    <td style="text-align: center;">${quantityVal.toFixed(2)} NOS</td>
                    <td style="text-align: right;">${singleRateVal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td style="text-align: right;">${computedTaxable.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td style="text-align: center; border-left:1px solid var(--ep-blue);">${(baseGstPct/2).toFixed(2)}</td>
                    <td style="text-align: right;">${cgstAllocatedAmt.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td style="text-align: center; border-left:1px solid var(--ep-blue);">${(baseGstPct/2).toFixed(2)}</td>
                    <td style="text-align: right;">${sgstAllocatedAmt.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td style="text-align: right; font-weight: 700;">${completeAggregateSum.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
            `;
            printBody.insertAdjacentHTML('beforeend', rowOutputHTML);
        });

        const aggregateTaxValue = accumCGST + accumSGST;
        const totalGrandPayableWithTax = accumTaxable + aggregateTaxValue;
        const mathematicallyRoundedFinalInt = Math.round(totalGrandPayableWithTax);

        // Render Primary Totals
        document.getElementById('pTotalTaxable').innerText = accumTaxable.toLocaleString('en-IN', {minimumFractionDigits: 2});
        document.getElementById('pTotalCGST').innerText = accumCGST.toLocaleString('en-IN', {minimumFractionDigits: 2});
        document.getElementById('pTotalSGST').innerText = accumSGST.toLocaleString('en-IN', {minimumFractionDigits: 2});
        document.getElementById('pTotalGrand').innerText = mathematicallyRoundedFinalInt.toLocaleString('en-IN', {minimumFractionDigits: 2});

        // Render Summary Sidebar Boxes
        document.getElementById('pSummaryTaxable').innerText = '₹' + accumTaxable.toLocaleString('en-IN', {minimumFractionDigits: 2});
        document.getElementById('pSummaryCGST').innerText = '₹' + accumCGST.toLocaleString('en-IN', {minimumFractionDigits: 2});
        document.getElementById('pSummarySGST').innerText = '₹' + accumSGST.toLocaleString('en-IN', {minimumFractionDigits: 2});
        document.getElementById('pSummaryTaxTotal').innerText = '₹' + aggregateTaxValue.toLocaleString('en-IN', {minimumFractionDigits: 2});

        // Textual Currency Conversions Engine Call
        document.getElementById('pAmountInWords').innerText = translateIntegerToIndianWords(mathematicallyRoundedFinalInt) + " ONLY";

        // Toggle Displays Viewport Configurations
        document.getElementById('eliteQuotationFormWorkspace').style.display = 'none';
        document.getElementById('eliteQuotationPrintView').style.display = 'block';
        window.scrollTo(0, 0);
    });

    // View Transitions System Triggers
    document.getElementById('backToFormBtn').addEventListener('click', () => {
        document.getElementById('eliteQuotationPrintView').style.display = 'none';
        document.getElementById('eliteQuotationFormWorkspace').style.display = 'block';
    });

    document.getElementById('triggerPrintSystemBtn').addEventListener('click', () => { 
        window.print(); 
    });

    // ==========================================
    // HIGH-RESOLUTION CHROMIUM VECTOR PDF DOWNLOAD HOOK
    // ==========================================
    document.getElementById('triggerDownloadPDFBtn').addEventListener('click', () => {
        const targetElement = document.querySelector('.a4-container'); 
        const quotationNum = document.getElementById('pQuoteNo').innerText || "QTN";
        const customerIdent = document.getElementById('pClientName').innerText || "Client";

        const optionsStructure = {
            margin:       0,
            filename:     `Quotation_${quotationNum.replace(/\//g, '-')}_${customerIdent.replace(/\s+/g, '-')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2.5, // Enhances typography resolution and keeps graphics sharp
                useCORS: true, 
                letterRendering: true
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(optionsStructure).from(targetElement).save();
    });

    // Webhook API Communication Integrations Trigger Simulations
    document.getElementById('btnActionWhatsapp').addEventListener('click', () => {
        const target = document.getElementById('formClientName').value || "Client";
        alert(`WhatsApp Business API: Package structured and dispatched to ${target} secure register endpoints.`);
    });

    document.getElementById('btnActionEmail').addEventListener('click', () => {
        alert('SMTP Transaction Engine: Electronic quotation copy dispatched to registered stakeholder accounts.');
    });

    // Master Form Cleaner Handler
    document.getElementById('btnResetForm').addEventListener('click', () => {
        masterForm.reset(); itemsTableBody.innerHTML = ''; createMatrixConfigRow();
        document.getElementById('formClientSelector').value = "MANUAL";
        document.getElementById('formClientName').readOnly = false;
        document.getElementById('formClientAddress').readOnly = false;
    });

    // Date String Parser Helper (YYYY-MM-DD -> DD-Mmm-YYYY)
    function formatDateStringIn(inputStr) {
        if (!inputStr) return '';
        const dateObj = new Date(inputStr);
        const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${dateObj.getDate()}-${monthShortNames[dateObj.getMonth()]}-${dateObj.getFullYear()}`;
    }

    // Indian Financial System Currency Text Formatter
    function translateIntegerToIndianWords(num) {
        if (num === 0) return 'ZERO RUPEES';
        const unique = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
        const tens = ['', '', 'TWENTY ', 'THIRTY ', 'FORTY ', 'FIFTY ', 'SIXTY ', 'SEVENTY ', 'EIGHTY ', 'NINETY '];
        
        function processTens(n) { if (n < 20) return unique[n]; return tens[Math.floor(n / 10)] + unique[n % 10]; }
        function processBlock(n, marker) {
            if (n === 0) return '';
            if (n > 99) return unique[Math.floor(n / 100)] + 'HUNDRED ' + processTens(n % 100) + marker;
            return processTens(n) + marker;
        }
        let wordResult = '';
        wordResult += processBlock(Math.floor(num / 10000000), 'CRORE ');
        wordResult += processBlock(Math.floor((num % 10000000) / 100000), 'LAKH ');
        wordResult += processBlock(Math.floor((num % 100000) / 1000), 'THOUSAND ');
        wordResult += processBlock(num % 1000, '');
        return wordResult.trim() + ' RUPEES';
    }
});