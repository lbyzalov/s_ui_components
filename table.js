/*
js code for test UI component
made by Lev Byzalov
*/

// const declarations: origin, event type
const VALID_ORIGIN = "https://test.automation.sirioninc.net";
const EVENT_TYPE_RENDER = "ui_component_render";

function escapeHtml(value) {
    return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTable({ columns, rows }) {
    const thead = `
    <thead>
        <tr>
        ${columns?.map(c => `<th>${escapeHtml(c)}</th>`).join("")}
        </tr>
    </thead>
    `;

    const tbody = `
    <tbody>
        ${rows?.map(row => `
        <tr>
            ${columns?.map(c => `<td>${escapeHtml(row[c])}</td>`).join("")}
        </tr>
        `).join("")}
    </tbody>
    `;

    return `<table>${thead}${tbody}</table>`;
}

window.addEventListener("message", (event) => {
    console.log("Received message:", event);
    /* security: check for valid origin */
    if (event.origin !== VALID_ORIGIN) {
    console.log("Blocked message from unknown origin:", event.origin);
    return;
    } 

    const { type, payload } = event.data || {};

    if (type === EVENT_TYPE_RENDER) {
    const container = document.getElementById("container");
    container.innerHTML = renderTable(payload);
    }
});