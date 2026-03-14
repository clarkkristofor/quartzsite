---
dg-publish: "true"
---
```dataviewjs
// Target the blog folder
const blogPosts = dv.pages('"blog"');

// Sort by creation date (Newest First) and filter out system files
const sortedPosts = blogPosts
    .filter(p => !["search-index", "search-data", "blog-html-index"].includes(p.file.name))
    .sort(p => p.file.ctime, "desc");

dv.paragraph("<h1>Blog Content Proxy</h1>");

for (let p of sortedPosts) {
    // No custom IDs needed. Just the raw embed.
    dv.paragraph(`![[${p.file.name}]]`);
}
```
