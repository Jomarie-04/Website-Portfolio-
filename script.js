document.addEventListener('DOMContentLoaded', () => {

    // --- INSECURE CLIENT-SIDE LOGIN LOGIC ---
    // DO NOT USE THIS FOR REAL SECURITY. IT CAN BE EASILY BYPASSED.
    const loginForm = document.getElementById('login-form');
    const loginOverlay = document.getElementById('login-overlay');
    const portfolioContent = document.getElementById('portfolio-content');
    const logoutBtn = document.getElementById('logout-btn'); // Get the new logout button

    // Check if user is already "logged in" (e.g., from a previous session)
    if (sessionStorage.getItem('loggedIn') === 'true') {
        loginOverlay.style.display = 'none';
        portfolioContent.classList.remove('hidden');
    } else {
        loginOverlay.style.display = 'flex'; // Ensure it's visible if not logged in
        portfolioContent.classList.add('hidden'); // Ensure content is hidden
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Hardcoded credentials for demonstration (INSECURE!)
            if (username === 'jomarie' && password === 'jomarie4') {
                sessionStorage.setItem('loggedIn', 'true'); // "Log in" the user
                loginOverlay.style.display = 'none'; // Hide the login overlay
                portfolioContent.classList.remove('hidden'); // Show portfolio content
            } else {
                alert('Invalid username or password. (Hint: jomarie / jomarie4)');
                // Clear password field for security
                passwordInput.value = '';
            }
        });
    }

    // --- NEW: Logout Logic ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('loggedIn'); // Remove the login status
            loginOverlay.style.display = 'flex'; // Show the login overlay
            portfolioContent.classList.add('hidden'); // Hide portfolio content
            // Optional: Scroll to the top of the page after logout
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // --- END OF INSECURE LOGIN/LOGOUT LOGIC ---


    // --- Smooth scroll for internal anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default jump behavior

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position to account for fixed navbar height
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const offsetTop = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Form validation for contact form ---
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const name = document.querySelector('#name');
            const email = document.querySelector('#email');
            const message = document.querySelector('#message');

            if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
                e.preventDefault();
                alert('Please fill out all fields.');
            } else if (!validateEmail(email.value)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
            }
        });
    }

    // Basic email format validation
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // --- Intersection Observer for "on-scroll" animations ---
    const animatedElements = document.querySelectorAll('section, .hero-section .greeting, .hero-section .name, .hero-section .role, .hero-section img');

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a class that triggers the CSS animation
                entry.target.classList.add('animate-visible');
                // Stop observing once animated if you only want it to animate once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each relevant element
    animatedElements.forEach(element => {
        elementObserver.observe(element);
    });


    // --- Highlight current section in navigation as you scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar ul li a, footer nav ul li a');
    const mainNavbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollY = window.pageYOffset;
        const navbarHeight = mainNavbar.offsetHeight; // Get current navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            // Ensure the logout button isn't accidentally styled as active
            if (!link.classList.contains('logout-btn')) { // Exclude logout button
                link.classList.remove('active');
            }
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

}); // End of DOMContentLoaded
