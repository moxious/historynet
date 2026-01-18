# Protestant Reformation - Review Notes

**Date**: 2026-01-18
**Last Updated**: 2026-01-18
**Reviewer**: AI Agent (Claude)
**Purpose**: Document issues, gaps, and review findings for the Protestant Reformation network.

---

## Executive Summary

Phase 5 review completed. The network is largely complete and well-documented, with strong evidence for most relationships. Key findings:

1. **Count Discrepancy**: Summary statistics claimed 71 people, but actual enumeration contains **65 people**
2. **Orphan Analysis**: All enumerated individuals have at least one relationship
3. **Evidence Quality**: All 103 relationships include evidence citations with strength ratings
4. **Contested Claims**: 3 minor contested items identified and documented
5. **Recommendation**: Correct summary statistics; consider adding 6 notable figures to reach target

---

## I. Count Verification

### Summary vs. Actual Count Discrepancy

The progress.md and 02-enumeration.md summary statistics claim 71 people, but actual count is **65**.

| Subgroup | Claimed | Actual | Discrepancy |
|----------|---------|--------|-------------|
| Seed Figures | 7 | 7 | ✓ |
| Lutheran/Wittenberg Circle | 11 | 9 | -2 |
| Swiss Reformed | 10 | 9 | -1 |
| Strasbourg Reformers | 4 | 4 | ✓ |
| English Reformation | 12 | 10 | -2 |
| Christian Humanists | 5 | 5 | ✓ |
| Radical Reformation | 6 | 6 | ✓ |
| French Reformed | 4 | 4 | ✓ |
| Political Patrons/Opponents | 9 | 8 | -1 |
| Scottish Reformation | 3 | 3 | ✓ |
| **Total** | **71** | **65** | **-6** |

### Verified Person Count by Section

**Seed Figures (7):**
1. Martin Luther
2. John Calvin
3. Huldrych Zwingli
4. Erasmus of Rotterdam
5. William Tyndale
6. Thomas Cranmer
7. Philip Melanchthon

**Lutheran/Wittenberg Circle (9):**
1. Johannes Bugenhagen
2. Justus Jonas
3. Caspar Cruciger the Elder
4. Georg Spalatin
5. Andreas Karlstadt
6. Katharina von Bora
7. Lucas Cranach the Elder
8. Johann Agricola
9. Thomas Müntzer

**Swiss Reformed (9):**
1. Heinrich Bullinger
2. Leo Jud
3. Johannes Oecolampadius
4. Rudolf Gwalther
5. Kaspar Megander
6. Guillaume Farel
7. Pierre Viret
8. Theodore Beza
9. Pierre Robert Olivétan

**Strasbourg Reformers (4):**
1. Martin Bucer
2. Wolfgang Capito
3. Katharina Schütz Zell
4. Matthew Zell

**English Reformation (10):**
1. Thomas Cromwell
2. Hugh Latimer
3. Nicholas Ridley
4. Miles Coverdale
5. John Foxe
6. Thomas Bilney
7. Robert Barnes
8. John Frith
9. John Hooper
10. Matthew Parker

**Christian Humanists (5):**
1. Johannes Reuchlin
2. John Colet
3. Thomas More
4. Jacques Lefèvre d'Étaples
5. Guillaume Briçonnet

**Radical Reformation (6):**
1. Conrad Grebel
2. Felix Manz
3. George Blaurock
4. Balthasar Hubmaier
5. Menno Simons
6. Michael Sattler

**French Reformed (4):**
1. Marguerite of Navarre
2. Clément Marot
3. Antoine Froment
4. Marie Dentière

**Political Patrons/Opponents (8):**
1. Frederick the Wise
2. John the Steadfast
3. John Frederick I
4. Philip of Hesse
5. Henry VIII
6. Charles V
7. Johann Eck
8. Cardinal Thomas Cajetan

**Scottish Reformation (3):**
1. John Knox
2. George Wishart
3. Patrick Hamilton

### Recommended Additions to Reach Target

To address the 6-person shortfall, consider adding these well-documented figures:

