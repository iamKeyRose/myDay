\const { createClient } = window.supabase;
const _supabase = createClient('https://hghgifkleqhdeqpoqjln.supabase.co', 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd');

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

// --- Layout State ---
let newsData = null;
let pIndex = 0;          
let bIndex = 0;          
let sIndex = 0;          
let opacity = 0;         
let fadeDir = 1;         
let bulletX = 1280;      

const socialItems = ["FOLLOW US", "LIKE & SHARE", "COMMENT", "SUBSCRIBE"];

// --- 1. Fetching Logic ---
async function updateNews() {
    try {
        const { data, error } = await _supabase
            .from('news_items')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data && !error) {
            newsData = data;
        }
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

// --- 2. Animation Timers ---
// Switch Paragraph every 5 seconds
setInterval(() => {
    if (!newsData || !newsData.paragraphs) return;
    fadeDir = -1; // Start Fade Out
    setTimeout(() => {
        pIndex = (pIndex + 1) % newsData.paragraphs.length;
        fadeDir = 1; // Start Fade In
    }, 1000);
}, 5000);

// Switch Social Item every 3 seconds
setInterval(() => {
    sIndex = (sIndex + 1) % socialItems.length;
}, 3000);

// --- 3. Drawing Engine ---
function render() {
    // Basic Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Safety check: If no data yet, show loading screen
    if (!newsData) {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFD700";
        ctx.font = "30px sans-serif";
        ctx.fillText("Initializing Studio Broadcast...", 450, 360);
        requestAnimationFrame(render);
        return;
    }

    // A. STUDIO BACKGROUND
    const bg = ctx.createLinearGradient(0, 0, 1280, 720);
    bg.addColorStop(0, "#0a0a0f");
    bg.addColorStop(0.5, "#161b33");
    bg.addColorStop(1, "#0a0a0f");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // B. DIGITAL CLOCK (Top Right)
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 28px 'Courier New'";
    ctx.textAlign = "right";
    ctx.fillText(new Date().toLocaleTimeString('en-GB'), 1240, 50);
    ctx.textAlign = "left";

    // --- C. LEFT SIDE: PICTURE FRAME ---
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 80, 400, 280);
    ctx.fillStyle = "#000"; // Black screen for image
    ctx.fillRect(43, 83, 394, 274);
    
    // Author/Source Overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(40, 300, 400, 60);
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`AUTHOR: ${newsData.author_id || "NEWS ROOM"}`, 55, 325);
    ctx.fillStyle = "#fff";
    ctx.fillText("SOURCE: GLOBAL NEWS FEED", 55, 345);

    // --- D. LEFT SIDE: SOCIAL ENGAGEMENT FRAME ---
    ctx.strokeStyle = "#38bdf8";
    ctx.strokeRect(40, 380, 400, 100);
    ctx.fillStyle = "rgba(56, 189, 248, 0.1)";
    ctx.fillRect(40, 380, 400, 100);
    
    ctx.fillStyle = "#fff";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(socialItems[sIndex], 240, 440);
    ctx.textAlign = "left";

    // --- E. RIGHT SIDE: MAIN NEWS WINDOW ---
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(480, 80, 760, 400);
    
    // Window Title
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(newsData.topic.toUpperCase(), 510, 130);

    // Paragraph Carousel (Fade In/Out Logic)
    if (fadeDir === 1 && opacity < 1) opacity += 0.03;
    if (fadeDir === -1 && opacity > 0) opacity -= 0.03;
    
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
    ctx.fillStyle = "#ffffff";
    ctx.font = "22px sans-serif";
    if (newsData.paragraphs && newsData.paragraphs[pIndex]) {
        wrapText(ctx, newsData.paragraphs[pIndex], 510, 180, 700, 32);
    }
    ctx.restore();

    // --- F. BOTTOM NEWS WINDOW: BULLET CAROUSEL ---
    ctx.save();
    // Mask for the bullet carousel area
    ctx.beginPath();
    ctx.rect(480, 480, 760, 80);
    ctx.clip();
    
    ctx.fillStyle = "rgba(255, 215, 0, 0.1)";
    ctx.fillRect(480, 480, 760, 80);
    
    ctx.fillStyle = "#FFD700";
    ctx.font = "italic 22px sans-serif";
    
    // Move from Right to Left
    bulletX -= 4; 
    if (bulletX < 400) { // Exit logic
        bulletX = 1280;
        bIndex = (bIndex + 1) % (newsData.bullet_points?.length || 1);
    }
    
    if (newsData.bullet_points && newsData.bullet_points[bIndex]) {
        ctx.fillText("▶ " + newsData.bullet_points[bIndex], bulletX, 530);
    }
    ctx.restore();

    requestAnimationFrame(render);
}

// Text Wrapper Helper
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

// Launch
updateNews();
setInterval(updateNews, 10000); 
render();
