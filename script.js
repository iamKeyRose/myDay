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

// 1. Fetch the LIVE news
async function updateNews() {
    const { data, error } = await _supabase
        .from('news_items')
        .select('topic, subtopic, paragraphs, bullet_points')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (data && !error) {
        newsData = data;
        // Update the ticker text at the bottom too
        document.getElementById('ticker-text').innerText = `${data.topic} - ${data.subtopic}`;
    }
}

// 2. The Drawing Engine
function render() {
    // Background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Topic Header
    ctx.fillStyle = "#FFD700"; // Gold
    ctx.font = "bold 50px 'Segoe UI'";
    ctx.fillText(newsData.topic, 50, 80);

    // Subtopic
    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 30px 'Segoe UI'";
    ctx.fillText(newsData.subtopic || "", 50, 130);

    // Draw Paragraphs (Showing first 4-5 to fit screen)
    ctx.fillStyle = "#dddddd";
    ctx.font = "22px 'Segoe UI'";
    let yPos = 190;
    
    if (newsData.paragraphs) {
        newsData.paragraphs.slice(0, 5).forEach(para => {
            const lines = wrapText(ctx, para, 50, yPos, 600, 30); // Column 1
            yPos += (lines * 30) + 15;
        });
    }

    // Draw Bullet Points (Right Column)
    ctx.fillStyle = "#007bff"; 
    ctx.font = "bold 24px 'Segoe UI'";
    ctx.fillText("ቁልፍ ነጥቦች", 700, 180);

    ctx.fillStyle = "#ffffff";
    ctx.font = "20px 'Segoe UI'";
    let bYPos = 220;
    if (newsData.bullet_points) {
        newsData.bullet_points.slice(0, 12).forEach(bullet => {
            ctx.fillText("• " + bullet, 700, bYPos);
            bYPos += 35;
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
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
}

// Start everything
setInterval(updateNews, 5000); // Check for new "Live" toggle every 5 seconds
setInterval(updateClock, 1000);
updateNews();
render();