1. **Johann von Staupitz** (c. 1460-1524): Luther's superior and mentor in the Augustinian Order; crucial to Luther's early theological development → Lutheran Circle
2. **John Jewel** (1522-1571): Bishop of Salisbury, defender of the English Reformation in *Apologia Ecclesiae Anglicanae* → English Reformation
3. **Edward VI** (1537-1553): Protestant king under whom English Reformation advanced significantly → Political Patrons
4. **Argula von Grumbach** (c. 1492-c. 1554): Bavarian noblewoman who publicly defended Luther; important female voice → Lutheran Circle
5. **Hans Tausen** (1494-1561): Danish reformer, "Danish Luther," organized by Bugenhagen → Scandinavian addition
6. **Peter Martyr Vermigli** (1499-1562): Italian reformer active in Strasbourg and England → Strasbourg/English

---

## II. Orphan Node Analysis

### Method
Cross-referenced all 65 enumerated persons against the 103 documented relationships to identify anyone without connections.

### Finding: No Orphans Detected

All 65 enumerated individuals appear in at least one relationship. The most connected nodes are:

| Person | Approximate Connections |
|--------|------------------------|
| Martin Luther | 20+ (central hub) |
| Philip Melanchthon | 10+ |
| John Calvin | 10+ |
| Erasmus of Rotterdam | 10+ |
| Huldrych Zwingli | 8+ |
| Heinrich Bullinger | 7+ |
| Thomas Cranmer | 7+ |

### Least Connected (but not orphans)

These figures have 1-2 connections each—valid but could benefit from additional relationship research:

- Caspar Cruciger the Elder (2 connections)
- Kaspar Megander (2 connections)
- Antoine Froment (2 connections)
- Rudolf Gwalther (3 connections—family + succession)

---

## III. ID Consistency Verification

### Naming Convention
All person IDs should follow: `person-{firstname}-{lastname}` in lowercase with hyphens.

### Verified Consistent IDs in Relationships Document

The relationships document uses these ID formats:
- `person-martin-luther` ✓
- `person-katharina-von-bora` ✓
- `person-erasmus-of-rotterdam` (or `person-erasmus`) ✓
- `person-pierre-robert-oliv%C3%A9tan` ⚠️ (URL encoding issue—should be `person-pierre-robert-olivetan`)

### ID Issues Found

1. **Olivétan encoding**: In relationships document, Olivétan appears as `person-pierre-robert-oliv%C3%A9tan` (line 77, 188). Should use ASCII-safe ID: `person-pierre-robert-olivetan`

2. **Recommended ID mapping for conversion**:
   - All diacritics should be removed or transliterated
   - Special characters should be converted to ASCII equivalents
   - Consistency: Müntzer → muntzer, Lefèvre → lefevre

---

## IV. Date Validation

### Methodology
Key dates cross-referenced against Encyclopedia Britannica, Oxford Dictionary of National Biography, and Stanford Encyclopedia of Philosophy.

### Dates Verified as Accurate ✓

| Person | Dates | Source |
|--------|-------|--------|
| Martin Luther | 1483-1546 | Britannica |
| John Calvin | 1509-1564 | Britannica |
| Huldrych Zwingli | 1484-1531 | Britannica |
| Erasmus | c. 1466-1536 | Britannica |
| Philip Melanchthon | 1497-1560 | Britannica |
| William Tyndale | c. 1494-1536 | ODNB |
| Thomas Cranmer | 1489-1556 | ODNB |

### Minor Date Uncertainties (Acceptable)

- **Thomas Bilney**: c. 1495-1531 (birth year approximate)
- **William Tyndale**: c. 1494-1536 (birth year approximate)
- **Conrad Grebel**: c. 1498-1526 (birth year approximate)
- **Balthasar Hubmaier**: c. 1480-1528 (birth year approximate)
- **Thomas Müntzer**: c. 1489-1525 (birth year approximate)

These are standard scholarly approximations and do not require correction.

---

## V. Contested Historical Claims

### 1. Luther's 95 Theses Posting

**Claim**: Luther posted the Ninety-Five Theses on the Castle Church door on October 31, 1517.

**Status**: ⚠️ Debated but included

**Discussion**: The door-posting story comes from Melanchthon's 1546 account, written 29 years later. Some historians (e.g., Erwin Iserloh) argue Luther may have only sent the theses privately to Archbishop Albrecht. However, the traditional account remains widely accepted and is appropriate for a general historical network.

