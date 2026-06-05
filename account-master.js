document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Sidebar Open/Close Toggle Mechanism
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', (e) => {
        sidebar.classList.toggle('open');
        e.stopPropagation();

        // आयकॉन बदलणे (Bars <-> Xmark)
        if (sidebar.classList.contains('open')) {
            toggleIcon.className = 'fa-solid fa-xmark';
        } else {
            toggleIcon.className = 'fa-solid fa-bars';
        }
    });

    // साईडबारच्या बाहेर कुठेही क्लिक केल्यास साईडबार बंद करणे
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 991 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && e.target !== menuToggle) {
                sidebar.classList.remove('open');
                toggleIcon.className = 'fa-solid fa-bars';
            }
        }
    });
});



// Account Master Screen Interaction Engine
document.addEventListener('DOMContentLoaded', () => {
    const accountSearch = document.getElementById('accountSearch');
    const accountTableBody = document.getElementById('accountTableBody');
    const accountForm = document.getElementById('accountForm');

    // 1. Real-time Live Table Filter/Search Mechanism
    if (accountSearch && accountTableBody) {
        accountSearch.addEventListener('input', (element) => {
            const value = element.target.value.toLowerCase().trim();
            const rows = accountTableBody.getElementsByTagName('tr');

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const textContent = row.textContent.toLowerCase();

                if (textContent.includes(value)) {
                    row.style.display = "";
                    row.style.animation = "smoothFadeUp 0.2s ease forwards";
                } else {
                    row.style.display = "none";
                }
            }
        });
    }

    // 2. Button Click Visual Feedback Animation 
    if (accountForm) {
        accountForm.addEventListener('submit', (event) => {
            const saveBtn = accountForm.querySelector('.btn-save-account');
            if (saveBtn) {
                saveBtn.style.transform = "scale(0.98)";
                setTimeout(() => {
                    saveBtn.style.transform = "none";
                }, 150);
            }
        });
    }
});