// Force light mode as default
(function() {
    // Clear any previously stored theme preference
    localStorage.removeItem('theme');
    localStorage.setItem('theme', 'light');

    // Set data-theme attribute immediately
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-bs-theme', 'light');
})();
