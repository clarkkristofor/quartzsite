---
publish: true
---
# [[RPGs Played.base|RPGs]]
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
    - '!file.basename.contains("index")'
    - '!note["current campaign"].isEmpty()'
views:
  - type: cards
    name: View
    sort:
      - property: file.ctime
        direction: DESC
    image: note.image

```
# [[Books Read.base|Books]]
**Reading Now**
- [[When Driving Is Not an Option - Anna Zivarts]]
- [[Playful Awakening - Dianne Gammage]]

**Recently Read**
- [[From Strength to Strength - Arthur C Brooks]]
- [[The Faith of Beasts - James S A Corey]]
- [[What Makes You Come Alive - Lerita Coleman Brown]]
- [[Transcription - Ben Lerner]]
# [[music/index|Music]]
- [[The Former Site Of]]
- *Advent playlist:* [[that joy]]
- [[Merry Christmas playlist]]
# [[blog/index|Notes]]