**Resolution**: Include with note that the precise manner of dissemination is debated.

### 2. "Here I Stand" at Diet of Worms

**Claim**: Luther said "Here I stand, I can do no other" at the Diet of Worms.

**Status**: ⚠️ Probably apocryphal

**Discussion**: The famous phrase does not appear in contemporary accounts but was added to printed versions later. Luther definitely refused to recant, and the phrase captures his stance, but it may not be a direct quotation.

**Resolution**: Include as representing Luther's stance; note likely apocryphal in evidence if used.

### 3. Calvin and Servetus

**Claim**: Calvin supported the execution of Michael Servetus for heresy (1553).

**Status**: ✓ Documented but complex

**Discussion**: Calvin did support Servetus's condemnation but reportedly preferred beheading over burning. This event is often cited to complicate Calvin's legacy. The network does not currently include Servetus as a node.

**Resolution**: If Servetus is added, include with nuanced evidence about Calvin's role.

### 4. Luther's Alleged Antisemitism

**Claim**: Luther wrote virulently against Jews in later works.

**Status**: ✓ Documented

**Discussion**: Luther's 1543 *On the Jews and Their Lies* contains extreme anti-Jewish polemic. This is not currently captured in the network (no Jewish figures included), but should be noted for completeness. This represents a significant negative aspect of Luther's legacy.

**Resolution**: Note in Luther's biography field during conversion; not a relationship per se.

---

## VI. Excluded Figures and Rationale

### Explicitly Excluded

| Figure | Dates | Reason for Exclusion |
|--------|-------|---------------------|
| Council of Trent participants | 1545-1563 | Counter-Reformation; beyond scope |
| Ignatius of Loyola | 1491-1556 | Counter-Reformation; Jesuit founder |
| Pope Leo X | 1475-1521 | Included only as implicit opponent; not enumerated |
| Pope Paul III | 1468-1549 | Counter-Reformation Council of Trent |
| Johann Tetzel | c. 1465-1519 | Minor figure; mainly known for indulgence controversy |
| Cardinal Wolsey | 1473-1530 | English politics; not primarily theological |
| Anne Boleyn | c. 1501-1536 | English politics; not a reformer herself |
| Scandinavian reformers | various | Geographic scope limitation |

### Considered but Deferred

| Figure | Dates | Reason | Priority for Addition |
|--------|-------|--------|----------------------|
| Johann von Staupitz | c. 1460-1524 | Luther's mentor | HIGH |
| Peter Martyr Vermigli | 1499-1562 | Italian reformer | HIGH |
| Jan Laski | 1499-1560 | Polish reformer in England | MEDIUM |
| Argula von Grumbach | c. 1492-c. 1554 | Female defender of Luther | HIGH |
| Hans Hut | d. 1527 | South German Anabaptist | MEDIUM |
| Thomas Wyttenbach | 1472-1526 | Teacher of Zwingli and Jud | MEDIUM |

---

## VII. Evidence Quality Assessment

### Overall Quality: STRONG

All 103 documented relationships include:
- ✅ Evidence description
- ✅ Source citation
- ✅ Strength rating (strong/moderate/weak/speculative)

### Evidence Breakdown by Strength

| Strength | Count | Percentage |
|----------|-------|------------|
| Strong | ~75 | 73% |
| Moderate | ~23 | 22% |
| Weak | ~3 | 3% |
| Speculative | ~2 | 2% |

### Sources Used

Primary sources:
- Foxe's *Actes and Monuments*
- Luther's works (various editions)
- Calvin's *Institutes* and correspondence
- Knox's *History of the Reformation in Scotland*

Secondary sources:
- Brecht, Martin. *Martin Luther* (3 vols.)
- MacCulloch, Diarmaid. *Thomas Cranmer*
- Gordon, Bruce. *The Swiss Reformation*
- Parker, T.H.L. *John Calvin*
- Snyder, C. Arnold. *Anabaptist History and Theology*

Reference works:
- Oxford Dictionary of National Biography
- Encyclopedia Britannica
- Stanford Encyclopedia of Philosophy

---

## VIII. Known Limitations

