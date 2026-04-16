// 1. SUPABASE CONNECTION
const SUPABASE_URL = 'https://hghgifkleqhdeqpoqjln.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd'; 
const supabase = lib.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const canvas = document.getElementById('newsCanvas');
const ctx = canvas.getContext('2d');

let newsData = null;
let bgImage = new Image();

// 2. FETCH ACTIVE NEWS
async function loadActiveNews() {
    const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

    if (data) {
        newsData = data;
        if (data.images && data.images.length > 0) {
            bgImage.src = data.images[0];
            bgImage.onload = () => drawFrame();
        }
        document.getElementById('ticker-text').textContent = data.bullets.join(' • ');
        drawFrame();
    }
}

// 3. DRAW TO CANVAS
function drawFrame() {
    if (!newsData) return;

    // Background
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Image Frame
    if (bgImage.complete) {
        ctx.drawImage(bgImage, 50, 50, 500, 620); 
    }

    // Text Overlay Logic
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 50px Nyala";
    ctx.fillText(newsData.topic, 600, 100);

    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Nyala";
    let y = 180;
    newsData.paragraphs.forEach(p => {
        // Basic line wrap (simplification)
        ctx.fillText(p.substring(0, 50), 600, y);
        y += 45;
    });
}

// 4. REAL-TIME LISTENER
supabase
    .channel('news_changes')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'news_items' }, payload => {
        if (payload.new.is_active) {
            newsData = payload.new;
            bgImage.src = newsData.images[0];
            document.getElementById('ticker-text').textContent = newsData.bullets.join(' • ');
            drawFrame();
        }
    })
    .subscribe();

loadActiveNews();
