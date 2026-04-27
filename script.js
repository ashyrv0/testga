document.addEventListener("DOMContentLoaded", () => {
    const settingsBtn = document.getElementById("settingsBtn");
    const loginSection = document.getElementById("loginSection");
    const gameAccess = document.getElementById("gameAccess");
    const input = document.getElementById("codeInput");
    const submitBtn = document.getElementById("submitBtn");
    const clickBtn = document.getElementById("clickBtn");

    if (localStorage.getItem('accessToken')) {
        if (settingsBtn) settingsBtn.style.display = "block";
        if (loginSection) loginSection.style.display = "none";
        if (gameAccess) gameAccess.style.display = "block";
        loadCounter(); // Automatically load the annihilated count
    } else {
        // Hide settings button if no token found
        if (settingsBtn) settingsBtn.style.display = "none";
    }

    Security.init();

    // disable submit at start
    submitBtn.disabled = true;

    // enable button only when input has text
    input.addEventListener("input", () => {
        submitBtn.disabled = input.value.trim() === "";
    });

    // submit click
    submitBtn.addEventListener("click", checkCode);

    // popup click counter
    if (clickBtn) {
        clickBtn.addEventListener("click", async () => {
            const res = await fetch("/api/click", { method: "POST" });
            const data = await res.json();

            if (!data.allowed) {
                document.getElementById("infoText").textContent =
                    "Already annihilated a foid today.";
                return;
            }

            document.getElementById("infoText").textContent =
                `Foids Annihilated: ${data.count}`;
        });
    }
});

const Security = {
    schoolList: ["deledao", "goguardian", "lightspeed", "linewize", "securly", ".edu/"],

    isBlocked(url) {
        try {
            const domain = new URL(url, location.origin).hostname + "/";
            return this.schoolList.some(s => domain.includes(s));
        } catch {
            return false;
        }
    },

    init() {
        const originalFetch = window.fetch;

        window.fetch = function(url, options) {
            if (Security.isBlocked(url)) return Promise.reject(new Error("Blocked"));
            return originalFetch.apply(this, arguments);
        };

        const originalOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(method, url) {
            if (Security.isBlocked(url)) return;
            return originalOpen.apply(this, arguments);
        };
    }
};

// LOGIN
async function checkCode() {
    const inputEl = document.getElementById("codeInput");
    const submitBtn = document.getElementById("submitBtn");
    const input = inputEl.value;

    if (!input) return;

    try {
        const res = await fetch("/api/checkCode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: input })
        });

        const data = await res.json();

        if (data.valid) {
    // Store token in localStorage as fallback
    localStorage.setItem('accessToken', data.token);
    
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("gameAccess").style.display = "block";
    document.getElementById("popup").style.display = "block";
    document.getElementById("settingsBtn").style.display = "block";

    loadCounter();
} else {
    triggerError(inputEl, submitBtn);
}

    } catch (err) {
        console.error("Error:", err);
        triggerError(inputEl, submitBtn);
    }
}

// ERROR EFFECT
function triggerError(inputEl, submitBtn) {
    inputEl.classList.remove("input-error");
    void inputEl.offsetWidth;
    inputEl.classList.add("input-error");

    inputEl.value = "";
    submitBtn.disabled = true;
}


// COUNTER LOAD
async function loadCounter() {
    try {
        const res = await fetch("/api/counter");
        const data = await res.json();

        document.getElementById("infoText").textContent =
            `Foids Annihilated: ${data.count}`;
    } catch (err) {
        console.error(err);
    }
}


// CLOSE POPUP
function closePopup() {
    document.getElementById("popup").style.display = "none";
}


// NAVIGATION
function openGame(path) {
    window.location.href = path;
}