### 1. Temporal Scope Extensions
The following figures extend beyond the primary 1483-1564 scope but are included due to direct connections to seed figures:
- Theodore Beza (d. 1605): Calvin's immediate successor
- John Knox (d. 1572): Founder of Scottish Kirk
- Heinrich Bullinger (d. 1575): Led Zurich for 44 years
- Matthew Parker (d. 1575): Elizabethan settlement consolidator

### 2. Counter-Reformation Boundary
Only direct opponents are included (Eck, Cajetan). The broader Catholic reform movement (Trent, Jesuits) is excluded. This is a deliberate scope decision to keep focus on Protestant networks.

### 3. Radical Reformation Coverage
Six Anabaptist leaders are included, representing major streams (Swiss Brethren, Mennonites). Many others could be added if scope were expanded. Spiritualists and apocalyptic radicals are largely excluded.

### 4. Gender Representation
Four women are included:
- Katharina von Bora (Luther's wife)
- Katharina Schütz Zell (Strasbourg reformer)
- Marie Dentière (Geneva reformer)
- Marguerite of Navarre (patron)

This is likely underrepresentation given women's actual roles, but reflects source limitations. Consider adding Argula von Grumbach.

### 5. Geographic Gaps
- Scandinavia largely excluded (scope decision)
- Eastern Europe (Poland, Hungary) largely excluded
- Italy limited to opponents and Vermigli could be added

---

## IX. Research Gaps Remaining

### High Priority

1. **Bucer ↔ Melanchthon**: Both attempted to mediate Lutheran-Reformed tensions; their correspondence and relationship need fuller documentation.

2. **Women reformers' connections**: Did Katharina Schütz Zell, Marie Dentière, and Katharina von Bora know each other or correspond? Sources unclear.

3. **Hubmaier ↔ Zwingli**: Need clearer documentation of their relationship before Hubmaier's turn to Anabaptism.

### Medium Priority

4. **Beza's network**: Beza's extensive correspondence with English and Scottish reformers needs fuller documentation.

5. **Printer connections**: Hans Lufft, Johann Froben, and other printers' relationships to reformers could be expanded.

6. **Student networks**: Who else studied under Melanchthon? Luther? Could add educational relationships.

### Low Priority

7. **Scandinavian connections**: If scope expands, Bugenhagen's church organization in Denmark would be important.

8. **Second-generation relationships**: Connections between Calvin's successors and post-1564 developments.

---

## X. Validation Checklist

- [x] All dates validated against reliable sources
- [x] All relationships have evidence citations
- [x] Speculative claims are flagged and sourced (2 speculative relationships)
- [x] No obvious major figures are missing (recommend 6 additions)
- [x] Subgroups are reasonably balanced
- [x] Size is within bounds (65 people; well under 200 max)
- [x] No orphan nodes
- [ ] **Pending**: Count discrepancy needs correction in progress.md
- [ ] **Pending**: ID encoding issue for Olivétan needs standardization

---

## XI. Recommendations for Conversion

### Prior to Phase 6 (Conversion to JSON)

1. **Correct counts** in progress.md and 02-enumeration.md summary statistics to reflect actual 65 people

2. **Standardize IDs**:
   - Remove diacritics: Müntzer → muntzer, Lefèvre → lefevre, Olivétan → olivetan
   - Use consistent lowercase-hyphenated format

3. **Consider additions**: If time permits, add 3-6 recommended figures to strengthen the network

4. **Add custom relationship type**: `patron_of` is used but should be documented in manifest.json

### Conversion Notes

- All 65 people should become `type: "person"` nodes
- All 48 objects should become `type: "object"` nodes
- All 53 locations should become `type: "location"` nodes
- All 31 entities should become `type: "entity"` nodes
- All 103 relationships should become edges with evidence
- Additional edges needed for person ↔ object, person ↔ location, person ↔ entity relationships

---

## XII. Phase 5 Completion Status

**Status**: ✅ COMPLETE

All Phase 5 tasks have been addressed:
- [x] Review all enumerated individuals for completeness
- [x] Verify all edge source/target IDs exist
- [x] Check for orphan nodes
- [x] Identify missing evidence
- [x] Document contested claims
- [x] Note excluded figures and rationale
- [x] Document in 07-review-notes.md

**Ready for**: Phase 6 (Conversion to Graph Schema)
