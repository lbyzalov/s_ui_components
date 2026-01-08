/*
js code for test UI component
made by Lev Byzalov
*/

// const declarations: origin, event type
const VALID_ORIGIN = "https://test.automation.sirioninc.net";
const EVENT_TYPE_RENDER = "ui_component_render";

// function to escape html special characters
function escapeHtml(value) {
    return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// function to render html table from payload
function renderTable(payload) {
    // extracts columns and rows from payload
    const columns = payload.columns;
    const rows = payload.rows;

    const thead = `
    <thead>
        <tr>
        ${columns?.map(c => `<th style="width: ${c.width || 'auto'}">${escapeHtml(c.label)}<br><button type="button">Regenerate</button></th>`).join("")}
        </tr>
    </thead>
    `;

    const tbody = `
    <tbody>
        ${rows?.map(row => `
        <tr>
            ${columns?.map(c => `<td>${escapeHtml(row?.[c.id])}</td>`).join("")}
        </tr>
        `).join("")}
    </tbody>
    `;

    return `<table>${thead}${tbody}</table>`;
}

// function to send message to parent window
function sendMessageToParent(message, llmMessage) {
    window.parent.postMessage(
      {
        type: "ui_component_user_message",
        message: message,
        llmMessage: llmMessage
      },
      "*" // replace with parent origin for production security
    );
  }

// event listener for button clicks
window.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
        const cell = event.target.closest("th");
        const column_name = cell.innerText.trim().slice(0,-"Regenerate".length).trim();
        const message = `Regenerate data for column: ${column_name}`;
        const llmMessage = JSON.stringify({ action: "regenerate_column", column: column_name });
        sendMessageToParent(message, llmMessage);
    }
});
// event listener for message events
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