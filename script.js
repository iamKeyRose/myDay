/**
 * THE ENGINE: Maps data to the UI and sets animation delays
 */
function updateEngine() {
    const savedData = localStorage.getItem('newsData');
    if (!savedData) return;

    const data = JSON.parse(savedData);

    // 1. Update Main Topic
    const mainTopic = document.querySelector('.main-topic');
    if(data.topic && mainTopic) mainTopic.textContent = data.topic;

    // 2. Update News Paragraphs
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

    // 3. Update Highlights
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

    // 4. Update Images
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

    // 5. Update Social Engagement (Pill Contents)
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
 * LIVE LISTENER & CLOCK
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
