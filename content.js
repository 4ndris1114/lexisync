chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SHOW_SYNONYMS") {
        fetchSynonyms(request.word);
    }
});

async function fetchSynonyms(word) {
    const cleanWord = word.trim().toLowerCase();

    // check cache first
    const cache = await chrome.storage.local.get(cleanWord);
    if (cache[cleanWord]) {
        return showOverlay(cache[cleanWord], word);
    }

    try {
        const response = await fetch(`https://api.datamuse.com/words?rel_syn=${cleanWord}`);
        if (!response.ok) throw new Error('Fetching synonym from Datamuse API was unsucessful');

        const data = await response.json();
        const synonyms = data.slice(0, 8).map(obj => obj.word);

        chrome.storage.local.set({ [cleanWord]: synonyms });

        showOverlay(synonyms, word);
    } catch (error) {
        console.error("Error:", error);
        // Add a small "Error" UI toast here if you want to be extra thorough
    }
}

function showOverlay(synonyms, originalWord) {
    // Remove existing container if exists
    const existing = document.getElementById('lexisync-root');
    if (existing) existing.remove();

    const host = document.createElement('div');
    host.id = 'lexisync-root';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.className = 'overlay-wrapper';

    // encapsulated styles (cannot be broken by page's CSS)
    const style = document.createElement('style');
    style.textContent = `
      .overlay-wrapper {
        position: fixed;
        top: 30px;
        right: 30px;
        width: 280px;
        padding: 16px;
        background: #ffffff;
        color: #1a1a1a;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        border-radius: 12px;
        z-index: 2147483647; /* Max z-index */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        border: 1px solid #e0e0e0;
        animation: slideIn 0.3s ease-out;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .title { font-weight: 700; font-size: 14px; color: #5f6368; margin-bottom: 8px; }
      .synonym-list { display: flex; flex-wrap: wrap; gap: 6px; }
      .synonym-item { 
        background: #f1f3f4; 
        padding: 4px 10px; 
        border-radius: 16px; 
        font-size: 13px;
        color: #185abc;
        cursor: pointer;
        transition: background 0.2s;
      }
      .synonym-item:hover { background: #e8f0fe; }
      .close-btn { 
        position: absolute; top: 8px; right: 8px; 
        border: none; background: none; cursor: pointer; font-size: 18px; color: #999;
      }
    `;

    wrapper.innerHTML = `
      <button class="close-btn">&times;</button>
      <div class="title">Synonyms for "${originalWord}"</div>
      <div class="synonym-list">
        ${synonyms.length > 0
            ? synonyms.map(s => `<span class="synonym-item">${s}</span>`).join('')
            : '<span>No results found.</span>'}
      </div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);

    wrapper.querySelector('.close-btn').onclick = () => host.remove();
}