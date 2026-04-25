document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("codeInput");
    const submitBtn = document.getElementById("submitBtn");
    const clickBtn = document.getElementById("clickBtn");

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
    window.location.href = "/Kindergarten/1/index.html";
}

function openK2() {
    window.location.href = "/Kindergarten/2/index.html";
}

function openUltrakill() {
    window.location.href = "/ultrakill/index.html";
}

// TIME DISPLAY
function updateTime() {
    const el = document.getElementById("timeText");
    if (!el) return;

    const now = new Date();

    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString("en-GB", {
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

// open in about:blank
blankBtn.onclick = () => {
    const newTab = window.open();
    newTab.document.write(`
        <iframe src="${location.href}" style="width:100%;height:100%;border:none;"></iframe>
    `);
};

const closeBtn = document.getElementById("closeSettings");

closeBtn.onclick = () => {
    panel.classList.remove("open");
};
