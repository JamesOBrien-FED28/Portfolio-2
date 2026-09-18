// GLOBAL TYPING SPEED (lower = faster)
const TYPE_SPEED = 40;   // try 30 or 20 if you want it snappier


// Directory listing data
const directory = [
    { num: "10", name: "PROJECTS", link: "/projects", type: "PRG" },
    { num: "20", name: "ABOUT ME", link: "/about", type: "PRG" },
    { num: "30", name: "CONTACT", link: "/contact", type: "PRG" },
    { num: "40", name: "GITHUB", link: "https://github.com/JamesOBrien-FED28", type: "PRG" },
    { num: "", name: " ", link: null, type: "" },
    { num: "", name: "READY.", link: null, type: "" }
];


// Build directory rows (hidden)
function buildDirectory() {
    const container = document.getElementById("dir");

    directory.forEach(entry => {
        const row = document.createElement("div");
        row.className = "row";
        row.style.visibility = "hidden";

        const num = document.createElement("span");
        num.className = "num";
        num.textContent = entry.num;

        const name = document.createElement("span");
        name.className = "name";

        if (entry.link) {
            const a = document.createElement("a");
            a.href = entry.link;
            a.textContent = entry.name;
            name.appendChild(a);
        } else {
            name.textContent = entry.name;
        }

        const type = document.createElement("span");
        type.className = "type";
        type.textContent = entry.type;

        row.appendChild(num);
        row.appendChild(name);
        row.appendChild(type);

        container.appendChild(row);
    });
}


// Type one row (text only, HTML untouched)
function typeRow(row, speed = TYPE_SPEED) {
    const spans = [...row.children];

    // Extract text content safely
    const texts = spans.map(span => {
        if (span.firstChild && span.firstChild.nodeName === "A") {
            return span.firstChild.textContent; // link text
        }
        return span.textContent; // normal text
    });

    // Clear text content but keep DOM structure intact
    spans.forEach(span => {
        if (span.firstChild && span.firstChild.nodeName === "A") {
            span.firstChild.textContent = "";
        } else {
            span.textContent = "";
        }
    });

    row.style.visibility = "visible";

    return new Promise(resolve => {
        let spanIndex = 0;
        let charIndex = 0;

        function typeNext() {
            if (spanIndex >= spans.length) {
                resolve();
                return;
            }

            const span = spans[spanIndex];
            const text = texts[spanIndex];

            const target = (span.firstChild && span.firstChild.nodeName === "A")
                ? span.firstChild
                : span;

            if (charIndex < text.length) {
                const ch = text[charIndex];
                target.textContent += ch === " " ? "\u00A0" : ch;
                charIndex++;

                // REAL speed control
                setTimeout(typeNext, speed);
            } else {
                spanIndex++;
                charIndex = 0;
                typeNext();
            }
        }

        typeNext();
    });
}


// Type all rows sequentially
document.addEventListener("DOMContentLoaded", async () => {
    buildDirectory();

    const rows = document.querySelectorAll(".row");

    for (let i = 0; i < rows.length; i++) {
        await typeRow(rows[i], TYPE_SPEED);
    }
});
