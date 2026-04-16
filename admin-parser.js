function processContent() {
    const rawText = document.getElementById('rawContent').value;
    const lines = rawText.split('\n');
    
    let contentData = {
        topic: "",
        subtopic: "",
        paragraphs: [],
        bullets: [],
        images: [],
        author: "",
        source: ""
    };

    lines.forEach(line => {
        const text = line.trim();
        // Basic keywords to trigger the parser
        if (text.startsWith('Topic:')) contentData.topic = text.replace('Topic:', '').trim();
        else if (text.startsWith('Subtopic:')) contentData.subtopic = text.replace('Subtopic:', '').trim();
        else if (text.startsWith('Paragraph:')) contentData.paragraphs.push(text.replace('Paragraph:', '').trim());
        else if (text.startsWith('Bullet:')) contentData.bullets.push(text.replace('Bullet:', '').trim());
        else if (text.startsWith('Image:')) contentData.images.push(text.replace('Image:', '').trim());
        else if (text.startsWith('Author:')) contentData.author = text.replace('Author:', '').trim();
        else if (text.startsWith('Source:')) contentData.source = text.replace('Source:', '').trim();
    });

    // Store in LocalStorage
    localStorage.setItem('newsData', JSON.stringify(contentData));

    // Show the preview area
    document.getElementById('output').style.display = 'block';
    document.getElementById('jsonPreview').textContent = JSON.stringify(contentData, null, 2);
    
    alert("Broadcast Data Sent! Check your main news tab.");
}
