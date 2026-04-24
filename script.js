async function checkCode() {
    const input = document.getElementById("codeInput").value;
    
    if (!input) {
        alert("Please enter a code");
        return;
    }
    
    try {
        const response = await fetch('/api/checkCode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: input })
        });
        
        const data = await response.json();
        
        if (data.valid) {
            document.getElementById("gameAccess").style.display = "block";
        } else {
            alert("Wrong code");
        }
    } catch (error) {
        console.error('Error checking code:', error);
        alert("Error checking code. Try again.");
    }
}

function openUltrakill() {
    sessionStorage.setItem("access", "granted");
    window.location.href = "ultrakill/index.html";
}

<<<<<<< HEAD
function showKindergarten() {
    const menu = document.getElementById("kindergartenMenu");

    if (menu.style.display === "none") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

function openK1() {
    sessionStorage.setItem("access", "granted");
    window.location.href = "kindergarden/1/index.html";
}

function openK2() {
    sessionStorage.setItem("access", "granted");
    window.location.href = "kindergarden/2/index.html";
}
=======
function openYandere() {
    sessionStorage.setItem("access", "granted");
    window.location.href = "yandere/index.html";
}
>>>>>>> 75293ec847d31ab02c9c83a320025f55d178e36e
