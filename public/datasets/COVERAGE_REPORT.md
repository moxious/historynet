# Dataset Coverage Analysis Report

Generated: 2026-01-30T13:13:43.283Z

## 1. Per-Dataset Statistics

| Dataset | Total Nodes | With WikidataId | With WikipediaTitle | With Neither | Wikidata % | Wikipedia % | Neither % |
|---------|-------------|-----------------|---------------------|--------------|------------|-------------|-----------|
| ai-llm-research | 200 | 164 | 164 | 36 | 82.00% | 82.00% | 18.00% |
| ambient-music | 209 | 176 | 195 | 14 | 84.21% | 93.30% | 6.70% |
| christian-kabbalah | 53 | 47 | 47 | 6 | 88.68% | 88.68% | 11.32% |
| cybernetics-information-theory | 176 | 147 | 165 | 11 | 83.52% | 93.75% | 6.25% |
| enlightenment | 204 | 160 | 181 | 23 | 78.43% | 88.73% | 11.27% |
| florentine-academy | 50 | 46 | 46 | 4 | 92.00% | 92.00% | 8.00% |
| protestant-reformation | 180 | 142 | 172 | 8 | 78.89% | 95.56% | 4.44% |
| renaissance-humanism | 198 | 121 | 159 | 39 | 61.11% | 80.30% | 19.70% |
| rosicrucian-network | 112 | 73 | 87 | 25 | 65.18% | 77.68% | 22.32% |
| scientific-revolution | 51 | 51 | 51 | 0 | 100.00% | 100.00% | 0.00% |
| speculative-freemasonry | 27 | 17 | 19 | 8 | 62.96% | 70.37% | 29.63% |
| statistics-social-physics | 51 | 50 | 51 | 0 | 98.04% | 100.00% | 0.00% |

## 2. Cross-Dataset Entity Analysis

### Entities Appearing in Multiple Datasets

Total entities with WikidataId appearing in 2+ datasets: **44**

### Top 10 Entities by Dataset Appearances

| Rank | WikidataId | Label | Appears in # Datasets | Datasets |
|------|------------|-------|----------------------|----------|
| 1 | Q84 | location-london | 8 | ai-llm-research, ambient-music, enlightenment, protestant-reformation, renaissance-humanism, rosicrucian-network, scientific-revolution, speculative-freemasonry |
| 2 | Q90 | location-paris | 7 | ai-llm-research, ambient-music, christian-kabbalah, enlightenment, protestant-reformation, renaissance-humanism, scientific-revolution |
| 3 | Q2044 | location-florence | 4 | christian-kabbalah, florentine-academy, renaissance-humanism, scientific-revolution |
| 4 | Q220 | location-rome | 4 | christian-kabbalah, protestant-reformation, renaissance-humanism, scientific-revolution |
| 5 | Q35794 | location-cambridge | 4 | cybernetics-information-theory, enlightenment, protestant-reformation, renaissance-humanism |
| 6 | Q490 | loc-milan | 3 | ambient-music, enlightenment, renaissance-humanism |
| 7 | Q935 | person-isaac-newton | 3 | enlightenment, scientific-revolution, speculative-freemasonry |
| 8 | Q23436 | location-edinburgh | 3 | enlightenment, protestant-reformation, speculative-freemasonry |
| 9 | Q209842 | location-sorbonne | 3 | enlightenment, protestant-reformation, renaissance-humanism |
| 10 | Q123885 | location-royal-society | 3 | enlightenment, scientific-revolution, speculative-freemasonry |

### Additional Cross-Dataset Entities (showing 11-20)

| Rank | WikidataId | Label | Appears in # Datasets | Datasets |
|------|------------|-------|----------------------|----------|
| 11 | Q78 | location-basel | 3 | protestant-reformation, renaissance-humanism, rosicrucian-network |
| 12 | Q60 | location-new-york | 2 | ai-llm-research, ambient-music |
| 13 | Q41506 | location-stanford | 2 | ai-llm-research, cybernetics-information-theory |
| 14 | Q190080 | location-cmu | 2 | ai-llm-research, cybernetics-information-theory |
| 15 | Q1490 | location-tokyo | 2 | ai-llm-research, ambient-music |
| 16 | Q64 | loc-berlin | 2 | ambient-music, enlightenment |
| 17 | Q365 | loc-cologne | 2 | ambient-music, christian-kabbalah |
| 18 | Q83428 | person-paracelsus | 2 | christian-kabbalah, rosicrucian-network |
| 19 | Q641 | location-venice | 2 | christian-kabbalah, renaissance-humanism |
| 20 | Q202660 | entity-college-de-france | 2 | christian-kabbalah, renaissance-humanism |

### Cross-Dataset Entity Distribution

| Appears in # Datasets | Entity Count |
|----------------------|--------------|
| 8 | 1 |
| 7 | 1 |
| 4 | 3 |
| 3 | 6 |
| 2 | 33 |

## 3. Summary Statistics

### Overall Coverage

- **Total Nodes Across All Datasets:** 1,511
- **Nodes with WikidataId:** 1,194 (79.02%)
- **Nodes with WikipediaTitle:** 1,337 (88.48%)
- **Nodes with Neither Identifier:** 174 (11.52%)

### Best Wikidata Coverage (Top 5)

| Dataset | Coverage | Nodes |
|---------|----------|-------|
| scientific-revolution | 100% | 51/51 |
| statistics-social-physics | 98.04% | 50/51 |
| florentine-academy | 92% | 46/50 |
| christian-kabbalah | 88.68% | 47/53 |
| ambient-music | 84.21% | 176/209 |

### Worst Wikidata Coverage (Bottom 5)

| Dataset | Coverage | Nodes |
|---------|----------|-------|
| renaissance-humanism | 61.11% | 121/198 |
| speculative-freemasonry | 62.96% | 17/27 |
| rosicrucian-network | 65.18% | 73/112 |
| enlightenment | 78.43% | 160/204 |
| protestant-reformation | 78.89% | 142/180 |

### Cross-Dataset Link Potential

- **Unique entities appearing in 2+ datasets:** 44
- **Estimated cross-dataset links:** 118
  - This represents entity pairs that could be connected across different datasets
  - Formula: For each entity appearing in N datasets, N×(N-1)/2 potential links

### M29/M30 Implementation Readiness

**Status: ✅ Ready for Implementation**

#### Strengths:
1. **Strong Wikidata Coverage:** 79.0% of all nodes have WikidataId
2. **Significant Cross-Dataset Overlap:** 44 entities appear across multiple datasets
3. **High-Value Entities:** Top entities appear in up to 8 datasets
4. **Consistent Entity Distribution:** Cross-dataset entities are well distributed

#### Recommendations:
1. **Primary Strategy:** Use WikidataId as the primary entity matching mechanism
2. **Fallback Strategy:** Implement fuzzy matching on `label` for the 11.5% of nodes without identifiers
3. **Testing Focus:** Prioritize datasets with best coverage (scientific-revolution, statistics-social-physics)
4. **Performance:** With 118 potential links, consider pagination/lazy loading

#### Estimated Impact:
- Cross-dataset navigation will work for **1,194 nodes** (79.0%)
- Users will discover connections across **12 datasets**
- High-value entities (appearing in 3+ datasets): **11**

---

*This report validates that the current dataset structure supports M29 (Cross-Dataset Entity Discovery) and M30 (Cross-Dataset Navigation) milestones.*
