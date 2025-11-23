/**
 * CLEAN JS FILE: Focus on Background Video and Page Lifecycle Management
 * This script ensures the main video loops correctly and reliably restarts
 * when the page is restored from the browser cache (e.g., hitting the back button).
 */

// --- Constants ---
const loopVideo = document.getElementById('background-video');
const newsletterForm = document.getElementById('newsletter-form');
const formMessage = document.getElementById('form-message');

// --- 1. Background Video Control ---

/**
 * Resets the time and plays the main background video.
 */
function restartVideo() {
    if (!loopVideo) {
        console.error("Error: 'background-video' element not found.");
        return;
    }
    // Set currentTime to 0 to ensure restart/loop.
    loopVideo.currentTime = 0;
    
    // Attempt to play the video.
    loopVideo.play().catch(e => {
        console.log('Autoplay was prevented (browser requirement). Ensure video is muted.', e);
        // Add a class or handle UI if manual interaction is needed, though 'muted' should fix this.
    });
}

// --- 2. Page Lifecycle Handler ---

document.addEventListener('DOMContentLoaded', function() {
    
    // Initial startup sequence
    restartVideo();

    // Use pageshow for reliable restarts, especially when returning from another page (BFcache).
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            console.log('Page restored from cache. Restarting video.');
        }
        
        // This is the core fix: ensures video restarts whether it's a fresh load or a cache restore.
        restartVideo();
    });
    
    // --- 3. Newsletter/Other Code ---
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();
            
            // Assuming helper functions (isValidEmail, showMessage) are defined elsewhere
            // if (!isValidEmail(email)) { ... }
            
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            fetch('subscribe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'email=' + encodeURIComponent(email)
            })
            .then(response => response.text())
            .then(result => {
                // ... handling success/error messages ...
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Explore Button Click
    document.getElementById('explore-btn')?.addEventListener('click', function() {
        document.querySelector('.newsletter')?.scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Contact Button Click
    document.getElementById('contact-btn')?.addEventListener('click', function() {
        alert('Contact functionality will be available soon. Please check back later!');
    });
});
