const { createClient } = window.supabase;
const _supabase = createClient('https://hghgifkleqhdeqpoqjln.supabase.co', 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd');

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

// --- State Management ---
let newsData = { topic: "", subtopic: "", paragraphs: [], bullet_points: [] };
let pIndex = 0;          // Current paragraph index
let bIndex = 0;          // Current bullet index
let sIndex = 0;          // Social index
let opacity = 0;         // For Fade In/Out
let fadeDir = 1;         // 1 for Fade In, -1 for Fade Out
let bulletX = 1280;      // Start bullet from right

const socialItems = ["FOLLOW US", "LIKE", "SHARE", "COMMENT", "SUBSCRIBE"];

// --- 1. Fetch Data ---
async function updateNews() {
    const { data } = await _supabase.from('news_items').select('*').eq('is_active', true).limit(1).single();
    if (data) {
        newsData = data;
        pIndex = 0; bIndex = 0;
    }
}

// --- 2. Timing Engines ---
// Change paragraph every 5 seconds (includes fade time)
setInterval(() => {
    fadeDir = -1; // Start fade out
    setTimeout(() => {
        pIndex = (pIndex + 1) % (newsData.paragraphs?.length || 1);
        fadeDir = 1; // Start fade in
    }, 1000);
}, 5000);

// Change Social Icon every 3 seconds
setInterval(() => {
    sIndex = (sIndex + 1) % socialItems.length;
}, 3000);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // A. STUDIO BACKGROUND
    const bg = ctx.createLinearGradient(0, 0, 1280, 720);
    bg.addColorStop(0, "#050505");
    bg.addColorStop(0.5, "#1a1a2e");
    bg.addColorStop(1, "#050505");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // B. TOP RIGHT DIGITAL CLOCK
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 28px 'Courier New'";
    ctx.fillText(new Date().toLocaleTimeString('en-GB'), 1100, 50);

    // --- C. LEFT SIDE: PICTURE FRAME ---
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 80, 400, 300);
    // Placeholder for Image
    ctx.fillStyle = "#222";
    ctx.fillRect(42, 82, 396, 296);
    // Overlay Text
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(40, 320, 400, 60);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("AUTHOR: ABEL & SELAM", 60, 345);
    ctx.fillText("SOURCE: INTERNAL BROADCAST", 60, 365);

    // --- D. LEFT SIDE: SOCIAL ENGAGEMENT (Below Picture) ---
    ctx.strokeStyle = "#38bdf8";
    ctx.strokeRect(40, 400, 400, 100);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(socialItems[sIndex], 240, 460); // Carousel of text/icons
    ctx.textAlign = "left";

    // --- E. RIGHT SIDE: MAIN NEWS WINDOW ---
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(480, 80, 760, 420);
    
    // Topic Header inside Window
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(newsData.topic || "LOADING...", 500, 130);

    // Paragraph Carousel (Fade Logic)
    if (fadeDir === 1 && opacity < 1) opacity += 0.02;
    if (fadeDir === -1 && opacity > 0) opacity -= 0.02;
    
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#eee";
    ctx.font = "22px sans-serif";
    if (newsData.paragraphs && newsData.paragraphs[pIndex]) {
        wrapText(ctx, newsData.paragraphs[pIndex], 500, 180, 700, 32);
    }
    ctx.globalAlpha = 1.0;

    // --- F. NEWS WINDOW FOOTER: BULLET CAROUSEL (EXIT TO BOTTOM) ---
    ctx.save();
    ctx.beginPath(); ctx.rect(480, 500, 760, 100); ctx.clip(); // Mask for footer
    
    ctx.fillStyle = "#FFD700";
    ctx.font = "italic 20px sans-serif";
    
    // Carousel Logic: Right to Left
    bulletX -= 3; 
    if (bulletX < 480) { // When it hits left, drop to bottom
        bulletX = 1280; 
        bIndex = (bIndex + 1) % (newsData.bullet_points?.length || 1);
    }
    
    if (newsData.bullet_points && newsData.bullet_points[bIndex]) {
        ctx.fillText("• " + newsData.bullet_points[bIndex], bulletX, 560);
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

// Init
updateNews();
setInterval(updateNews, 10000);
render();
