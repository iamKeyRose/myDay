/**
 * 1. THE ENGINE: Maps data to the UI and sets animation delays
 */
function updateEngine() {
    const savedData = localStorage.getItem('newsData');
    if (!savedData) return;

    const data = JSON.parse(savedData);

    // Update Topics
    const mainTopic = document.querySelector('.main-topic');
    if(data.topic && mainTopic) mainTopic.textContent = data.topic;

    // Update News Paragraphs (10 items)
    const newsContainer = document.getElementById('news-container');
    if (data.paragraphs && newsContainer) {
        newsContainer.innerHTML = ''; 
        data.paragraphs.forEach((p, index) => {
            const div = document.createElement('div');
            div.className = 'p-item';
            div.style.animationDelay = (index * 6) + 's'; 
            div.textContent = p;
            newsContainer.appendChild(div);
        });
    }

    // Update Highlights (20 items)
    const bulletContainer = document.getElementById('highlights-container');
    if (data.bullets && bulletContainer) {
        bulletContainer.innerHTML = '';
        data.bullets.forEach((b, index) => {
            const div = document.createElement('div');
            div.className = 'h-item';
            div.style.animationDelay = (index * 5) + 's';
            div.textContent = `• ${b}`;
            bulletContainer.appendChild(div);
        });
    }

    // Update Media (10 images)
    const mediaContainer = document.getElementById('media-container');
    if (data.images && mediaContainer) {
        mediaContainer.innerHTML = '';
        data.images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'slide';
            div.style.backgroundImage = `url('${img}')`;
            div.style.animationDelay = (index * 10) + 's';
            mediaContainer.appendChild(div);
        });
    }

    // NEW: Update Social Engagement (3 items)
    const socialContainer = document.getElementById('social-container');
    if (data.socials && socialContainer) {
        socialContainer.innerHTML = '';
        data.socials.forEach((s, index) => {
            const div = document.createElement('div');
            div.className = 's-icon-group';
            div.style.animationDelay = (index * 5) + 's';
            div.innerHTML = `<span>${s}</span>`;
            socialContainer.appendChild(div);
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
    if(timeEl) timeEl.textContent = now.toLocaleTimeString('am-ET', {hour12: false});
}

setInterval(updateClock, 1000);
updateClock();
updateEngine();
