# ***Other Games***
```dataview
table "<ul>" + join( map( rows.file, (f) => "<li><a class='internal-link' href='https://superclark.net/" + lower(replace(replace(f.path, " ", "-"), ".md", "")) + "'>" + f.name + "</a>" ), "</li>") + "</ul>" as Note, rows.Date as Date
from "gamelog"
where Game != "Arcs" and Game != "13th Age" and Game != "Masks" and Game != empty
sort Date desc
group by Game
```
