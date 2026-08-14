---
# Section 1: RPG Cards Grid
- type: card
  title: "RPGs"
  sources:
    - folder: "rpgs"
  properties:
    - system
    - status
  cardOptions:
    imageProperty: image
    columns: 3

# Section 2: Book Cards Grid
- type: card
  title: "Reading List"
  sources:
    - folder: "books"
  properties:
    - author
    - rating
  cardOptions:
    imageProperty: cover
    columns: 4

# Section 3: Notes List
- type: list
  title: "Recent Notes"
  sources:
    - folder: "notes"
  properties:
    - updated
---