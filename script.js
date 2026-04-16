const { createClient } = window.supabase;
const _supabase = createClient('https://hghgifkleqhdeqpoqjln.supabase.co', 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd');

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

// --- Motion Variables ---
let newsData = { topic: "በመጠበቅ ላይ...", subtopic: "", paragraphs: [], bullet_points: [] };
let scrollY = 0;           // Controls the vertical crawl
let scanlinePos = 0;       // Controls the background line
let tickerX = 0;           // Controls the footer ticker (if drawn on canvas)

const LOGO_TEXT = "የእኔ";
const SLOGAN = "እውነተኛ መረጃ ለሁላችንም!";

async function updateNews() {
    try {
        const { data, error } = await _supabase
            .from('news_items')
            .select('topic, subtopic, paragraphs, bullet_points')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1).single();

        if (data && !error) {
            // Only reset if new news arrives
            if (newsData.topic !== data.topic) {
                scrollY = 0; 
                newsData = data;
            }
            const ticker = document.getElementById('ticker-text');
            if(ticker) ticker.innerText = `ሰበር ዜና: ${data.topic} — ${data.subtopic} — `;
        }
    } catch (e) { console.error(e); }
}

function render() {
    // 1. Clear Screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Background & Atmosphere
    const bgGrad = ctx.createRadialGradient(640, 360, 50, 640, 360, 800);
    bgGrad.addColorStop(0, "#1c1e2e");
    bgGrad.addColorStop(1, "#0a0a0f");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Moving Scanline
    scanlinePos = (scanlinePos + 1) % canvas.height;
    ctx.strokeStyle = "rgba(255, 215, 0, 0.03)";
    ctx.strokeRect(0, scanlinePos, canvas.width, 1);

    // 3. Branding Stack
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 65px 'Segoe UI'";
    ctx.fillText(LOGO_TEXT, 45, 90);
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px 'Segoe UI'";
    ctx.fillText(SLOGAN, 45, 115);

    // Live Indicator
    ctx.fillStyle = "#ff0000";
    ctx.beginPath(); ctx.arc(55, 140, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px 'Segoe UI'";
    ctx.fillText("LIVE", 70, 146);

    // Topic & Subtopic
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 48px 'Segoe UI'";
    ctx.fillText(newsData.topic, 250, 90);
    ctx.fillStyle = "#00d4ff";
    ctx.font = "24px 'Segoe UI'";
    ctx.fillText(newsData.subtopic || "", 250, 128);

    // 4. THE ENGINE: Scrolling Narrative (Left Column)
    ctx.save();
    ctx.beginPath();
    ctx.rect(40, 180, 620, 500); // Mask area
    ctx.clip();

    ctx.fillStyle = "#ffffff";
    ctx.font = "21px 'Segoe UI'";
    let currentY = 220 - scrollY;

    if (newsData.paragraphs) {
        newsData.paragraphs.forEach(para => {
            currentY = wrapText(ctx, para, 50, currentY, 560, 32) + 25;
        });
    }
    
    // THE "RUNNING" PART: Increment Scroll
    scrollY += 0.6; 
    if (scrollY > currentY + 300) scrollY = -400; // Reset loop when text finishes
    ctx.restore();

    // 5. Highlights (Right Column)
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(680, 180, 560, 505);
    ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
    ctx.strokeRect(680, 180, 560, 505);

    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 24px 'Segoe UI'";
    ctx.fillText("ቁልፍ መረጃዎች", 710, 220);

    let bY = 265;
    if (newsData.bullet_points) {
        newsData.bullet_points.forEach((bullet, index) => {
            // Check if bullet is within box height
            if (bY < 650) {
                ctx.fillStyle = "#FFD700";
                ctx.fillText("✦", 710, bY);
                ctx.fillStyle = "#ffffff";
                ctx.font = "18px 'Segoe UI'";
                ctx.fillText(bullet, 740, bY);
                bY += 33;
            }
        });
    }

    // 6. Loop the Render
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
    return y + lineHeight;
}

// Initializers
setInterval(updateNews, 5000); 
updateNews();
render(); // Start the animation loop
