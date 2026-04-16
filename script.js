\const { createClient } = window.supabase;
const _supabase = createClient('https://hghgifkleqhdeqpoqjln.supabase.co', 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd');

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

// State Management
let newsData = { topic: "በመጠበቅ ላይ...", subtopic: "", paragraphs: [], bullet_points: [] };
let scrollY = 0;
let scanlineY = 0;

// Config
const LOGO_TEXT = "የእኔ";
const SLOGAN = "እውነተኛ መረጃ ለሁላችንም!";

async function updateNews() {
    const { data, error } = await _supabase
        .from('news_items')
        .select('topic, subtopic, paragraphs, bullet_points')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1).single();

    if (data && !error) {
        if (newsData.topic !== data.topic) scrollY = 0; // Reset scroll for new news
        newsData = data;
        const ticker = document.getElementById('ticker-text');
        if(ticker) ticker.innerText = `ሰበር ዜና: ${data.topic} — ${data.subtopic} — `;
    }
}

function drawAtmosphere() {
    // 1. Radial Background
    const grad = ctx.createRadialGradient(640, 360, 50, 640, 360, 800);
    grad.addColorStop(0, "#1c1e2e");
    grad.addColorStop(1, "#0a0a0f");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Animated Scanline
    scanlineY = (scanlineY + 1.5) % canvas.height;
    ctx.strokeStyle = "rgba(255, 215, 0, 0.05)";
    ctx.beginPath();
    ctx.moveTo(0, scanlineY);
    ctx.lineTo(canvas.width, scanlineY);
    ctx.stroke();

    // 3. Tech Corner Accents
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 2;
    // Top Left
    ctx.strokeRect(10, 10, 50, 50);
    // Bottom Right
    ctx.strokeRect(canvas.width - 60, canvas.height - 60, 50, 50);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAtmosphere();

    // --- 1. HEADER & BRANDING ZONE ---
    
    // Logo Group (Left Side)
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 60px 'Segoe UI'";
    ctx.fillText(LOGO_TEXT, 40, 85);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px 'Segoe UI'";
    ctx.fillText(SLOGAN, 40, 110);

    // Live Icon (Bottom of Logo)
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(48, 135, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px 'Segoe UI'";
    ctx.fillText("LIVE", 62, 140);

    // Topic & Subtopic (Right of Logo)
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 48px 'Segoe UI'";
    ctx.fillText(newsData.topic, 240, 85);

    ctx.fillStyle = "#00d4ff";
    ctx.font = "22px 'Segoe UI'";
    ctx.fillText(newsData.subtopic || "", 240, 120);

    // Digital Clock (Top Right)
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "30px 'Courier New'";
    const timeStr = new Date().toLocaleTimeString('en-GB');
    ctx.fillText(timeStr, canvas.width - 180, 75);


    // --- 2. CONTENT SPLIT ---

    // LEFT COLUMN: Narrative (10 Paragraphs with Auto-Scroll)
    ctx.save();
    ctx.beginPath();
    ctx.rect(40, 180, 600, 500); // Clipping mask area
    ctx.clip();

    ctx.fillStyle = "#ffffff";
    ctx.font = "21px 'Segoe UI'";
    let currentY = 220 - scrollY;

    if (newsData.paragraphs) {
        newsData.paragraphs.forEach(p => {
            currentY = wrapText(ctx, p, 50, currentY, 550, 30) + 25;
        });
    }
    
    // Increment scroll
    scrollY += 0.5;
    if (scrollY > currentY + 100) scrollY = -400; // Reset scroll loop
    ctx.restore();


    // RIGHT COLUMN: Highlights (Glass-morphism Box)
    ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
    ctx.fillRect(680, 180, 560, 500);
    ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
    ctx.strokeRect(680, 180, 560, 500);

    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 22px 'Segoe UI'";
    ctx.fillText("ቁልፍ መረጃዎች (Key Highlights)", 710, 220);

    ctx.fillStyle = "#ffffff";
    ctx.font = "18px 'Segoe UI'";
    let bulletY = 265;
    if (newsData.bullet_points) {
        newsData.bullet_points.slice(0, 13).forEach(b => {
            ctx.fillStyle = "#FFD700";
            ctx.fillText("✦", 710, bulletY);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(b, 740, bulletY);
            bulletY += 33;
        });
    }

    requestAnimationFrame(render);
}

// Wrap Text Helper
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
    return y + lineHeight;
}

// Initializers
setInterval(updateNews, 5000);
updateNews();
render();
