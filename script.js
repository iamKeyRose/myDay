/**
 * 1. THE ENGINE: Maps data to the UI and sets animation delays
 */
function updateEngine() {
    const savedData = localStorage.getItem('newsData');
    if (!savedData) return;

    const data = JSON.parse(savedData);

    // Update Topics
    const mainTopic = document.querySelector('.main-topic');
    const subTopic = document.querySelector('.sub-topic');
    if(data.topic && mainTopic) mainTopic.textContent = data.topic;
    if(data.subtopic && subTopic) subTopic.textContent = data.subtopic;

    // Update News Paragraphs (10 items)
    const newsContainer = document.querySelector('.news-frame');
    if (data.paragraphs && newsContainer) {
        newsContainer.innerHTML = ''; 
        data.paragraphs.forEach((p, index) => {
            const div = document.createElement('div');
            div.className = 'p-item';
            // Each item waits 6s multiplied by its position
            div.style.animationDelay = (index * 6) + 's'; 
            div.textContent = p;
            newsContainer.appendChild(div);
        });
    }

    // Update Highlights (20 items)
    const bulletContainer = document.querySelector('.highlights-frame');
    if (data.bullets && bulletContainer) {
        bulletContainer.innerHTML = '';
        data.bullets.forEach((b, index) => {
            const div = document.createElement('div');
            div.className = 'h-item';
            // Each bullet waits 5s
            div.style.animationDelay = (index * 5) + 's';
            div.textContent = `• ${b}`;
            bulletContainer.appendChild(div);
        });
    }

    // Update Media (10 images)
    const mediaContainer = document.querySelector('.media-frame');
    if (data.images && mediaContainer) {
        mediaContainer.innerHTML = '';
        data.images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'slide';
            div.style.backgroundImage = `url('${img}')`;
            // Each image waits 10s
            div.style.animationDelay = (index * 10) + 's';
            mediaContainer.appendChild(div);
        });
    }
}

/**
 * 2. LIVE LISTENER & CLOCK
 */
window.addEventListener('storage', (e) => { if (e.key === 'newsData') updateEngine(); });

function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById('real-time');
    const dateEl = document.getElementById('real-date');
    if(timeEl) timeEl.textContent = now.toLocaleTimeString('am-ET', {hour12: false});
    if(dateEl) dateEl.textContent = now.toLocaleDateString('am-ET', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
}

setInterval(updateClock, 1000);
updateClock();
updateEngine();
