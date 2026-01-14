document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeText = document.querySelector('.theme-text');
    
    // Check for saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem('newox-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-mode')) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    });
    
    function enableDarkMode() {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeText.textContent = 'Dark Mode';
        localStorage.setItem('newox-theme', 'dark');
        
        // Add animation effect
        document.querySelectorAll('.content-card').forEach(card => {
            card.style.animation = 'fadeIn 0.5s ease';
        });
    }
    
    function enableLightMode() {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeText.textContent = 'Light Mode';
        localStorage.setItem('nevo-theme', 'light');
        
        // Add animation effect
        document.querySelectorAll('.content-card').forEach(card => {
            card.style.animation = 'fadeIn 0.5s ease';
        });
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0.5; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Theme cycling for demo
    let themeCycle = ['light', 'dark', 'auto'];
    let currentCycle = 0;
    
    // Double click for auto mode
    themeToggle.addEventListener('dblclick', function() {
        currentCycle = (currentCycle + 1) % 3;
        
        if (themeCycle[currentCycle] === 'auto') {
            // Auto mode based on system
            if (prefersDark) {
                enableDarkMode();
            } else {
                enableLightMode();
            }
            themeText.textContent = 'Auto Mode';
        } else if (themeCycle[currentCycle] === 'dark') {
            enableDarkMode();
            themeText.textContent = 'Dark Mode';
        } else {
            enableLightMode();
            themeText.textContent = 'Light Mode';
        }
    });
});
