// Simple video initialization
function initVideo() {
    const video = document.getElementById('background-video');
    
    // Try to play the video
    video.play().catch(function(error) {
        console.log('Autoplay was prevented:', error);
        // Show a message or handle the error
    });
    
    // Handle video errors
    video.addEventListener('error', function(e) {
        console.error('Video error:', e);
        console.log('Make sure assets/hero-video.mp4 exists and is a valid MP4 file');
    });
    
    // Log when video loads successfully
    video.addEventListener('loadeddata', function() {
        console.log('Video loaded successfully');
    });
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initVideo();
    
    // Rest of your existing newsletter code...
    const newsletterForm = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        // Send to PHP backend
        fetch('subscribe.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'email=' + encodeURIComponent(email)
        })
        .then(response => response.text())
        .then(result => {
            if (result === 'success') {
                showMessage('Thank you for subscribing! We\'ll be in touch soon.', 'success');
                emailInput.value = '';
            } else if (result === 'invalid') {
                showMessage('Please enter a valid email address.', 'error');
            } else {
                showMessage('Sorry, there was an error. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Sorry, there was an error. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
    
    // Explore Button Click
    document.getElementById('explore-btn').addEventListener('click', function() {
        document.querySelector('.newsletter').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Contact Button Click
    document.getElementById('contact-btn').addEventListener('click', function() {
        alert('Contact functionality will be available soon. Please check back later!');
    });
    
    // Helper Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = type;
        
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = '';
        }, 5000);
    }
});
