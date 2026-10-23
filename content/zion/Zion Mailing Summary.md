# Neighborhood Mailing: EDDM vs. Address List

*Zion Lutheran, 1216 W 8th St, Davenport IA 52802. Summary of a conversation on Oct 22, 2026.*

## The question

Would it be cheaper over the long run to build a list of actual residential addresses near the church than to use USPS Every Door Direct Mail (EDDM)?

## Short answer

**Not for this area.** The routes around Zion divide into whole carrier routes cleanly, so EDDM wastes very little at the edges, and nonprofit EDDM postage is the lowest rate USPS offers. EDDM comes out about **10–15% cheaper per mailing** at every size.

An address list pays off only when you want to **leave addresses out**: current members, businesses, or apartment buildings. It also helps when you mail an area that cuts awkwardly across routes, or when you want to merge the mailing with Breeze member addresses.

## What's within 2 miles of the church

- 34 carrier routes touch a 2-mile circle. Four of them are across the river in Rock Island, IL (61201).
- Iowa side: 30 routes, about **16,100 residential addresses**, of which about 15,100 fall inside the circle.
- 20 of the 30 Iowa routes are entirely inside the circle, and most of the rest are over 90% inside.
- One route, **52802-C034**, is about 90% outside the circle, so skip it.
- With EDDM, only about 600 homes (~4%) fall outside the circle.

## Cost per mailing (Iowa side, centered on the church)

| Households | EDDM, nonprofit | Addressed list, nonprofit | EDDM Retail (no permit) |
|---|---|---|---|
| ~1,000 | **~$330** (982 homes, 2 routes) | ~$385 | ~$450 |
| ~3,000 | **~$770** (3,014 homes, 6 routes) | ~$855 | ~$1,145 |
| ~5,000 | **~$1,220** (5,177 homes, 9 routes) | ~$1,375 | ~$1,865 |
| ~15,000 (full 2 mi) | ~$3,900 | ~$4,150 | — |

### Assumptions

- **Nonprofit EDDM:** 13.6¢ postage per piece, the nonprofit saturation/EDDM flat rate when dropped at the delivery post office. Printing a 6.5×9 card costs roughly 20¢ / 12¢ / 10¢ each at 1k / 3k / 5k.
- **Nonprofit addressed list:** 18.5¢ postage per piece (nonprofit automation letter, 5-digit presort). A 4×6 card costs roughly 10¢ / 6¢ / 5¢ each. Add about 4¢ each, with a ~$100 minimum, for a mail house to handle addressing, Intelligent Mail barcodes, and presort. The list itself could be built from Scott County parcel data at no cost.
- **EDDM Retail:** 26¢ postage, no permit or fees. This is the do-it-yourself fallback if Zion never sets up nonprofit mailing.
- **Fixed fees (same for both nonprofit options):** $390 annual USPS Marketing Mail fee. Mailing on your own permit adds a one-time $390 permit imprint application fee; a mail house can mail under its own permit instead. Nonprofit mailing authorization itself is free (PS Form 3624), and Zion should qualify.
- Printing figures are estimates. Postage comes from USPS Notice 123 (rates effective July 12, 2026).

## Routes to use, nearest the church first

| Set | Routes | Cumulative homes |
|---|---|---|
| ~1,000 | 52802-C021, 52802-C019 | 982 |
| ~3,000 | add 52804-C028, 52804-C044, 52802-C052, 52804-C016 | 3,014 |
| ~5,000 | add 52804-C054, 52802-C012, 52801-C030 | 5,177 |

## Other notes

- EDDM requires **flat-size** pieces (larger than 6.125″ × 11.5″ in at least one dimension, e.g. 6.5×9 or 6.25×11). Addressed mail can use cheaper letter-size postcards.
- EDDM Retail is capped at 5,000 pieces per ZIP per day. ZIP 52804 alone has about 7,300 homes, so a full-area retail drop would take two days.
- Public parcel data lists addresses and property owners, not residents. Addressed mail should go to "Current Resident" or "Our Neighbors at…".
- Apartment buildings are the messy part of any address list, because parcel data often shows one address for the whole building.

## Map

An interactive route map was published as an artifact, **Zion Carrier Routes**. It shades the ~1,000 / ~3,000 / ~5,000 route sets and shows each route's household and business counts. For lot-level boundaries, use the official EDDM map at eddm.usps.com.

![[zion mailings.png]]

## Possible next steps

- Apply for USPS nonprofit mailing authorization if Zion doesn't already have it.
- For a one-time invitation, use nonprofit EDDM with the route sets above.
- For a smaller, repeated, targeted area, build an address list from Scott County parcel data.

## Sources

- [USPS Notice 123 price list](https://pe.usps.com/text/dmm300/notice123.htm)
- [USPS Notice 123, July 2026 (PDF)](https://pe.usps.com/resources/PriceChange/July%202026%20Price%20Change%20-%20Notice123%20PDF%20-%207.2.26.pdf)
- USPS EDDM route service (gis.usps.com), for route and household counts
- [Census Geocoder](https://geocoding.geo.census.gov/) and TIGERweb, for church location, roads, and river
