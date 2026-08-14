https://link.springer.com/chapter/10.1007/978-3-030-50540-0_20
#book_recommendation 
[[Kimberly E. Zarecor]]

[[Rural Shrink Smart]]

### Ephemera
```dataviewjs
let pages = dv.pages('"Notes/microblog"')
    .sort(p => [-1 * (p.starred ? 1 : 0), -1 * p.file.mtime.ts]);

pages = pages.limit(5);

for (let page of pages) {
    // Get the file content
    let content = await dv.io.load(page.file.path);
    
    // Remove frontmatter and get first 200 chars
    let preview = content
        .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
        .trim()
        .substring(0, 200);
        
    // Add ellipsis if content was truncated
    if (content.length > 200) {
        preview += "...";
    }

    // Format with star (if starred), preview
    let formattedText = 
        (page.starred ? "✨ " : "🫧 ") + preview;

    dv.paragraph(formattedText);
}
```

### Ephemera
```dataviewjs
let pages = dv.pages('"Notes/microblog"')
    .sort(p => [-1 * (p.starred ? 1 : 0), -1 * p.file.mtime.ts]);

pages = pages.limit(5);

for (let page of pages) {
    // Get the file content
    let content = await dv.io.load(page.file.path);
    
    // Remove frontmatter and get first 200 chars
    let preview = content
        .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
        .trim()
        .substring(0, 200);
        
    // Add ellipsis if content was truncated
    if (content.length > 200) {
        preview += "...";
    }

    // Format with star (if starred), preview
    let formattedText = 
        (page.starred ? "✨ " : "🫧 ") + preview;

    dv.paragraph(formattedText);
}
```
