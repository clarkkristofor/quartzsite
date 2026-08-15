---
publish: true
title: super clark
---
# [[RPG Campaigns & One-Shots.base|RPGs]]
```base
"0":
  type: card
  title: RPGs
  sources:
    - folder: rpgs
  cardOptions:
    imageProperty: image
filters:
  and:
    - file.folder == "rpgs"
    - '!file.fullname.contains("campaigns")'
    - date_finished.isEmpty()
    - file.name != "index"
views:
  - type: cards
    name: View
    order:
      - file.name
    sort:
      - property: file.ctime
        direction: DESC
    image: note.image

```
# [[Books Read.base|Books]]
**Reading Now**
- *When Driving Is Not an Option* by Anna Zivarts
- *Fully Alive: Tending to the Soul in Turbulent Times* by Elizabeth Oldfield
# [[music/index|Music]]
- [[The Former Site Of]]
- *Advent playlist:* [[that joy]]
- [[Merry Christmas playlist]]
# [[blog/index|Blog]]
*quick thoughts on games and more*