function showKindergarten() {
    const menu = document.getElementById("kindergartenMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function openK1() {
    window.location.href = "/Games/Kindergarten/1/index.html";
}

function openK2() {
    window.location.href = "/Games/Kindergarten/2/index.html";
}

function openUltrakill() {
    window.location.href = "/Games/ultrakill/index.html";
}

// TIME DISPLAY
function updateTime() {
    const el = document.getElementById("timeText");
    if (!el) return;

    const now = new Date();

    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    el.textContent = `Today is ${date} | ${time}`;
}

setInterval(updateTime, 1000);
updateTime();

const settingsBtn = document.getElementById("settingsBtn");
const panel = document.getElementById("settingsPanel");
const panicBtn = document.getElementById("panicKeyBtn");
const urlInput = document.getElementById("panicUrl");
const saveBtn = document.getElementById("saveSettings");
const blankBtn = document.getElementById("blankBtn");
const blobBtn = document.getElementById("blobBtn");

let panicKey = localStorage.getItem("panicKey") || "`";
let panicUrl = localStorage.getItem("panicUrl") || "https://www.google.com";

panicBtn.textContent = "Your key: " + panicKey;
urlInput.value = panicUrl;

// toggle panel
settingsBtn.onclick = () => {
    panel.classList.toggle("open");
};

// change panic key
panicBtn.onclick = () => {
    panicBtn.textContent = "Press any key...";

    const handler = (e) => {
        panicKey = e.key;
        localStorage.setItem("panicKey", panicKey);
        panicBtn.textContent = "Your key: " + panicKey;

        document.removeEventListener("keydown", handler);
    };

    document.addEventListener("keydown", handler);
};

// save URL
saveBtn.onclick = () => {
    panicUrl = urlInput.value.trim();
    if (!panicUrl) return;

    localStorage.setItem("panicUrl", panicUrl);
};

// panic key redirect
document.addEventListener("keydown", (e) => {
    if (e.key === panicKey) {
        window.location.href = panicUrl;
    }
});

// TAB CLOAK - Auto Apply with Revert

// Store original values
const ORIGINAL_TITLE = document.title;
const ORIGINAL_ICON = './Images/icon.ico';

document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.getElementById('cloakDropdownBtn');
    const dropdown = document.getElementById('cloakDropdown');
    const customTitle = document.getElementById('customTitle');
    const customIcon = document.getElementById('customIcon');
    
    // Dropdown toggle
    if (dropdownBtn && dropdown) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
            dropdownBtn.classList.toggle('open', !isOpen);
        });
        
        document.addEventListener('click', (e) => {
            if (!dropdownBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                dropdownBtn.classList.remove('open');
            }
        });
    }
    
    // Preset cloak buttons
    document.querySelectorAll('.cloak-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = btn.dataset.title;
            const icon = btn.dataset.icon;
            applyCloak(title, icon);
            if (customTitle) customTitle.value = title;
            if (customIcon) customIcon.value = icon;
        });
    });
    
    // Custom title
    if (customTitle) {
        let titleTimeout;
        customTitle.addEventListener('input', () => {
            clearTimeout(titleTimeout);
            titleTimeout = setTimeout(() => {
                const title = customTitle.value.trim();
                const icon = customIcon ? customIcon.value.trim() : '';
                
                if (title) {
                    applyCloak(title, icon || null);
                } else if (icon) {
                    applyCloak(ORIGINAL_TITLE, icon);
                } else {
                    resetToOriginal();
                }
            }, 300);
        });
    }
    
    // Custom icon
    if (customIcon) {
        let iconTimeout;
        customIcon.addEventListener('input', () => {
            clearTimeout(iconTimeout);
            iconTimeout = setTimeout(() => {
                const title = customTitle ? customTitle.value.trim() : '';
                const icon = customIcon.value.trim();
                
                if (title && icon) {
                    applyCloak(title, icon);
                } else if (title) {
                    applyCloak(title, null);
                } else if (icon) {
                    applyCloak(ORIGINAL_TITLE, icon);
                } else {
                    resetToOriginal();
                }
            }, 300);
        });
    }
    
    // Load saved cloak
    const savedTitle = localStorage.getItem('cloakTitle');
    const savedIcon = localStorage.getItem('cloakIcon');
    if (savedTitle) {
        applyCloak(savedTitle, savedIcon || null);
        if (customTitle) customTitle.value = savedTitle;
        if (customIcon) customIcon.value = savedIcon || '';
    }
});

// Apply cloak
function applyCloak(title, iconUrl) {
    document.title = title;
    
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/x-icon';
        document.head.appendChild(favicon);
    }
    favicon.href = iconUrl || ORIGINAL_ICON;
    
    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleIcon) {
        appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleIcon);
    }
    appleIcon.href = iconUrl || ORIGINAL_ICON;
    
    localStorage.setItem('cloakTitle', title);
    localStorage.setItem('cloakIcon', iconUrl || '');
}

// Reset to original
function resetToOriginal() {
    document.title = ORIGINAL_TITLE;
    
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = ORIGINAL_ICON;
    
    const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleIcon) appleIcon.href = ORIGINAL_ICON;
    
    localStorage.removeItem('cloakTitle');
    localStorage.removeItem('cloakIcon');
    
    const customTitle = document.getElementById('customTitle');
    const customIcon = document.getElementById('customIcon');
    if (customTitle) customTitle.value = '';
    if (customIcon) customIcon.value = '';
}

// open in about:blank
blankBtn.onclick = () => {
    const newTab = window.open();
    newTab.document.write(`
        <iframe src="${location.href}" style="width:100%;height:100%;border:none;"></iframe>
    `);
};

blobBtn.onclick = () => {
const pageContent = `<html><body><h1>My Secret Site</h1></body></html>`; // Your full site code here
    const blob = new Blob([pageContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.location.href = url;
};

const closeBtn = document.getElementById("closeSettings");

closeBtn.onclick = () => {
    panel.classList.remove("open");
};
