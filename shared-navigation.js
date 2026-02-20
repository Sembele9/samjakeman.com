// Shared Navigation Script - Use across all pages
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }

    function initNavigation() {
        const burgerMenu = document.getElementById('burgerMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const menuBackdrop = document.getElementById('menuBackdrop');

        if (!burgerMenu || !menuOverlay || !menuBackdrop) {
            console.error('Navigation elements not found');
            return;
        }

        function openMenu() {
            burgerMenu.classList.add('active');
            menuOverlay.classList.add('active');
            menuBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            burgerMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            menuBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }

        burgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            if (menuOverlay.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking backdrop
        menuBackdrop.addEventListener('click', closeMenu);

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
                closeMenu();
            }
        });
    }
})();
