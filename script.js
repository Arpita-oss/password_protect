let currentPassword = "";

// Enhanced password generator
function generatePassword() {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const allCharacters = uppercase + lowercase + numbers + symbols;
    
    let password = "";
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    for (let i = 4; i < 16; i++) {
        password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
    }
    
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    currentPassword = password;
    const outputElement = document.getElementById("passwordOutput");
    outputElement.innerHTML = password + ' <button class="copy-btn" onclick="copyPassword()">📋 Copy</button>';
    outputElement.classList.add('has-password');
}

// Copy password to clipboard
function copyPassword() {
    if (!currentPassword) {
        showCopyFeedback("No password to copy!", false);
        return;
    }
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(currentPassword).then(() => {
            showCopyFeedback("Copied! 🎉", true);
        }).catch(() => fallbackCopyToClipboard(currentPassword));
    } else {
        fallbackCopyToClipboard(currentPassword);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showCopyFeedback("Copied! 🎉", true);
}

// Show copy feedback
function showCopyFeedback(message, success) {
    const feedback = document.getElementById("copyFeedback");
    feedback.textContent = message;
    feedback.style.background = success ? "#2a9d8f" : "#e53e3e";
    feedback.classList.add("show");
    setTimeout(() => feedback.classList.remove("show"), 2000);
}

// Table sorting
let sortDirection = {};
function sortTable(columnIndex) {
    const table = document.getElementById("securityTable");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const direction = sortDirection[columnIndex] = sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        return direction === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    rows.forEach(row => tbody.appendChild(row));
    updateSortIndicators(columnIndex, direction);
}

function updateSortIndicators(columnIndex, direction) {
    const headers = document.querySelectorAll("#securityTable th");
    headers.forEach((header, index) => {
        if (index === columnIndex) {
            header.textContent = header.textContent.replace(/[↑↓]/g, '') + (direction === 'asc' ? ' ↑' : ' ↓');
        } else if (header.textContent.includes('↑') || header.textContent.includes('↓')) {
            header.textContent = header.textContent.replace(/[↑↓]/g, '') + ' ↕';
        }
    });
}

// Filter and reset table
function filterTable() {
    const table = document.getElementById("securityTable");
    const rows = table.querySelectorAll("tbody tr");
    let visible = false;
    rows.forEach(row => {
        const level = row.cells[1].textContent;
        row.style.display = level.includes("MAXIMUM SECURITY") ? "" : "none";
        if (row.style.display === "") visible = true;
    });
    showNotification(visible ? "Showing max security" : "No max security found", visible);
}

function resetTable() {
    const table = document.getElementById("securityTable");
    table.querySelectorAll("tbody tr").forEach(row => row.style.display = "");
    showNotification("Table reset", true);
}

// Initialize
window.addEventListener('load', generatePassword);