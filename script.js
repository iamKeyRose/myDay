const { createClient } = window.supabase;
const _supabase = createClient('https://hghgifkleqhdeqpoqjln.supabase.co', 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd');

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

let newsData = {
    topic: "በመጠበቅ ላይ...",
    subtopic: "",
    paragraphs: [],
    bullet_points: []
};

let scanlinePos = 0;
let glowValue = 0;
let glowDir = 1;

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
            newsData = data;
            const ticker = document.getElementById('ticker-text');
            if(ticker) ticker.innerText = `ሰበር ዜና: ${data.topic} — ${data.subtopic} — `;
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

// 2. Helper for professional UI
function drawBackground() {
    // Deep Blue Gradient Background
    const bgGrad = ctx.createRadialGradient(640, 360, 50, 640, 360, 800);
    bgGrad.addColorStop(0, "#1c1e2e");
    bgGrad.addColorStop(1, "#0a0b12");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animated Scanline
    ctx.strokeStyle = "rgba(255, 215, 0, 0.05)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, scanlinePos);
    ctx.lineTo(canvas.width, scanlinePos);
    ctx.stroke();
    scanlinePos = (scanlinePos + 2) % canvas.height;

    // Tech Frame
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
    
    // Corner accents
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(0, 0, 40, 5); // Top Left
    ctx.fillRect(0, 0, 5, 40);
    ctx.fillRect(canvas.width-40, 0, 40, 5); // Top Right
    ctx.fillRect(canvas.width-5, 0, 5, 40);
}

// 3. The Drawing Engine
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    // Pulse effect for Topic
    glowValue += 0.02 * glowDir;
    if (glowValue > 1 || glowValue < 0) glowDir *= -1;

    // Topic Header
    ctx.shadowBlur = 15 * glowValue;
    ctx.shadowColor = "#FFD700";
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 52px 'Segoe UI', Arial";
    ctx.fillText(newsData.topic, 50, 90);
    ctx.shadowBlur = 0; // Reset shadow

    // Subtopic
    ctx.fillStyle = "#00d4ff";
    ctx.font = "26px 'Segoe UI', Arial";
    ctx.fillText(newsData.subtopic || "", 50, 135);

    // Sidebar Title for Bullets
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(680, 160, 560, 520);
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 24px 'Segoe UI'";
    ctx.fillText("ቁልፍ ነጥቦች (Key Highlights)", 710, 200);

    // Draw Paragraphs (Left Column)
    ctx.fillStyle = "#ffffff";
    ctx.font = "21px 'Segoe UI'";
    let yPos = 200;
    
    if (newsData.paragraphs && newsData.paragraphs.length > 0) {
        // Show up to 7 paragraphs on left column
        newsData.paragraphs.slice(0, 7).forEach(para => {
            const lines = wrapText(ctx, para, 50, yPos, 600, 30);
            yPos += (lines * 30) + 20;
        });
    }

    // Draw Bullet Points (Right Column)
    ctx.fillStyle = "#ffffff";
    ctx.font = "19px 'Segoe UI'";
    let bYPos = 245;
    if (newsData.bullet_points && newsData.bullet_points.length > 0) {
        // Show up to 13 bullet points to keep it clean
        newsData.bullet_points.slice(0, 13).forEach(bullet => {
            ctx.fillStyle = "#FFD700";
            ctx.fillText("▶", 710, bYPos);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(bullet, 740, bYPos);
            bYPos += 34;
        });
    }

    requestAnimationFrame(render);
}

// Helper: Wrap text so it doesn't go off the canvas
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
            lineCount++;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    return lineCount + 1;
}

// Clock Logic
function updateClock() {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString('en-GB'); // 24h format
    }
}

// Initialization
setInterval(updateNews, 5000); 
setInterval(updateClock, 1000);
updateNews();
render();
