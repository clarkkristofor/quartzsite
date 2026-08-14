---
publish: true
dg-publish: "true"
---
## not working properly
```dataview
table rows.file.link as Note, rows.Date as Date
from "gamelog"
where Game != "Arcs" and Game != "13th Age" and Game != "Masks" and Game != empty
sort Date desc
group by Game
```

Only the note with no spaces in the name links correctly on the site. Links fine in Obsidian. Is that a bug or my mistake?

The heart of the dataview code is: 
`table rows.file.link as Note, rows.Date as Date`

Full:
```
table rows.file.link as Note, rows.Date as Date
from "gamelog"
where Game != "Arcs" and Game != "13th Age" and Game != "Masks" and Game != empty
sort Date desc
group by Game
```
## work around
```dataview
table "<ul>" + join( map( rows.file, (f) => "<li><a class='internal-link' href='https://superclark.net/" + lower(replace(replace(f.path, " ", "-"), ".md", "")) + "'>" + f.name + "</a>" ), "</li>") + "</ul>" as Note, rows.Date as Date
from "gamelog"
where Game != "Arcs" and Game != "13th Age" and Game != "Masks" and Game != empty
sort Date desc
group by Game
```

This workaround works like I would expect the broken code above would.  The heart of the dataview code is: 
`table "<ul>" + join( map( rows.file, (f) => "<li><a class='internal-link' href='https://superclark.net/" + lower(replace(replace(f.path, " ", "-"), ".md", "")) + "'>" + f.name + "</a>" ), "</li>") + "</ul>" as Note, rows.Date as Date`

Improved from:
`table join( map( rows.file, (f) => "• [" + f.name + "](https://superclark.net/" + lower(replace(replace(f.path, " ", "-"), ".md", "")) + ")" ), "<br>" ) as Note, rows.Date as Date`
## a broken workaround attempt
The dataview code:
`table join( map( rows.file, (f) => "• [[" + lower(replace(replace(f.name, " ", "-"), ".md", "")) + "]]" ), "<br>" ) as Note, rows.Date as Date`

```dataview
table join( map( rows.file, (f) => "• [[" + lower(replace(replace(f.name, " ", "-"), ".md", "")) + "]]" ), "<br>" ) as Note, rows.Date as Date
from "gamelog"
where Game != "Arcs" and Game != "13th Age" and Game != "Masks" and Game != empty
sort Date desc
group by Game
```

This replicates the original problem, with the less-than-ideal formatting of the unimproved workaround.