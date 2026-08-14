<div id="blog-system-final" style="font-family: 'Josefin Sans', sans-serif; text-align: left; width: 100%; position: relative;">

<div id="cat-bar-final" style="margin-bottom: 2.5rem; display: flex; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 1.5rem;"></div>

<div id="blog-posts-container-final">

<p style="opacity:0.5; font-size: 0.9em;">Synchronizing posts...</p>

</div>

<div id="pag-controls-final" style="margin-top: 3rem; text-align: center; display: none;">

<button id="load-more-btn-final" style="background: transparent; border: 2px solid #000; padding: 12px 30px; font-family: inherit; cursor: pointer; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; transition: 0.3s; font-size: 0.8rem;">Load More Posts</button>

</div>

<button id="top-btn-final" title="Go to top" style="display: none; position: fixed; bottom: 30px; right: 30px; z-index: 99; border: none; outline: none; background-color: #000; color: white; cursor: pointer; padding: 15px; border-radius: 50%; width: 50px; height: 50px; font-weight: 700; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: 0.3s;">↑</button>

</div>

  

<script>

(function() {

const blogUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRET0Xe2d8weEA6eRs9hZt8SUceAES2eGQUcbwkgoOiXZx-yJ8MEcRAfcaizdKD1b6frBGKvRjW4Y15/pub?gid=1982505632&single=true&output=csv';

  

let blogData = [];

let activeFeed = [];

let count = 5;

  

// Use unique IDs to avoid clashing with Book list

const mainView = document.getElementById('blog-posts-container-final');

const barView = document.getElementById('cat-bar-final');

const btnMore = document.getElementById('load-more-btn-final');

const wrapMore = document.getElementById('pag-controls-final');

const btnTop = document.getElementById('top-btn-final');

  

function render() {

if (!mainView) return;

const slice = activeFeed.slice(0, count);

  

mainView.innerHTML = slice.map(p => `

<article style="margin-bottom: 5rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(0,0,0,0.08);">

<header style="margin-bottom: 1.5rem;">

<div style="display: flex; gap: 15px; align-items: center; margin-bottom: 1rem;">

<span style="background: #000; color: #fff; padding: 4px 12px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; border-radius: 2px;">${p.cat}</span>

<span style="font-size: 0.85rem; color: #aaa; font-weight: 400;">${p.date}</span>

</div>

<h2 style="margin: 0; font-size: 2.5rem; line-height: 1.1; font-weight: 700; color: #111;">${p.title}</h2>

</header>

<div style="line-height: 1.8; font-size: 1.15rem; color: #333; white-space: pre-wrap; font-weight: 400;">${p.body}</div>

</article>

`).join('');

  

wrapMore.style.display = (count < activeFeed.length) ? 'block' : 'none';

}

  

window.filterBlog = function(category) {

count = 5;

activeFeed = (category === 'All') ? blogData : blogData.filter(p => p.cat === category);

render();

  

document.querySelectorAll('.blog-cat-btn').forEach(b => {

const isMatch = b.innerText === category.toUpperCase();

b.style.background = isMatch ? '#000' : 'transparent';

b.style.color = isMatch ? '#fff' : '#000';

});

};

  

async function fetchData() {

try {

const response = await fetch(blogUrl + '&cb=' + Date.now());

const text = await response.text();

  

// Robust parsing: Handles commas/quotes within blog posts

const lines = text.split(/\r?\n/).filter(l => l.trim() !== '').slice(1);

  

blogData = lines.map(line => {

const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

return {

date: (parts[0]||"").replace(/"/g,"").trim(),

title: (parts[1]||"").replace(/"/g,"").trim(),

cat: (parts[2]||"").replace(/"/g,"").trim(),

body: (parts[3]||"").replace(/"/g,"").trim()

};

}).filter(item => item.date.length > 2).sort((a,b) => new Date(b.date) - new Date(a.date));

  

const cats = ['All', ...new Set(blogData.map(p => p.cat))];

barView.innerHTML = cats.map(c => `

<button class="blog-cat-btn" onclick="window.filterBlog('${c}')" style="background: transparent; border: 1.5px solid #000; padding: 6px 15px; font-family: inherit; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: 0.2s; letter-spacing: 0.1em; margin-right: 5px;">${c}</button>

`).join('');

  

window.filterBlog('All');

  

} catch(e) {

console.error("Debug Info:", e);

if(mainView) mainView.innerHTML = "Sync Error. Please check 'Publish to Web' settings.";

}

}

  

window.onscroll = function() {

if (btnTop) {

btnTop.style.display = (window.pageYOffset > 500) ? "block" : "none";

}

};

  

if(btnTop) btnTop.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});

if(btnMore) btnMore.onclick = () => { count += 5; render(); };

  

// Start with a slight delay for DOM stability

setTimeout(fetchData, 300);

})();

</script>

  

<style>

.blog-cat-btn:hover { background: #000 !important; color: #fff !important; }

#load-more-btn-final:hover { background: #000 !important; color: #fff !important; }

</style>