const correctCode = "foidslayer911";

function checkCode() {
    const input = document.getElementById("codeInput").value;

    if (input === correctCode) {
        document.getElementById("gameAccess").style.display = "block";
    } else {
        alert("Wrong code");
    }
}

function openUltrakill() {
    sessionStorage.setItem("access", "granted");
    window.location.href = "ultrakill/index.html";
}

function openYandere() {
    sessionStorage.setItem("access", "granted");
    window.location.href = "yandere/index.html";
}