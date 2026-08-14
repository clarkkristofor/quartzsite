## new
```dataview
list " by " + Author
from "Notes/media log"
sort Title asc
where Date = ""
```
## old
```dataview
list
where contains(file.tags, "#book_recommendation")
sort Date desc
```

**Incoming Links**
```dataview
LIST file.mday
FROM [[#]]
SORT file.mtime desc
```

