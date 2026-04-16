<!DOCTYPE html>
<html lang="am">
<head>
<meta charset="UTF-8">
<style>
:root {
    --myday-gold: #FFD700;
    --myday-blue: #002B5B;
    --live-red: #ff0000;
    --cycle-speed: 12s;
    --social-speed: 15s;
}

* { box-sizing: border-box; }

body, html { 
    margin: 0; padding: 0; width: 100%; height: 100%; 
    background: #000; overflow: hidden; 
    display: flex; justify-content: center; align-items: center; 
    font-family: 'Nyala', 'Inter', sans-serif; 
}

.broadcast-outer-frame {
    width: 100vw; height: 100vh;
    padding: 30px; 
    background: #000;
    display: flex; justify-content: center; align-items: center;
}

.broadcast-container {
    width: 100%; height: 100%;
    background: #050505; color: white;
    display: grid;
    grid-template-areas: 
        "brand topics topics"
        "media news news"
        "social highlights highlights";
    grid-template-columns: 32% 1fr 1fr;
    grid-template-rows: 22% 1fr 15%; /* Adjusted for brand space */
    border: 3px solid #333;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(0,0,0,1);
}

/* --- BRANDING (LOGO, CHANNEL NAME, SLOGAN) --- */
.brand-frame { 
    grid-area: brand; background: #000; 
    display: flex; align-items: center; justify-content: flex-start;
    padding-left: 5%;
    border-bottom: 4px solid var(--myday-gold); border-right: 1px solid #333; 
}
.logo-box { display: flex; flex-direction: column; align-items: center; }
.logo { 
    width: 4.5vw; height: 4.5vw; background: var(--myday-gold); color: black; 
    display: flex; align-items: center; justify-content: center; 
    font-weight: 900; font-size: 1.8vw; border-radius: 10px; 
}
.live-indicator { 
    margin-top: 5px; background: var(--live-red); color: white; 
    padding: 1px 8px; border-radius: 3px; font-size: 0.6vw; 
    font-weight: bold; animation: pulseRed 1.5s infinite; letter-spacing: 1px;
}
.channel-info { margin-left: 1.5vw; }
.channel-name { font-size: 1.8vw; font-weight: 900; color: white; line-height: 1; }
.slogan { font-size: 0.9vw; color: var(--myday-gold); font-weight: 400; margin-top: 5px; letter-spacing: 1px; }

/* --- TOPICS & REAL-TIME CLOCK --- */
.topics-frame { 
    grid-area: topics; background: var(--myday-blue); 
    display: flex; align-items: center; justify-content: space-between; 
    padding: 0 5%; border-bottom: 4px solid var(--myday-gold); 
}
.topics-text { display: flex; flex-direction: column; }
.main-topic { font-size: 2.8vw; margin: 0; }
.sub-topic { font-size: 1vw; color: var(--myday-gold); margin: 0; font-style: italic; }

.live-time-box {
    background: rgba(0,0,0,0.3); padding: 10px 20px; border-radius: 8px;
    border-left: 3px solid var(--myday-gold); text-align: right;
}
#real-time { font-size: 2vw; font-weight: 900; font-family: 'Courier New', monospace; color: var(--myday-gold); }
#real-date { font-size: 0.8vw; color: white; opacity: 0.8; }

/* --- MEDIA, NEWS, SOCIAL (As per original) --- */
.media-frame { grid-area: media; position: relative; background: #111; overflow: hidden; border-right: 1px solid #333; }
.slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; animation: zoomFade 20s infinite; }
.news-frame { grid-area: news; display: flex; align-items: center; justify-content: center; position: relative; padding: 2vw; }
.p-item { position: absolute; opacity: 0; font-size: 2.2vw; text-align: center; width: 85%; animation: feedInOut var(--cycle-speed) infinite; line-height: 1.4; }

