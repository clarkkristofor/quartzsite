# ***Board Games***
```dataview
list without id Date + ": **" + Game + "** - " + file.link
from "gamelog"
sort Date desc, file.ctime desc
where Date != empty and Game != "Masks" and Game !="13th Age"
limit 10
```
* [[Arcs]]