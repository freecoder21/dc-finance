// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Formspree Form Handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form elements
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state with animation
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.classList.add('sending');
        
        // Hide previous status messages
        if (formStatus) {
            formStatus.style.display = 'none';
            formStatus.classList.remove('show');
        }
        
        try {
            // Send form data to Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success message with enhanced styling
                showFormStatus('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
                
                // Add a little celebration effect
                celebrateSubmission();
            } else {
                // Error message
                showFormStatus('There was a problem sending your message. Please try again.', 'error');
            }
        } catch (error) {
            // Network error
            showFormStatus('There was a problem sending your message. Please check your connection and try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('sending');
        }
    });
}

function showFormStatus(message, type) {
    if (!formStatus) return;
    
    // Create different HTML based on message type
    if (type === 'success') {
        formStatus.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        formStatus.style.backgroundColor = '#d4edda';
        formStatus.style.color = '#155724';
        formStatus.style.border = '1px solid #c3e6cb';
    } else {
        formStatus.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        formStatus.style.backgroundColor = '#f8d7da';
        formStatus.style.color = '#721c24';
        formStatus.style.border = '1px solid #f5c6cb';
    }
    
    // Show with animation
    formStatus.style.display = 'block';
    setTimeout(() => {
        formStatus.classList.add('show');
    }, 10);
    
    // Auto-hide success messages after 8 seconds
    if (type === 'success') {
        setTimeout(() => {
            formStatus.classList.remove('show');
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 500);
        }, 8000);
    }
}

// Optional: Add a little celebration effect
function celebrateSubmission() {
    const confetti = ['🎉', '✨', '👍', '🚀', '💫'];
    const button = contactForm.querySelector('button[type="submit"]');

    // Just temporarily show celebration text
    const tempText = 'Message Sent! ' + confetti[Math.floor(Math.random() * confetti.length)];
    const savedText = button.textContent; // save the current button text

    button.textContent = tempText;

    setTimeout(() => {
        button.textContent = savedText; // restore it
    }, 2000);
}

    
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.site-header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
});