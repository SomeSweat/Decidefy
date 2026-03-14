// --- Glücksrad ---
const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultP = document.getElementById("result");

let options = [];
let startAngle = 0;
let spinning = false;

// Farben für Rad (Regenbogen)
function getColor(index, total) {
    return `hsl(${(index / total) * 360}, 90%, 60%)`;
}

// Option hinzufügen
function addOption() {
    const input = document.getElementById('optionInput');
    const value = input.value.trim();
    if (value !== "") {
        options.push(value);
        input.value = "";
        drawWheel();
    }
}

// Rad zeichnen
function drawWheel() {

    const centerX = wheel.width / 2;
    const centerY = wheel.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const arc = (2 * Math.PI) / (options.length || 1);

    ctx.clearRect(0, 0, wheel.width, wheel.height);

    for (let i = 0; i < options.length; i++) {

        const angle = startAngle + i * arc;

        ctx.fillStyle = getColor(i, options.length);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc);
        ctx.fill();

        // Text
        ctx.save();

        ctx.translate(
            centerX + Math.cos(angle + arc / 2) * (radius - 60),
            centerY + Math.sin(angle + arc / 2) * (radius - 60)
        );

        ctx.rotate(angle + arc / 2 + Math.PI / 2);

        ctx.fillStyle = "#000";
        ctx.font = "18px Arial";

        const text = options[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);

        ctx.restore();
    }
}



// Rad drehen
function spin() {
    if (options.length === 0 || spinning) {
        alert("Bitte zuerst Optionen hinzufügen!");
        return;
    }

    spinning = true;
    spinBtn.disabled = true;

    let spinAngle = Math.random() * 10 + 10;
    let spinTime = 0;
    let spinTimeTotal = Math.random() * 3000 + 2000;

    function rotateWheel() {
        spinTime += 30;
        startAngle += (spinAngle * Math.PI) / 180;
        drawWheel();

        if (spinTime < spinTimeTotal) {
            requestAnimationFrame(rotateWheel);
        } else {
            stopRotateWheel();
        }
    }
    rotateWheel();
}

// Rad stoppen
function stopRotateWheel() {
    const arc = (2 * Math.PI) / options.length;
    const degrees = (startAngle * 180 / Math.PI + 90) % 360;
    const index = Math.floor((360 - degrees) / (360 / options.length)) % options.length;

    // Ergebnis anzeigen mit Pop-Up und Regenbogen-Atmung
    resultP.textContent = "Gewählte Option: " + options[index];
    resultP.style.opacity = 1;

    spinning = false;
    spinBtn.disabled = false;
}

// Start Rad
spinBtn.addEventListener("click", spin);
drawWheel();

// --- KI Pro/Contra (Pollinations Open Source, neutral + Empfehlung) ---
async function getDecisionWithAI() {
    const question = document.getElementById("aiQuestion").value.trim();
    if (!question) {
        alert("Bitte eine Frage eingeben!");
        return;
    }

    try {
        // Neuer Prompt
        const prompt = encodeURIComponent(
            `Schreibe eine kurze, einfache Empfehlung für die Frage "${question}". ` +
            `Beginne mit "Ich würde dir empfehlen ...", ` +
            `nimm klar Stellung (eine Seite), ` +
            `füge kurze Pro- und Contra-Erklärungen ein, ` +
            `einfach verständlich für ein Kind, ` +
            `kein Aufzählen, keine Listen, kein Fett oder Formatierung, reiner Text.`
        );

        const response = await fetch("https://text.pollinations.ai/" + prompt);
        const resultText = await response.text();

        // Ergebnis direkt anzeigen
        document.getElementById("aiResult").innerText =
            `Frage: ${question}\nEmpfehlung: ${resultText}`;
    } catch (error) {
        console.error(error);
        alert("Fehler bei der KI-Antwort!");
    }
}
