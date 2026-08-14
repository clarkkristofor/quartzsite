<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap" rel="stylesheet">

<div id="active-books-list" style="font-family: 'Josefin Sans', sans-serif; text-align: left; width: 100%;">

<p style="opacity:0.5; font-size: 0.9em;">Loading active reads...</p>

</div>

  

<script>

(function() {

const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRET0Xe2d8weEA6eRs9hZt8SUceAES2eGQUcbwkgoOiXZx-yJ8MEcRAfcaizdKD1b6frBGKvRjW4Y15/pub?output=csv';

  

async function loadActive() {

try {

const res = await fetch(url);

const raw = await res.text();

  

// Split rows and filter out empty lines

const rows = raw.split(/\r?\n/).filter(l => l.trim() !== '').slice(1);

  

const active = rows.map(r => {

// Regex to handle commas inside quotes in CSV

const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

return {

title: (c[0]||"").replace(/"/g,"").trim(),

author: (c[1]||"").replace(/"/g,"").trim(),

rating: (c[3]||"").trim()

};

}).filter(b => parseFloat(b.rating) === 99);

  

document.getElementById('active-books-list').innerHTML = active.map(b => `

<div style="padding: 1rem 0; border-bottom: 1px solid rgba(128,128,128,0.1); line-height: 1.4;">

<div style="font-weight:700; font-size:1.15em; color: #333; display: inline-block;">${b.title}</div>

<span style="opacity:0.4; font-style:italic; font-size:0.85em; margin: 0 6px;">by</span>

<span style="opacity:0.8; font-weight:400; font-size:1em;">${b.author}</span>

</div>`).join('') || '<p style="opacity:0.5;">No active reads found.</p>';

  

} catch(e) {

console.error("Error loading books:", e);

document.getElementById('active-books-list').innerHTML = "Unable to load list.";

}

}

  

// Short delay to ensure DOM is ready

setTimeout(loadActive, 100);

})();

</script>




<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap" rel="stylesheet">

<div style="margin-bottom: 20px; display: flex; align-items: center; gap: 15px; font-family: 'Josefin Sans', sans-serif;">

<span style="font-size: 0.75em; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.1em;">Read:</span>

<select id="archive-filter" onchange="window.updateArchive()" style="background: rgba(255,255,255,0.05); color: inherit; border: 1px solid rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-family: inherit;">

<option value="none">Select Year...</option>

<option value="2026">2026</option>

<option value="2025">2025</option>

<option value="2024">2024</option>

<option value="earlier">Earlier</option>

</select>

</div>

  

<div id="archive-list" style="font-family: 'Josefin Sans', sans-serif; text-align: left; width: 100%;"></div>

  

<script>

(function() {

const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRET0Xe2d8weEA6eRs9hZt8SUceAES2eGQUcbwkgoOiXZx-yJ8MEcRAfcaizdKD1b6frBGKvRjW4Y15/pub?output=csv';

let library = [];

  

window.updateArchive = function() {

const val = document.getElementById('archive-filter').value;

const div = document.getElementById('archive-list');

if (val === 'none') { div.innerHTML = ''; return; }

  

const filtered = library.filter(b => {

const y = new Date(b.date).getFullYear();

return (val === 'earlier') ? (y < 2024) : (y.toString() === val);

});

  

div.innerHTML = filtered.map(b => `

<div style="padding: 1.2rem 0; border-bottom: 1px solid rgba(128,128,128,0.15);">

<div style="margin-bottom: 0.4rem; line-height: 1.3;">

<span style="font-weight:700; font-size:1.15em;">${b.title}</span>

<span style="opacity:0.4; font-size:0.85em; font-style:italic; margin: 0 4px;">by</span>

<span style="opacity:0.8;">${b.author}</span>

</div>

<div style="font-size:0.85em; opacity:0.6; display:flex; gap:10px; align-items:center;">

<span>${b.date}</span>

<span style="font-size:0.6em; opacity:0.5;">●</span>

<span style="color:#f1c40f;">${'⭐'.repeat(Math.floor(b.rating))}${b.rating % 1 !== 0 ? '✨' : ''}</span>

</div>

</div>`).join('') || '<p style="opacity:0.5;">No entries found.</p>';

};

  

async function loadArchive() {

try {

const res = await fetch(url);

const raw = await res.text();

const rows = raw.split(/\r?\n/).filter(l => l.trim() !== '').slice(1);

library = rows.map(r => {

const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

return {

title: (c[0]||"").replace(/"/g,""),

author: (c[1]||"").replace(/"/g,""),

date: (c[2]||""),

rating: parseFloat(c[3]||"0")

};

}).filter(b => b.rating !== 99 && b.date !== "");

library.sort((a,b) => new Date(b.date) - new Date(a.date));

} catch(e) { console.error(e); }

}

setTimeout(loadArchive, 200);

})();

</script>