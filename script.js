const { createClient } = window.supabase;
const _supabase = createClient('https://hghgifkleqhdeqpoqjln.supabase.co', 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd');

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

// --- Global States ---
let newsData = null;
let pIndex = 0;          
let bIndex = 0;          
let sIndex = 0;          
let pOpacity = 0;        // Paragraph Opacity
let pFadeDir = 1;        // 1 = In, -1 = Out
let bOpacity = 0;        // Bulletin Opacity
let bX = 1280;           // Bulletin X position
let bState = "moving";   // moving, centered, exiting

const socialItems = ["FOLLOW US", "LIKE & SHARE", "SUBSCRIBE"];

// --- Data Fetching ---
async function updateNews() {
    const { data } = await _supabase.from('news_items').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1).single();
    if (data) {
        if (!newsData || newsData.id !== data.id) {
            newsData = data;
            pIndex = 0; bIndex = 0;
        }
    }
}

// --- Animation Timers ---
// Paragraph: 7 seconds per slide + Fade Out
setInterval(() => {
    if (!newsData || !newsData.paragraphs) return;
    pFadeDir = -1; 
    setTimeout(() => {
        pIndex = (pIndex + 1) % newsData.paragraphs.length;
        pFadeDir = 1; 
    }, 1500); // 1.5s transition
}, 8500); // 7s stay + 1.5s transition

// Social switch every 4s
setInterval(() => { sIndex = (sIndex + 1) % socialItems.length; }, 4000);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!newsData) { updateNews(); requestAnimationFrame(render); return; }

    // 1. BACKGROUND (Studio Grade)
    const bg = ctx.createLinearGradient(0, 0, 0, 720);
    bg.addColorStop(0, "#010409");
    bg.addColorStop(1, "#0d1117");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. CLOCK (Top Right)
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 24px 'Courier New'";
    ctx.fillText(new Date().toLocaleTimeString('en-GB'), 1120, 45);

    // --- 3. BRANDING STACK (Top Left) ---
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 50px 'Segoe UI'";
    ctx.fillText("የእኔ ዜና", 50, 70); // Channel Name / Logo
    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 16px 'Segoe UI'";
    ctx.fillText("እውነተኛ መረጃ ለሁላችንም!", 52, 95); // Slogan

    // --- 4. PICTURE FRAME (Below Branding) ---
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 120, 380, 240);
    ctx.fillStyle = "#000";
    ctx.fillRect(52, 122, 376, 236);
    
    // Author/Source Overlay
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(50, 310, 380, 50);
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 12px Arial";
    ctx.fillText(`PRODUCER: ${newsData.author_id || "STUDIO 1"}`, 65, 330);
    ctx.fillStyle = "#fff";
    ctx.fillText("SOURCE: LIVE FEED", 65, 345);

    // --- 5. SOCIAL ENGAGEMENT (Below Picture) ---
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(50, 380, 380, 80);
    ctx.strokeStyle = "#00d4ff";
    ctx.strokeRect(50, 380, 380, 80);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(socialItems[sIndex], 240, 430);
    ctx.textAlign = "left";

    // --- 6. NEWS WINDOW (Right Side) ---
    const newsX = 460;
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(newsX, 120, 770, 460);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.strokeRect(newsX, 120, 770, 460);

    // Topic & Subtopic AT TOP of News Window
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 36px 'Segoe UI'";
    ctx.fillText(newsData.topic.toUpperCase(), newsX + 30, 170);
    ctx.fillStyle = "#00d4ff";
    ctx.font = "20px 'Segoe UI'";
    ctx.fillText(newsData.subtopic || "", newsX + 32, 200);
    ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
    ctx.beginPath(); ctx.moveTo(newsX+30, 215); ctx.lineTo(newsX+740, 215); ctx.stroke();

    // Paragraph Carousel (7s Stay + Fade Out)
    if (pFadeDir === 1 && pOpacity < 1) pOpacity += 0.015;
    if (pFadeDir === -1 && pOpacity > 0) pOpacity -= 0.015;

    ctx.save();
    ctx.globalAlpha = pOpacity;
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px 'Segoe UI'";
    if (newsData.paragraphs && newsData.paragraphs[pIndex]) {
        wrapText(ctx, newsData.paragraphs[pIndex], newsX + 30, 260, 700, 36);
    }
    ctx.restore();

    // --- 7. BULLETIN TICKER (Center-Stop & Fade Out) ---
    // Positioned below Social (Left) and News (Right)
    const bY = 640;
    ctx.save();
    
    // Bullet Logic
    if (bState === "moving") {
        bX -= 2.5; 
        if (bOpacity < 1) bOpacity += 0.02;
        if (bX <= 640) bState = "centered"; // Center of canvas is 640
    } else if (bState === "centered") {
        // Stop at center for 4 seconds
        setTimeout(() => { bState = "exiting"; }, 4000);
    } else if (bState === "exiting") {
        bOpacity -= 0.015; // Fade out
        if (bOpacity <= 0) {
            bX = 1280; // Reset to right
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
    ctx.textAlign = "left";
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
