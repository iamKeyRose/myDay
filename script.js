const { createClient } = window.supabase;
const _supabase = createClient('https://hghgifkleqhdeqpoqjln.supabase.co', 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd');

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

// --- Global States ---
let newsData = null;
let pIndex = 0;          
let sIndex = 0;          
let opacity = 0;         
let fadeDir = 1;         
let bulletX = 1280;      
let bIndex = 0;

const socialItems = [
    { label: "SUBSCRIBE", color: "#FF0000", brand: "YouTube" },
    { label: "FOLLOW US", color: "#1877F2", brand: "Facebook" },
    { label: "LIKE & SHARE", color: "#E4405F", brand: "Instagram" }
];

async function updateNews() {
    const { data } = await _supabase.from('news_items').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1).single();
    if (data && (!newsData || newsData.id !== data.id)) {
        newsData = data;
        pIndex = 0;
        bIndex = 0;
    }
}

// Paragraph Switcher (6 seconds total: 1s fade in, 4s read, 1s fade out)
setInterval(() => {
    if (!newsData || !newsData.paragraphs) return;
    fadeDir = -1; 
    setTimeout(() => {
        pIndex = (pIndex + 1) % newsData.paragraphs.length;
        fadeDir = 1; 
    }, 1000);
}, 6000);

setInterval(() => { sIndex = (sIndex + 1) % socialItems.length; }, 4000);

function drawSocialIcon(x, y, type) {
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    
    if (type === "YouTube") {
        ctx.fillStyle = "#FF0000";
        ctx.beginPath(); ctx.roundRect(x, y, 50, 35, 8); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.moveTo(x + 20, y + 10); ctx.lineTo(x + 35, y + 17.5); ctx.lineTo(x + 20, y + 25); ctx.fill();
    } else if (type === "Facebook") {
        ctx.fillStyle = "#1877F2";
        ctx.beginPath(); ctx.roundRect(x, y, 40, 40, 8); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 30px Arial"; ctx.fillText("f", x + 15, y + 30);
    } else {
        ctx.fillStyle = "#E4405F";
        ctx.beginPath(); ctx.roundRect(x, y, 40, 40, 10); ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.strokeRect(x+8, y+8, 24, 24);
        ctx.beginPath(); ctx.arc(x+20, y+20, 5, 0, Math.PI*2); ctx.stroke();
    }
    ctx.restore();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!newsData) { 
        updateNews(); 
        requestAnimationFrame(render); 
        return; 
    }

    // 1. BACKGROUND (High-End Mesh Gradient)
    const bg = ctx.createLinearGradient(0, 0, 1280, 720);
    bg.addColorStop(0, "#020617");
    bg.addColorStop(0.5, "#0f172a");
    bg.addColorStop(1, "#020617");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. TOP BROADCAST BAR (HEADER)
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, 1280, 85);
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(0, 82, 1280, 3); // Gold Accent Line

    // Branding & Topic
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 40px 'Segoe UI'";
    ctx.fillText("የእኔ ዜና", 40, 55);
    
    ctx.fillStyle = "#fff";
    ctx.font = "22px 'Segoe UI'";
    ctx.fillText("|  " + newsData.topic.toUpperCase(), 210, 53);

    // Clock (Top Right)
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 26px 'Courier New'";
    ctx.textAlign = "right";
    ctx.fillText(new Date().toLocaleTimeString('en-GB'), 1240, 55);
    ctx.textAlign = "left";

    // 3. LEFT COLUMN: MEDIA FRAME (The "Picture")
    // Outer Border Glow
    ctx.shadowBlur = 20; ctx.shadowColor = "rgba(255, 215, 0, 0.3)";
    ctx.strokeStyle = "#FFD700"; ctx.lineWidth = 2;
    ctx.strokeRect(40, 120, 420, 260);
    ctx.shadowBlur = 0;

    // Picture Placeholder
    ctx.fillStyle = "#000"; ctx.fillRect(42, 122, 416, 256);
    
    // Author & Source Overlay
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(40, 330, 420, 50);
    ctx.fillStyle = "#38bdf8"; ctx.font = "bold 14px sans-serif";
    ctx.fillText("AUTHOR: ABEL & SELAM", 60, 355);
    ctx.fillStyle = "#fff"; ctx.font = "12px sans-serif";
    ctx.fillText("SOURCE: GLOBAL NEWS FEED • LIVE SATELLITE", 60, 372);

    // 4. LEFT COLUMN: SOCIAL ENGAGEMENT
    const social = socialItems[sIndex];
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath(); ctx.roundRect(40, 400, 420, 100, 10); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.stroke();

    drawSocialIcon(70, 430, social.brand);
    ctx.fillStyle = "#fff"; ctx.font = "bold 24px 'Segoe UI'";
    ctx.fillText(social.label, 140, 458);

    // 5. MAIN NEWS WINDOW (PARAGRAPH CAROUSEL)
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.beginPath(); ctx.roundRect(490, 120, 750, 460, 15); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.stroke();

    // Paragraph Content
    if (fadeDir === 1 && opacity < 1) opacity += 0.02;
    if (fadeDir === -1 && opacity > 0) opacity -= 0.02;

    ctx.save();
    ctx.globalAlpha = Math.max(0, opacity);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "26px 'Segoe UI'";
    if (newsData.paragraphs && newsData.paragraphs[pIndex]) {
        wrapText(ctx, newsData.paragraphs[pIndex], 520, 180, 690, 38);
    }
    ctx.restore();

    // 6. NEWS FOOTER: BULLET CAROUSEL (SLOW & SMOOTH)
    ctx.save();
    ctx.beginPath(); ctx.rect(490, 590, 750, 90); ctx.clip();
    
    ctx.fillStyle = "rgba(255, 215, 0, 0.1)";
    ctx.beginPath(); ctx.roundRect(490, 590, 750, 90, 10); ctx.fill();
    
    ctx.fillStyle = "#FFD700";
    ctx.font = "italic 22px 'Segoe UI'";
    
    bulletX -= 2; // Very slow, professional speed
    if (bulletX < 0) { 
        bulletX = 1280;
        bIndex = (bIndex + 1) % (newsData.bullet_points?.length || 1);
    }
    
    if (newsData.bullet_points && newsData.bullet_points[bIndex]) {
        ctx.fillText("✦  " + newsData.bullet_points[bIndex], bulletX, 645);
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
setInterval(updateNews, 15000);
render();
