function updateEngine() {
    const savedData = localStorage.getItem('newsData');
    if (!savedData) return;
    const data = JSON.parse(savedData);

    // 1. Topics (RESTORED SUB-TOPIC LOGIC)
    const mainTopic = document.querySelector('.main-topic');
    const subTopic = document.querySelector('.sub-topic');
    if(data.topic && mainTopic) mainTopic.textContent = data.topic;
    if(data.subtopic && subTopic) subTopic.textContent = data.subtopic;

    // 2. News
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

    // 3. Highlights
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

    // 4. Media
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

    // 5. Social Engagement
    const socialContainer = document.getElementById('social-container');
    if (socialContainer) {
        socialContainer.innerHTML = '';
        const socials = (data.socials && data.socials.length > 0) ? data.socials : ["የእኔ ቀን", "Like & Subscribe", "Follow Us"];
        socials.forEach((s, index) => {
            const div = document.createElement('div');
            div.className = 's-icon-group';
            div.style.animationDelay = (index * 5) + 's';
            div.innerHTML = `<span>${s}</span>`;
            socialContainer.appendChild(div);
        });
    }
}

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
