document.addEventListener('DOMContentLoaded', () => {

    // --- INSECURE CLIENT-SIDE LOGIN LOGIC ---
    // DO NOT USE THIS FOR REAL SECURITY. IT CAN BE EASILY BYPASSED.
    const loginForm = document.getElementById('login-form');
    const loginOverlay = document.getElementById('login-overlay');
    const portfolioContent = document.getElementById('portfolio-content');

    // Check if user is already "logged in" (e.g., from a previous session)
    // In a real app, this would involve server-side session checks.
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
            if (username === 'demo' && password === 'password123') {
                sessionStorage.setItem('loggedIn', 'true'); // "Log in" the user
                loginOverlay.style.display = 'none'; // Hide the login overlay
                portfolioContent.classList.remove('hidden'); // Show portfolio content
            } else {
                alert('Invalid username or password. (Hint: demo / password123)');
                // Clear password field for security
                passwordInput.value = '';
            }
        });
    }
    // --- END OF INSECURE LOGIN LOGIC ---


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
    const contactForm = document.querySelector('#contact-form'); // Changed ID to contact-form
    if (contactForm) { // Ensure the form exists before adding listener
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
            // Note: For a real contact form, you'd send data to a server here.
            // If submission is successful and you want to prevent refresh:
            // e.preventDefault(); // Uncomment this if you handle submission via AJAX
            // alert('Message sent successfully!');
            // this.reset(); // Reset form fields
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
            // Optional: If you want elements to re-animate when scrolling back,
            // remove the `observer.unobserve(entry.target);` line above
            // and uncomment the `else` block below:
            /*
            else {
                entry.target.classList.remove('animate-visible');
            }
            */
        });
    }, observerOptions);

    // Observe each relevant element
    animatedElements.forEach(element => {
        elementObserver.observe(element);
    });


    // --- Highlight current section in navigation as you scroll ---
    const sections = document.querySelectorAll('section');
    // Select both main nav and footer nav links
    const navLinks = document.querySelectorAll('.navbar ul li a, footer nav ul li a');
    const mainNavbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollY = window.pageYOffset;
        const navbarHeight = mainNavbar.offsetHeight; // Get current navbar height

        sections.forEach(section => {
            // Adjust offset to trigger highlighting slightly before section is at top
            // Account for sticky navbar height
            const sectionTop = section.offsetTop - navbarHeight - 50; // Added extra buffer
            const sectionHeight = section.offsetHeight; // Use offsetHeight for full element height

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active'); // Remove active from all links first
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active'); // Add active to the current section's link
            }
        });
    });

}); // End of DOMContentLoaded