.social-frame { 
    grid-area: social; background: var(--live-red); 
    display: flex; align-items: center; justify-content: center; 
    position: relative; border-top: 1px solid rgba(255,255,255,0.2);
}
.s-icon-group { 
    position: absolute; display: flex; align-items: center; gap: 15px;
    color: white; font-size: 1.5vw; font-weight: bold;
    opacity: 0; transform: translateY(20px);
    animation: turnByTurn var(--social-speed) infinite;
}
.s-icon-group:nth-child(2) { animation-delay: 3s; }
.s-icon-group:nth-child(3) { animation-delay: 6s; }
.s-icon-group:nth-child(4) { animation-delay: 9s; }
.s-icon-group:nth-child(5) { animation-delay: 12s; }
.s-icon-group svg { width: 3vw; height: 3vw; fill: white; }

.highlights-frame { grid-area: highlights; background: #000; border-top: 4px solid var(--myday-gold); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.h-item { position: absolute; opacity: 0; font-size: 1.8vw; color: var(--myday-gold); animation: slideRightDown 10s infinite; }

/* --- ANIMATIONS --- */
@keyframes turnByTurn { 0% { opacity: 0; transform: translateY(20px); } 5% { opacity: 1; transform: translateY(0); } 15% { opacity: 1; transform: translateY(0); } 20% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 0; } }
@keyframes pulseRed { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes zoomFade { 0% { opacity: 0; transform: scale(1.1); } 5%, 45% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes feedInOut { 0%, 5% { opacity: 0; } 10%, 45% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes slideRightDown { 0%, 5% { opacity: 0; transform: translateX(30vw); } 10%, 45% { opacity: 1; transform: translateX(0); } 50%, 100% { opacity: 0; } }

</style>
</head>
<body>

<div class="broadcast-outer-frame">
    <div class="broadcast-container">
        
        <div class="brand-frame">
            <div class="logo-box">
                <div class="logo">የእኔ</div>
                <div class="live-indicator">LIVE</div>
            </div>
            <div class="channel-info">
                <div class="channel-name">የእኔ ቀን ዜና</div>
                <div class="slogan">እውነተኛ መረጃ ለሁላችንም!</div>
            </div>
        </div>

        <div class="topics-frame">
            <div class="topics-text">
                <h1 class="main-topic">የኢቶሪካ ነጻነት</h1>
                <p class="sub-topic">የጥበብ ነጻነት የታየበት ታሪካዊ ምዕራፍ</p>
            </div>
            <div class="live-time-box">
                <div id="real-time">00:00:00</div>
                <div id="real-date">Loading Date...</div>
            </div>
        </div>

        <div class="media-frame">
            <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1523810192022-5a0fb9aa7bc8?w=800');"></div>
            <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'); animation-delay: 10s;"></div>
        </div>

        <div class="news-frame">
            <div class="p-item" style="animation-delay: 0s;">ቴዲ አፍሮ ኢቶሪካን በራሱ መልቀቁ በሙዚቃ ኢንዱስትሪው ውስጥ ትልቅ ለውጥ አምጥቷል።</div>
            <div class="p-item" style="animation-delay: 6s;">ለሰዋሰው መልቲሚዲያ የተመለሰው 33 ሚሊዮን ብር የጥበብ ነጻነትን የማረጋገጥ እርምጃ ነው።</div>
        </div>

        <div class="social-frame">
            <div class="s-icon-group">
                <svg viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                <span>Like</span>
            </div>
            <div class="s-icon-group">
                <svg viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77.42-1.56.42-4.81.42-4.81s0-3.25-.42-4.81zM10 15V9l5.2 3L10 15z"/></svg>
                <span>Subscribe</span>
            </div>
            <div class="s-icon-group">
                <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                <span>Notify</span>
            </div>
        </div>

        <div class="highlights-frame">
            <div class="h-item">• 33 ሚሊዮን ብር ተመለሰ</div>
            <div class="h-item" style="animation-delay:5s;">• 100% የባለቤትነት መብት</div>
        </div>
    </div>
</div>

<script>
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const day = now.toLocaleDateString('am-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        document.getElementById('real-time').textContent = `${hours}:${minutes}:${seconds}`;
        document.getElementById('real-date').textContent = day;
    }
    setInterval(updateClock, 1000);
    updateClock();
</script>

</body>
</html>
