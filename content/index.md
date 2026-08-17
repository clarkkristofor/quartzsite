---
publish: true
title: super clark
---
# [[RPG Campaigns and One-Shots.base|RPGs]]
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
    - file.folder == "RPGs"
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
