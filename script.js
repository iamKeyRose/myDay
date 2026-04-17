const { createClient } = window.supabase;
const _supabase = createClient('https://hghgifkleqhdeqpoqjln.supabase.co', 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd');

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

// --- Global States ---
let newsData = null;
let pIndex = 0;          
let bIndex = 0;          
let sIndex = 0;          
let pOpacity = 0;        
let pFadeDir = 1;        
let bOpacity = 0;        
let bX = 1280;           
let bState = "moving";   

const socialItems = ["FOLLOW US", "LIKE & SHARE", "SUBSCRIBE"];

async function updateNews() {
    const { data } = await _supabase.from('news_items').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1).single();
    if (data && (!newsData || newsData.id !== data.id)) {
        newsData = data;
        pIndex = 0; bIndex = 0;
    }
}

// Timing: 7 Seconds Stay + 1.5s Fade
setInterval(() => {
    if (!newsData || !newsData.paragraphs) return;
    pFadeDir = -1; 
    setTimeout(() => {
        pIndex = (pIndex + 1) % newsData.paragraphs.length;
        pFadeDir = 1; 
    }, 1500);
}, 8500);

setInterval(() => { sIndex = (sIndex + 1) % socialItems.length; }, 4000);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!newsData) { updateNews(); requestAnimationFrame(render); return; }

    // 1. STUDIO BACKGROUND
    const bg = ctx.createLinearGradient(0, 0, 0, 720);
    bg.addColorStop(0, "#020617");
    bg.addColorStop(1, "#0f172a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. DIGITAL CLOCK (Top Right - Floating)
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 24px 'Courier New'";
    ctx.textAlign = "right";
    ctx.fillText(new Date().toLocaleTimeString('en-GB'), 1240, 50);
    ctx.textAlign = "left";

    // --- 3. BRANDING (Top Left - Floating above Picture) ---
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 55px 'Segoe UI'";
    ctx.fillText("የእኔ ዜና", 50, 80);
    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 16px 'Segoe UI'";
    ctx.fillText("እውነተኛ መረጃ ለሁላችንም!", 52, 105);

    // --- 4. PICTURE FRAME (Left Side) ---
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 130, 380, 240);
    ctx.fillStyle = "#000";
    ctx.fillRect(52, 132, 376, 316);
    
    // Author/Source Overlay
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(50, 320, 380, 50);
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 13px Arial";
    ctx.fillText(`PRODUCER: ${newsData.author_id || "STUDIO 1"}`, 65, 340);
    ctx.fillStyle = "#fff";
    ctx.font = "11px Arial";
    ctx.fillText("SOURCE: SATELLITE FEED • LIVE", 65, 355);

    // --- 5. SOCIAL ENGAGEMENT (Bottom of Picture) ---
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(50, 390, 380, 80);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.strokeRect(50, 390, 380, 80);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px 'Segoe UI'";
    ctx.textAlign = "center";
    ctx.fillText(socialItems[sIndex], 240, 440);
    ctx.textAlign = "left";

    // --- 6. NEWS SECTION (Right Side) ---
    const newsX = 460;
    const newsWidth = 780;

    // --- TOPIC & SUBTOPIC (CRITICAL: OUTSIDE THE FRAME) ---
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 42px 'Segoe UI'";
    ctx.fillText(newsData.topic.toUpperCase(), newsX, 80); // Placed at Y:80 (Above the Y:130 Frame)
    ctx.fillStyle = "#00d4ff";
    ctx.font = "22px 'Segoe UI'";
    ctx.fillText(newsData.subtopic || "", newsX, 110);

    // THE NEWS WINDOW FRAME (Y starts at 130)
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(newsX, 130, newsWidth, 430);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.strokeRect(newsX, 130, newsWidth, 430);

    // CENTER JUSTIFIED PARAGRAPHS
    if (pFadeDir === 1 && pOpacity < 1) pOpacity += 0.015;
    if (pFadeDir === -1 && pOpacity > 0) pOpacity -= 0.015;

    ctx.save();
    ctx.globalAlpha = pOpacity;
    ctx.fillStyle = "#ffffff";
    ctx.font = "26px 'Segoe UI'";
    ctx.textAlign = "center"; 
    if (newsData.paragraphs && newsData.paragraphs[pIndex]) {
        wrapTextCentered(ctx, newsData.paragraphs[pIndex], newsX + (newsWidth/2), 240, 700, 38);
    }
    ctx.restore();

    // --- 7. THE BULLETIN (Center-Stop & Fade Out) ---
    const bY = 640;
    ctx.save();
    if (bState === "moving") {
        bX -= 4; // Approach speed
        if (bOpacity < 1) bOpacity += 0.04;
        if (bX <= 640) bState = "centered"; 
    } else if (bState === "centered") {
        // Stays here for 4 seconds
        if (!this.stopTimer) {
            this.stopTimer = setTimeout(() => { 
                bState = "exiting"; 
                this.stopTimer = null;
            }, 4000);
        }
    } else if (bState === "exiting") {
        bOpacity -= 0.02; // Fade out
        if (bOpacity <= 0) {
            bX = 1280; // Reset
            bIndex = (bIndex + 1) % (newsData.bullet_points?.length || 1);
            bState = "moving";
        }
    }

    ctx.globalAlpha = bOpacity;
    ctx.fillStyle = "#FFD700";
    ctx.font = "italic 24px 'Segoe UI'";
    ctx.textAlign = "center";
    if (newsData.bullet_points && newsData.bullet_points[bIndex]) {
        ctx.fillText("✦  " + newsData.bullet_points[bIndex] + "  ✦", bX, bY);
    }
    ctx.restore();

    requestAnimationFrame(render);
}

// Special Helper for Centered Wrapping
function wrapTextCentered(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        if (context.measureText(testLine).width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i].trim(), x, y + (i * lineHeight));
    }
}

updateNews();
setInterval(updateNews, 15000);
render();
