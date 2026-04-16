const { createClient } = window.supabase;
const _supabase = createClient('https://hghgifkleqhdeqpoqjln.supabase.co', 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd');

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

let newsData = null;
let pIndex = 0;          
let sIndex = 0;          
let opacity = 0;         
let fadeDir = 1;         
let bulletX = 1280;      
let bIndex = 0;

const socialItems = [
    { label: "SUBSCRIBE", color: "#FF0000", icon: "YT" },
    { label: "FOLLOW US", color: "#1877F2", icon: "FB" },
    { label: "LIKE & SHARE", color: "#1DA1F2", icon: "TW" }
];

async function updateNews() {
    const { data } = await _supabase.from('news_items').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1).single();
    if (data) {
        if (!newsData || newsData.id !== data.id) {
            newsData = data;
            pIndex = 0;
            bIndex = 0;
        }
    }
}

// Paragraph Carousel Logic (5 Seconds per paragraph)
setInterval(() => {
    if (!newsData || !newsData.paragraphs) return;
    fadeDir = -1; 
    setTimeout(() => {
        pIndex = (pIndex + 1) % newsData.paragraphs.length;
        fadeDir = 1; 
    }, 1000);
}, 6000);

setInterval(() => { sIndex = (sIndex + 1) % socialItems.length; }, 4000);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!newsData) { requestAnimationFrame(render); return; }

    // --- 1. THE STUDIO BACKGROUND ---
    const bg = ctx.createLinearGradient(0, 0, 0, 720);
    bg.addColorStop(0, "#020617");
    bg.addColorStop(1, "#0f172a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- 2. THE TOP HEADER BAR (Topic, Subtopic, Clock) ---
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, 1280, 70);
    
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 32px 'Segoe UI'";
    ctx.fillText(newsData.topic.toUpperCase(), 40, 45);
    
    ctx.fillStyle = "#38bdf8";
    ctx.font = "20px 'Segoe UI'";
    ctx.fillText(newsData.subtopic || "", 42, 65);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px 'Courier New'";
    ctx.textAlign = "right";
    ctx.fillText(new Date().toLocaleTimeString('en-GB'), 1240, 45);
    ctx.textAlign = "left";

    // --- 3. LEFT COLUMN: PICTURE FRAME ---
    // Outer Frame
    ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 100, 400, 260);
    // Inner Glow
    ctx.fillStyle = "#000";
    ctx.fillRect(45, 105, 390, 250);
    // Overlay Text (Professional Bar)
    ctx.fillStyle = "rgba(255, 215, 0, 0.9)";
    ctx.fillRect(40, 320, 400, 40);
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`AUTHOR: ${newsData.author_id || "STUDIO A"} | SOURCE: GLOBAL`, 55, 345);

    // --- 4. LEFT COLUMN: SOCIAL ENGAGEMENT (WITH ICONS) ---
    const social = socialItems[sIndex];
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(40, 380, 400, 80);
    ctx.strokeStyle = social.color;
    ctx.strokeRect(40, 380, 400, 80);

    // Draw "Icon" Circle
    ctx.fillStyle = social.color;
    ctx.beginPath(); ctx.arc(80, 420, 25, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(social.icon, 80, 427);
    
    ctx.textAlign = "left";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(social.label, 120, 428);

    // --- 5. MAIN NEWS WINDOW (PARAGRAPH CAROUSEL) ---
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.strokeRect(480, 100, 760, 450);
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(480, 100, 760, 450);

    // Fade logic
    if (fadeDir === 1 && opacity < 1) opacity += 0.02;
    if (fadeDir === -1 && opacity > 0) opacity -= 0.02;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#fff";
    ctx.font = "24px 'Segoe UI'";
    if (newsData.paragraphs && newsData.paragraphs[pIndex]) {
        wrapText(ctx, newsData.paragraphs[pIndex], 510, 160, 700, 36);
    }
    ctx.restore();

    // --- 6. FOOTER: BULLET CAROUSEL (SLOW & SMOOTH) ---
    ctx.save();
    ctx.beginPath(); ctx.rect(480, 560, 760, 100); ctx.clip();
    
    ctx.fillStyle = "rgba(56, 189, 248, 0.1)";
    ctx.fillRect(480, 560, 760, 100);
    
    ctx.fillStyle = "#FFD700";
    ctx.font = "italic 22px 'Segoe UI'";
    
    bulletX -= 2.5; // SLOWER speed
    if (bulletX < 200) { // Exit logic
        bulletX = 1280;
        bIndex = (bIndex + 1) % (newsData.bullet_points?.length || 1);
    }
    
    if (newsData.bullet_points && newsData.bullet_points[bIndex]) {
        ctx.fillText("▶ " + newsData.bullet_points[bIndex], bulletX, 615);
    }
    ctx.restore();

    requestAnimationFrame(render);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        if (context.measureText(testLine).width > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else { line = testLine; }
    }
    context.fillText(line, x, y);
}

updateNews();
setInterval(updateNews, 10000);
render();
