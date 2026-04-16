const { createClient } = window.supabase;
const _supabase = createClient('https://hghgifkleqhdeqpoqjln.supabase.co', 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd');

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

// --- State & Config ---
let newsData = { topic: "በመጠበቅ ላይ...", subtopic: "", paragraphs: [], bullet_points: [] };
let scrollY = 0; 
let scanlinePos = 0;
const LOGO_TEXT = "የእኔ";
const SLOGAN = "እውነተኛ መረጃ ለሁላችንም!";

// 1. Fetch the LIVE news
async function updateNews() {
    try {
        const { data, error } = await _supabase
            .from('news_items')
            .select('topic, subtopic, paragraphs, bullet_points')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data && !error) {
            // Reset scroll only if the topic actually changed
            if (newsData.topic !== data.topic) scrollY = 0;
            newsData = data;
            const ticker = document.getElementById('ticker-text');
            if(ticker) ticker.innerText = `ሰበር ዜና: ${data.topic} — ${data.subtopic} — `;
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

// 2. Atmosphere & Branding Stack
function drawUI() {
    // Deep Radial Background
    const bgGrad = ctx.createRadialGradient(640, 360, 50, 640, 360, 800);
    bgGrad.addColorStop(0, "#1c1e2e");
    bgGrad.addColorStop(1, "#0a0b12");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tech Scanline
    ctx.strokeStyle = "rgba(255, 215, 0, 0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, scanlinePos);
    ctx.lineTo(canvas.width, scanlinePos);
    ctx.stroke();
    scanlinePos = (scanlinePos + 1.5) % canvas.height;

    // --- Branding Zone (Left Side) ---
    // Channel Name
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 65px 'Segoe UI'";
    ctx.fillText(LOGO_TEXT, 45, 90);
    
    // Slogan
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px 'Segoe UI'";
    ctx.fillText(SLOGAN, 45, 115);

    // LIVE Icon
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(55, 140, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px 'Segoe UI'";
    ctx.fillText("LIVE", 70, 146);

    // --- Header Zone (Right of Logo) ---
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 48px 'Segoe UI'";
    ctx.fillText(newsData.topic, 250, 90);

    ctx.fillStyle = "#00d4ff";
    ctx.font = "24px 'Segoe UI'";
    ctx.fillText(newsData.subtopic || "", 250, 128);

    // Digital Clock (Top Right)
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "28px 'Courier New'";
    const timeStr = new Date().toLocaleTimeString('en-GB');
    ctx.fillText(timeStr, canvas.width - 180, 80);
}

// 3. The Main Render Engine
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawUI();

    // --- LEFT COLUMN: Scrolling Narrative ---
    ctx.save();
    // Clipping Mask to prevent text from overlapping the header
    ctx.beginPath();
    ctx.rect(40, 180, 600, 500); 
    ctx.clip();

    ctx.fillStyle = "#ffffff";
    ctx.font = "21px 'Segoe UI'";
    let currentY = 220 - scrollY;

    if (newsData.paragraphs) {
        newsData.paragraphs.forEach(para => {
            currentY = wrapText(ctx, para, 50, currentY, 550, 32) + 25;
        });
    }
    
    // Auto-scroll logic
    scrollY += 0.5; // Speed of scroll
    if (scrollY > currentY + 200) scrollY = -400; // Reset loop
    ctx.restore();

    // --- RIGHT COLUMN: Glass Highlights ---
    // Glass Box
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(680, 180, 560, 505);
    ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
    ctx.strokeRect(680, 180, 560, 505);

    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 24px 'Segoe UI'";
    ctx.fillText("ቁልፍ መረጃዎች (Key Highlights)", 710, 220);

    // Bullet Points
    ctx.font = "19px 'Segoe UI'";
    let bYPos = 265;
    if (newsData.bullet_points) {
        newsData.bullet_points.slice(0, 13).forEach(bullet => {
            ctx.fillStyle = "#FFD700";
            ctx.fillText("✦", 710, bYPos);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(bullet, 740, bYPos);
            bYPos += 33;
        });
    }

    requestAnimationFrame(render);
}

// Helper: Wrap Text
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        if (context.measureText(testLine).width > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    return y + lineHeight;
}

// Initialization
setInterval(updateNews, 5000); 
updateNews();
render();
