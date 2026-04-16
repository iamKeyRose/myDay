const SUPABASE_URL = 'https://hghgifkleqhdeqpoqjln.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4qkd_gYISl4j_s90SqNQ1w_6nfWRcrd'; 
const supabase = lib.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. GENERATE NEWS USING AI
async function generateWithAI() {
    const rawText = document.getElementById('rawInput').value;
    alert("Sending to AI... (Integration with OpenAI/Claude goes here)");
    
    // Logic: 
    // 1. Send rawText to your AI Edge Function
    // 2. AI returns a JSON object (Topic, Subtopic, Paragraphs)
    // 3. Auto-fill the inputs below
}

// 2. SAVE TO SUPABASE
async function saveNews() {
    const topic = document.getElementById('topic').value;
    const paras = document.getElementById('paragraphs').value.split('\n');

    const { data, error } = await supabase
        .from('news_items')
        .insert([{ 
            topic: topic, 
            paragraphs: paras, 
            is_active: false,
            status: 'draft' 
        }]);

    if (error) alert(error.message);
    else {
        alert("Saved!");
        loadNewsList();
    }
}

// 3. TOGGLE LIVE STATUS
async function goLive(id) {
    // First, set all to inactive
    await supabase.from('news_items').update({ is_active: false }).neq('id', id);
    
    // Set selected to active
    const { error } = await supabase
        .from('news_items')
        .update({ is_active: true })
        .eq('id', id);

    if (error) alert(error.message);
    else loadNewsList();
}

// 4. LOAD THE LIST
async function loadNewsList() {
    const { data } = await supabase.from('news_items').select('*').order('created_at', { ascending: false });
    const container = document.getElementById('list-container');
    container.innerHTML = data.map(news => `
        <div class="news-card">
            <div>
                <strong>${news.topic}</strong> 
                <span class="${news.is_active ? 'status-live' : ''}">${news.is_active ? '[LIVE]' : ''}</span>
            </div>
            <button onclick="goLive('${news.id}')">${news.is_active ? 'Streaming...' : 'Go Live'}</button>
        </div>
    `).join('');
}

loadNewsList();
