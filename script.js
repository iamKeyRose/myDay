/**
 * 1. The Engine: Receives data from Admin and updates the Studio
 */
function updateEngine() {
    const savedData = localStorage.getItem('newsData');
    if (!savedData) return;

    const data = JSON.parse(savedData);

    // Update Topic & Subtopic
    if(data.topic) document.querySelector('.main-topic').textContent = data.topic;
    if(data.subtopic) document.querySelector('.sub-topic').textContent = data.subtopic;

    // Update News Paragraphs (10 paragraphs support)
    const newsContainer = document.querySelector('.news-frame');
    if (data.paragraphs && data.paragraphs.length > 0) {
        newsContainer.innerHTML = ''; 
        data.paragraphs.forEach((p, index) => {
            const div = document.createElement('div');
            div.className = 'p-item';
            // Each paragraph shows for 6 seconds
            div.style.animationDelay = (index * 6) + 's'; 
            div.textContent = p;
            newsContainer.appendChild(div);
        });
    }

    // Update Highlights (20 bullets support)
    const bulletContainer = document.querySelector('.highlights-frame');
    if (data.bullets && data.bullets.length > 0) {
        bulletContainer.innerHTML = '';
        data.bullets.forEach((b, index) => {
            const div = document.createElement('div');
            div.className = 'h-item';
            // Each bullet shows for 5 seconds
            div.style.animationDelay = (index * 5) + 's';
            div.textContent = `• ${b}`;
            bulletContainer.appendChild(div);
        });
    }

    // Update Media (10 images support)
    const mediaContainer = document.querySelector('.media-frame');
    if (data.images && data.images.length > 0) {
        mediaContainer.innerHTML = '';
        data.images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'slide';
            div.style.backgroundImage = `url('${img}')`;
            // Each image shows for 10 seconds
            div.style.animationDelay = (index * 10) + 's';
            mediaContainer.appendChild(div);
        });
    }
}

/**
 * 2. The Listener: Updates the Studio immediately when you hit 'Publish'
 */
window.addEventListener('storage', (event) => {
    if (event.key === 'newsData') {
        updateEngine();
    }
});

/**
 * 3. The Clock: Updates time and date
 */
function updateClock() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = now.toLocaleDateString('am-ET', options);
    
    const timeEl = document.getElementById('real-time');
    const dateEl = document.getElementById('real-date');
    
    if(timeEl) timeEl.textContent = `${hours}:${minutes}:${seconds}`;
    if(dateEl) dateEl.textContent = dateStr;
}

// Initialization
setInterval(updateClock, 1000);
setInterval(updateEngine, 5000); // Backup check every 5 seconds
updateClock();
updateEngine();
