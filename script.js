const SUPABASE_URL = 'https://hghgifkleqhdeqpoqjln.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd'; 
const supabase = lib.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');
let activeNews = null;
let bgImg = new Image();

// 1. Core Drawing Function
function draw() {
    if (!activeNews) return;

    // Clear and draw background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (bgImg.complete && bgImg.src) {
        ctx.drawImage(bgImg, 50, 50, 550, 620); // Image area
    }

    // Draw Topic
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 48px Nyala";
    ctx.fillText(activeNews.topic || "", 630, 100);

    // Draw Paragraphs
    ctx.fillStyle = "#ffffff";
    ctx.font = "28px Nyala";
    let yOffset = 180;
    if (activeNews.paragraphs) {
        activeNews.paragraphs.forEach(p => {
            ctx.fillText(p, 630, yOffset);
            yOffset += 45;
        });
    }
    requestAnimationFrame(draw);
}

// 2. Fetch and Listen
async function init() {
    const { data } = await supabase.from('news_items').select('*').eq('is_active', true).maybeSingle();
    updateUI(data);

    // Real-time listener
    supabase.channel('news_updates')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'news_items' }, payload => {
            if (payload.new.is_active) updateUI(payload.new);
        }).subscribe();
}

function updateUI(data) {
    if (!data) return;
    activeNews = data;
    if (data.images && data.images[0]) bgImg.src = data.images[0];
    document.getElementById('ticker-text').textContent = (data.bullets || []).join(" • ");
    draw();
}

// Clock logic
setInterval(() => {
    document.getElementById('clock').textContent = new Date().toLocaleTimeString();
}, 1000);

init();
