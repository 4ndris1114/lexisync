const input = document.getElementById('wordInput');
const resultsDiv = document.getElementById('results');
const loader = document.getElementById('loader');

// limit API calls
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

const searchSynonyms = debounce(async (word) => {
  if (word.length < 2) {
    resultsDiv.innerHTML = '';
    return;
  }

  loader.style.display = 'block';
  
  try {
    const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);
    const data = await response.json();
    
    resultsDiv.innerHTML = data.slice(0, 10).map(s => 
      `<span class="synonym-chip">${s.word}</span>`
    ).join('') || 'No synonyms found.';
    
  } catch (err) {
    resultsDiv.innerHTML = 'Error fetching synonyms.';
  } finally {
    loader.style.display = 'none';
  }
});

input.addEventListener('input', (e) => searchSynonyms(e.target.value));