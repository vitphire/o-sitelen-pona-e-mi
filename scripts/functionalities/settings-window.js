function openSettings() {
    const settingsWindowContainer = document
        .getElementById('settings-window-container');
    settingsWindowContainer.classList.add('show');
}

function closeSettings() {
    const settingsWindowContainer = document
        .getElementById('settings-window-container');
    settingsWindowContainer.classList.remove('show');
}

function updateTheme() {
    const theme = document.getElementById('theme-select')
        .querySelector('input:checked').value;
    // Add class to <html> element
    document.documentElement.classList.remove('theme-dark');
    document.documentElement.classList.remove('theme-light');
    if (theme === "light") {
        document.documentElement.classList.add('theme-light');
    } else if (theme === "dark") {
        document.documentElement.classList.add('theme-dark');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateTheme();
});