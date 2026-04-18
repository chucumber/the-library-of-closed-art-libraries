document.addEventListener('DOMContentLoaded', () => {

    // Select all blocks
    const items = document.querySelectorAll('.content-wrapper');

    items.forEach(item => {
        // Generate a random number between -3 and 3
        const randomTilt = (Math.random() * 6 - 3).toFixed(2);
        
        // Apply it as a CSS variable or direct style
        // We use a variable so it doesn't interfere with our hover/pop transforms
        item.style.setProperty('--random-tilt', `${randomTilt}deg`);
    });





    
    let currentlyPopped = null;

    document.querySelectorAll('.gallery-block').forEach(block => {
        const wrapper = block.querySelector('.content-wrapper');

        block.addEventListener('click', (e) => {
            // Stop propagation so clicking the block doesn't immediately 
            // trigger the "close" listener on the window
            e.stopPropagation(); 

            if (!wrapper.classList.contains('is-popped')) {
                e.preventDefault();
                // Close any already open popup before opening a new one
                if (currentlyPopped) closePop();
                openPop(wrapper);
            }
        });
    });

    function openPop(element) {
        element.classList.add('is-popped');
        currentlyPopped = element;
        document.body.style.overflow = 'hidden';
    }

    function closePop() {
        if (currentlyPopped) {
            currentlyPopped.classList.remove('is-popped');
            currentlyPopped = null;
            document.body.style.overflow = '';
        }
    }

    // Global listener: Close if clicking anywhere outside the active popup
    window.addEventListener('click', (e) => {
        if (currentlyPopped) {
            // Check if the click target is NOT the popped element and NOT inside it
            if (!currentlyPopped.contains(e.target)) {
                closePop();
            }
        }
    });

    // Also close on 'Escape' key for better UX
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePop();
    });
});