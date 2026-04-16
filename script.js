/**
 * Updates the real-time clock and date display
 */
function updateClock() {
    const now = new Date();
    
    // Formatting time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Formatting date for Amharic locale
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = now.toLocaleDateString('am-ET', options);
    
    // Injecting into HTML
    document.getElementById('real-time').textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById('real-date').textContent = dateStr;
}

// Update every second
setInterval(updateClock, 1000);

// Run immediately on load
updateClock();
