// GLOBAL TYPING SPEED (lower = faster)
const TYPE_SPEED = 40;


// Directory listing data (REAL C64 behaviour: READY is NOT part of the grid)
const directory = [
    { num: "10", name: "PROJECTS", link: "/ready.html", type: "PRG" },
    { num: "20", name: "ABOUT ME", link: "/about", type: "PRG" },
    { num: "30", name: "CONTACT", link: "/contact", type: "PRG" },
    { num: "40", name: "GITHUB", link: "https://github.com/JamesOBrien-FED28", type: "PRG" },
    { num: "", name: " ", link: null, type: "" } // blank spacer row
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

    const texts = spans.map(span => {
        if (span.firstChild && span.firstChild.nodeName === "A") {
            return span.firstChild.textContent;
        }
        return span.textContent;
    });

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


// Print READY. outside the grid (REAL C64 behaviour)
function printReady() {
    const container = document.getElementById("dir");

    const ready = document.createElement("div");
    ready.className = "ready-line";
    ready.textContent = "READY.";

    container.appendChild(ready);

    return ready;
}


// Add blinking caret after READY.
function addCaret() {
    const caretRow = document.getElementById("caret-row");
    const nameSpan = caretRow.querySelector(".name");

    const caret = document.createElement("span");
    caret.id = "caret";
    caret.textContent = "█";

    caretRow.style.visibility = "visible"; // show the row
    nameSpan.appendChild(caret);
}



// Type all rows sequentially
document.addEventListener("DOMContentLoaded", async () => {
    buildDirectory();

    const rows = document.querySelectorAll(".row");

    for (let i = 0; i < rows.length; i++) {
        await typeRow(rows[i], TYPE_SPEED);
    }

    const readyLine = printReady(); // prints READY.
    addCaret(); // caret goes on the next line
});

