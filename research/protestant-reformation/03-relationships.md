# Protestant Reformation - Relationships

**Date**: 2026-01-18
**Last Updated**: 2026-01-18
**Purpose**: Document relationships between individuals in the Protestant Reformation network with evidence.

---

## Relationship Types Used

Per GRAPH_SCHEMA.md, this document uses these relationship types:

| Type | Directed | Description |
|------|----------|-------------|
| `influenced` | Yes | Source influenced target's thinking/work |
| `influenced_by` | Yes | Source was influenced by target |
| `collaborated_with` | No | Worked together on a project/work |
| `taught` | Yes | Source taught target |
| `studied_under` | Yes | Source studied under target |
| `corresponded_with` | No | Exchanged letters/communication |
| `knows` | No | General acquaintance/connection |
| `related_to` | No | Family or personal relationship |
| `opposed` | No | Intellectual or personal opposition |
| `succeeded` | Yes | Source succeeded target in a role |
| `patron_of` | Yes | Patron provided protection/support to reformer |

---

## Evidence Standards

All relationships documented with:
- **Source**: The person initiating/providing (for directed relationships)
- **Target**: The person receiving/affected
- **Type**: Relationship type from schema
- **Dates**: When the relationship was active
- **Evidence**: Description of evidence for this relationship
- **Sources**: Citations to primary/secondary sources
- **Strength**: strong / moderate / weak / speculative

---

## I. Family Relationships

### 1. Luther ↔ Katharina von Bora
- **Source**: person-martin-luther
- **Target**: person-katharina-von-bora
- **Type**: related_to
- **Subtype**: spouse
- **Dates**: 1525-1546 (Luther's death)
- **Evidence**: Martin Luther and Katharina von Bora were married on June 13, 1525, in Wittenberg. Johannes Bugenhagen performed the ceremony. The marriage was a public statement supporting clerical marriage and produced six children.
- **Sources**: Brecht, Martin. *Martin Luther: Shaping and Defining the Reformation* (1990); Primary: Luther's Table Talk
- **Strength**: strong

### 2. Reuchlin ↔ Melanchthon
- **Source**: person-johannes-reuchlin
- **Target**: person-philip-melanchthon
- **Type**: related_to
- **Subtype**: great-uncle/great-nephew
- **Dates**: 1497-1522 (Reuchlin's death)
- **Evidence**: Reuchlin was Melanchthon's great-uncle. Melanchthon's mother was Reuchlin's niece. Reuchlin supported and encouraged young Melanchthon's education and gave him the surname "Melanchthon" (Greek for his German name Schwarzerdt).
- **Sources**: Scheible, Heinz. *Melanchthon: Eine Biographie* (1997)
- **Strength**: strong

### 3. Zwingli ↔ Rudolf Gwalther
- **Source**: person-huldrych-zwingli
- **Target**: person-rudolf-gwalther
- **Type**: related_to
- **Subtype**: father-in-law/son-in-law
- **Dates**: married to Zwingli's daughter Regula
- **Evidence**: Rudolf Gwalther married Zwingli's daughter Regula, making him Zwingli's son-in-law. This family connection strengthened the continuity of Zurich's Reformed church.
- **Sources**: Gordon, Bruce. *The Swiss Reformation* (2002)
- **Strength**: strong

### 4. Calvin ↔ Pierre Robert Olivétan
- **Source**: person-john-calvin
- **Target**: person-pierre-robert-oliv%C3%A9tan
- **Type**: related_to
- **Subtype**: cousins
- **Dates**: lifelong (until Olivétan's death 1538)
- **Evidence**: Calvin and Olivétan were cousins. Olivétan may have introduced Calvin to Reformed ideas while they were young. Calvin wrote the Latin preface to Olivétan's 1535 French Bible translation.
- **Sources**: Parker, T.H.L. *John Calvin: A Biography* (1975); Cottret, Bernard. *Calvin: A Biography* (2000)
- **Strength**: strong

### 5. Katharina Schütz Zell ↔ Matthew Zell
- **Source**: person-katharina-schutz-zell
- **Target**: person-matthew-zell
- **Type**: related_to
- **Subtype**: spouse
- **Dates**: 1523-1548 (Matthew Zell's death)
- **Evidence**: Katharina married priest Matthew Zell in 1523, one of the first clerical marriages in Strasbourg. She became an active reformer in her own right, writing theological defenses and caring for refugees.
- **Sources**: McKee, Elsie Anne. *Katharina Schütz Zell: The Life and Thought of a Sixteenth-Century Reformer* (1999)
- **Strength**: strong

### 6. Marie Dentière ↔ Antoine Froment
- **Source**: person-marie-dentiere
- **Target**: person-antoine-froment
- **Type**: related_to
- **Subtype**: spouse
- **Dates**: c. 1528 onward
- **Evidence**: Marie Dentière married Antoine Froment, fellow Geneva reformer, after the death of her first husband. Both were active in Geneva's early Reformation.
- **Sources**: Head, Thomas. *Marie Dentière: A Propagandist for the Reform* in *Women Writers of the Renaissance and Reformation* (1987)
- **Strength**: strong

### 7. Frederick the Wise ↔ John the Steadfast
- **Source**: person-frederick-the-wise
- **Target**: person-john-the-steadfast
- **Type**: related_to
- **Subtype**: brothers
- **Dates**: lifelong (Frederick d. 1525)
- **Evidence**: John the Steadfast was Frederick the Wise's brother and successor as Elector of Saxony. John openly embraced Lutheranism upon becoming Elector.
- **Sources**: Schwiebert, Ernest. *Luther and His Times* (1950)
- **Strength**: strong

### 8. John the Steadfast ↔ John Frederick I
- **Source**: person-john-the-steadfast
- **Target**: person-john-frederick-i
- **Type**: related_to
- **Subtype**: father/son
- **Dates**: lifelong (John d. 1532)
- **Evidence**: John Frederick I was the son and successor of John the Steadfast as Elector of Saxony, continuing Lutheran political leadership until his defeat at Mühlberg (1547).
- **Sources**: Haile, H.G. *Luther: An Experiment in Biography* (1980)
- **Strength**: strong

### 9. Marguerite of Navarre ↔ Francis I (implicit)
- **Note**: Francis I of France (Marguerite's brother) is not enumerated in the network but is important context. Marguerite used her influence with him to protect reformers.
- **Strength**: (contextual note only)

---

## II. Teacher-Student Relationships

### 10. Erasmus → Luther (early intellectual influence)
- **Source**: person-erasmus-of-rotterdam
- **Target**: person-martin-luther
- **Type**: influenced
- **Dates**: 1516-1524 (before their public break)
- **Evidence**: Luther studied Erasmus's Greek New Testament (1516) and drew on humanist philological methods for his theology. Luther initially hoped for Erasmus's support. The relationship broke over the free will controversy in 1524.
- **Sources**: Brecht, Martin. *Martin Luther* (1985-1993); Erasmus's *De libero arbitrio* (1524); Luther's *De servo arbitrio* (1525)
- **Strength**: strong

### 11. Erasmus → Zwingli
- **Source**: person-erasmus-of-rotterdam
- **Target**: person-huldrych-zwingli
- **Type**: influenced
- **Dates**: c. 1516-1522
- **Evidence**: Zwingli was deeply influenced by Erasmus's biblical humanism and studied his Greek New Testament. They corresponded and may have met at Basel. Zwingli later moved beyond Erasmus toward more radical reform.
- **Sources**: Potter, G.R. *Zwingli* (1976); Gordon, Bruce. *The Swiss Reformation* (2002)
- **Strength**: strong

### 12. Thomas Wyttenbach → Zwingli and Leo Jud
- **Note**: Thomas Wyttenbach (not enumerated but important) taught both Zwingli and Leo Jud at Basel, introducing them to critical biblical study. Consider adding as edge note.
- **Source**: (implicit common teacher)
- **Target**: person-huldrych-zwingli, person-leo-jud
- **Evidence**: Both Zwingli and Jud studied under Thomas Wyttenbach at Basel, where they learned biblical humanism. This shared educational background connected them before Zurich.
- **Sources**: Potter, G.R. *Zwingli* (1976)
- **Strength**: strong

### 13. Melanchthon → Patrick Hamilton
- **Source**: person-philip-melanchthon
- **Target**: person-patrick-hamilton
- **Type**: taught
- **Dates**: c. 1527
- **Evidence**: Patrick Hamilton studied at the University of Marburg and absorbed Lutheran theology there, likely attending lectures by or interacting with Melanchthon-influenced faculty. His "Patrick's Places" shows Lutheran influence.
- **Sources**: Cameron, James K. *Patrick Hamilton* in *ODNB*; Ryrie, Alec. *The Origins of the Scottish Reformation* (2006)
- **Strength**: moderate

### 14. Luther → Barnes
- **Source**: person-martin-luther
- **Target**: person-robert-barnes
- **Type**: influenced
- **Dates**: 1530s
- **Evidence**: Robert Barnes visited Wittenberg multiple times, became friends with Luther, and was influenced by Lutheran theology. He acted as diplomatic intermediary between England and Lutheran Germany.
- **Sources**: Tjernagel, Neelak. *Henry VIII and the Lutherans* (1965); Clebsch, W.A. *England's Earliest Protestants* (1964)
- **Strength**: strong

### 15. Bucer → Calvin
- **Source**: person-martin-bucer
- **Target**: person-john-calvin
- **Type**: taught
- **Dates**: 1538-1541
- **Evidence**: Calvin spent his Strasbourg exile (1538-1541) under Bucer's mentorship. Bucer influenced Calvin's ecclesiology, his understanding of church discipline, and his pastoral practice. Calvin called Bucer "that most excellent servant of Christ."
- **Sources**: Stephens, W.P. *The Holy Spirit in the Theology of Martin Bucer* (1970); Parker, T.H.L. *John Calvin: A Biography* (1975)
- **Strength**: strong

### 16. Capito and Bucer → Olivétan (Hebrew instruction)
- **Source**: person-wolfgang-capito
- **Target**: person-pierre-robert-oliv%C3%A9tan
- **Type**: taught
- **Dates**: early 1530s
- **Evidence**: Olivétan studied Hebrew under Capito (and possibly Bucer) in Strasbourg, equipping him for his translation of the Old Testament into French.
- **Sources**: Higman, Francis. *Lire et découvrir: la circulation des idées au temps de la Réforme* (1998)
- **Strength**: moderate

### 17. Bilney → Latimer
- **Source**: person-thomas-bilney
- **Target**: person-hugh-latimer
- **Type**: influenced
- **Dates**: c. 1524
- **Evidence**: Thomas Bilney converted Hugh Latimer to evangelical views at Cambridge, reportedly by asking Latimer to hear his confession. Latimer later became one of England's greatest Protestant preachers.
- **Sources**: Foxe, John. *Actes and Monuments* (1563); MacCulloch, Diarmaid. *Thomas Cranmer* (1996)
- **Strength**: strong

### 18. Wishart → Knox
- **Source**: person-george-wishart
- **Target**: person-john-knox
- **Type**: taught
- **Dates**: 1545-1546
- **Evidence**: John Knox served as George Wishart's bodyguard and disciple in 1545-1546, carrying a two-handed sword to protect him. Wishart's execution (1546) was formative for Knox's career.
- **Sources**: Dawson, Jane. *John Knox* (2015); Knox's own *History of the Reformation in Scotland*
- **Strength**: strong

### 19. Patrick Hamilton → Wishart (indirect influence)
- **Source**: person-patrick-hamilton
- **Target**: person-george-wishart
- **Type**: influenced
- **Dates**: 1528 → 1540s
- **Evidence**: Hamilton's martyrdom (1528) inspired subsequent Scottish reformers including Wishart. His "Patrick's Places" circulated as a summary of Protestant doctrine.
- **Sources**: Ryrie, Alec. *The Origins of the Scottish Reformation* (2006)
- **Strength**: moderate

### 20. Calvin → Knox
- **Source**: person-john-calvin
- **Target**: person-john-knox
- **Type**: influenced
- **Dates**: 1554-1559 (Knox's Geneva exile)
- **Evidence**: Knox spent time in Geneva (1554-1555, 1556-1559) and was profoundly influenced by Calvin's Reformed theology and church organization. Knox called Geneva "the most perfect school of Christ that ever was in the earth since the days of the apostles."
- **Sources**: Dawson, Jane. *John Knox* (2015); Knox's correspondence
- **Strength**: strong

---

## III. Succession Relationships

### 21. Zwingli → Bullinger
- **Source**: person-huldrych-zwingli
- **Target**: person-heinrich-bullinger
- **Type**: succeeded
- **Dates**: 1531
- **Evidence**: Heinrich Bullinger succeeded Zwingli as Antistes (chief pastor) of Zurich after Zwingli's death at the Battle of Kappel (October 11, 1531). Bullinger led the Zurich church for 44 years.
- **Sources**: Gordon, Bruce. *The Swiss Reformation* (2002); Büsser, Fritz. *Heinrich Bullinger* (2004)
- **Strength**: strong

### 22. Calvin → Beza
- **Source**: person-john-calvin
- **Target**: person-theodore-beza
- **Type**: succeeded
- **Dates**: 1564
- **Evidence**: Theodore Beza succeeded Calvin as moderator of the Company of Pastors in Geneva after Calvin's death (May 27, 1564). Beza led the Genevan church until his own death in 1605.
- **Sources**: Baird, Henry M. *Theodore Beza* (1899); Manetsch, Scott M. *Theodore Beza and the Quest for Peace in France* (2000)
- **Strength**: strong

### 23. Bullinger → Gwalther
- **Source**: person-heinrich-bullinger
- **Target**: person-rudolf-gwalther
- **Type**: succeeded
- **Dates**: 1575
- **Evidence**: Rudolf Gwalther succeeded Bullinger as Antistes of Zurich upon Bullinger's death in 1575, continuing the Zwinglian Reformed tradition.
- **Sources**: Gordon, Bruce. *The Swiss Reformation* (2002)
- **Strength**: strong

### 24. Frederick the Wise → John the Steadfast
- **Source**: person-frederick-the-wise
- **Target**: person-john-the-steadfast
- **Type**: succeeded
- **Dates**: 1525
- **Evidence**: John the Steadfast succeeded his brother Frederick the Wise as Elector of Saxony in 1525. Unlike Frederick, John openly embraced Lutheranism.
- **Sources**: Schwiebert, Ernest. *Luther and His Times* (1950)
- **Strength**: strong

### 25. John the Steadfast → John Frederick I
- **Source**: person-john-the-steadfast
- **Target**: person-john-frederick-i
- **Type**: succeeded
- **Dates**: 1532
- **Evidence**: John Frederick I succeeded his father John the Steadfast as Elector of Saxony in 1532, leading the Protestant Schmalkaldic League until his defeat in 1547.
- **Sources**: Brady, Thomas A. *Protestant Politics* (1995)
- **Strength**: strong

---

## IV. Collaborations

### Core Wittenberg Circle

### 26. Luther ↔ Melanchthon
- **Source**: person-martin-luther
- **Target**: person-philip-melanchthon
- **Type**: collaborated_with
- **Dates**: 1518-1546 (Luther's death)
- **Evidence**: Luther and Melanchthon were the two central figures of Wittenberg theology for nearly 30 years. Melanchthon arrived in Wittenberg in 1518 and became Luther's closest collaborator. They co-authored works, Melanchthon systematized Lutheran theology (Loci Communes), and drafted the Augsburg Confession.
- **Sources**: Kolb, Robert. *Martin Luther and the Enduring Word of God* (2016); Scheible, Heinz. *Melanchthon* (1997)
- **Strength**: strong

### 27. Luther ↔ Bugenhagen
- **Source**: person-martin-luther
- **Target**: person-johannes-bugenhagen
- **Type**: collaborated_with
- **Dates**: 1521-1546
- **Evidence**: Bugenhagen was Luther's pastor and confessor, and Luther's parish minister at Wittenberg. Bugenhagen married Luther and Katharina (1525), baptized their children, and preached Luther's funeral sermon (1546).
- **Sources**: Brecht, Martin. *Martin Luther* (1990); Gummelt, Volker. *Johannes Bugenhagen* (2017)
- **Strength**: strong

### 28. Luther ↔ Jonas
- **Source**: person-martin-luther
- **Target**: person-justus-jonas
- **Type**: collaborated_with
- **Dates**: 1521-1546
- **Evidence**: Justus Jonas was a key member of the Wittenberg faculty who translated Luther's and Melanchthon's Latin works into German, making them accessible to laypeople. He was present at Luther's death in Eisleben (1546).
- **Sources**: Kolb, Robert. *Martin Luther* (2009)
- **Strength**: strong

### 29. Luther ↔ Spalatin
- **Source**: person-martin-luther
- **Target**: person-georg-spalatin
- **Type**: collaborated_with
- **Dates**: 1514-1545
- **Evidence**: Spalatin was the crucial intermediary between Luther and Elector Frederick the Wise. He served as Frederick's secretary and chaplain, explaining Luther's theology to the elector and helping secure Luther's protection.
- **Sources**: Höss, Irmgard. *Georg Spalatin* (1956)
- **Strength**: strong

### 30. Luther ↔ Cranach
- **Source**: person-martin-luther
- **Target**: person-lucas-cranach
- **Type**: collaborated_with
- **Dates**: 1520s-1546
- **Evidence**: Lucas Cranach the Elder was Luther's close friend and collaborator. He created the visual imagery of the Reformation through portraits of Luther, Katharina, and other reformers, woodcuts, and altarpieces. His workshop also printed Lutheran materials.
- **Sources**: Koerner, Joseph Leo. *The Reformation of the Image* (2004)
- **Strength**: strong

### 31. Melanchthon ↔ Bugenhagen
- **Source**: person-philip-melanchthon
- **Target**: person-johannes-bugenhagen
- **Type**: collaborated_with
- **Dates**: 1521-1558
- **Evidence**: Melanchthon and Bugenhagen were colleagues at Wittenberg, both part of the inner circle around Luther. They collaborated on church reforms and theological disputes.
- **Sources**: Scheible, Heinz. *Melanchthon* (1997)
- **Strength**: strong

### 32. Melanchthon ↔ Cruciger
- **Source**: person-philip-melanchthon
- **Target**: person-caspar-cruciger
- **Type**: collaborated_with
- **Dates**: 1520s-1548
- **Evidence**: Cruciger was a Wittenberg faculty member who collaborated with Melanchthon and Luther on the Bible translation and theological works.
- **Sources**: Kolb, Robert. *Bound Choice* (2005)
- **Strength**: moderate

### Zurich Circle

### 33. Zwingli ↔ Leo Jud
- **Source**: person-huldrych-zwingli
- **Target**: person-leo-jud
- **Type**: collaborated_with
- **Dates**: 1519-1531 (Zwingli's death)
- **Evidence**: Leo Jud and Zwingli were close friends from their student days under Wyttenbach at Basel. Jud came to Zurich in 1522 and served as pastor at St. Peter's, collaborating closely with Zwingli on the Reformation.
- **Sources**: Potter, G.R. *Zwingli* (1976); Gordon, Bruce. *The Swiss Reformation* (2002)
- **Strength**: strong

### 34. Zwingli ↔ Oecolampadius
- **Source**: person-huldrych-zwingli
- **Target**: person-johannes-oecolampadius
- **Type**: collaborated_with
- **Dates**: 1520s-1531
- **Evidence**: Zwingli and Oecolampadius (leader of the Basel Reformation) were allies on the symbolic understanding of the Eucharist against Luther. They worked together at the Marburg Colloquy (1529).
- **Sources**: Steinmetz, David C. *Reformers in the Wings* (2001)
- **Strength**: strong

### 35. Bullinger ↔ Leo Jud
- **Source**: person-heinrich-bullinger
- **Target**: person-leo-jud
- **Type**: collaborated_with
- **Dates**: 1531-1542 (Jud's death)
- **Evidence**: After Zwingli's death, Bullinger and Leo Jud continued to lead the Zurich Reformation together until Jud's death in 1542.
- **Sources**: Gordon, Bruce. *The Swiss Reformation* (2002)
- **Strength**: strong

### 36. Bullinger ↔ Megander
- **Source**: person-heinrich-bullinger
- **Target**: person-kaspar-megander
- **Type**: collaborated_with
- **Dates**: 1530s-1545
- **Evidence**: Megander was a defender of Zwinglian theology who worked with Bullinger in defending the Swiss Reformed position.
- **Sources**: Gordon, Bruce. *The Swiss Reformation* (2002)
- **Strength**: moderate

### Genevan Circle

### 37. Calvin ↔ Farel
- **Source**: person-john-calvin
- **Target**: person-guillaume-farel
- **Type**: collaborated_with
- **Dates**: 1536-1565 (Farel's death)
- **Evidence**: Farel famously persuaded Calvin to stay in Geneva in 1536, threatening God's judgment if he left. They were expelled together in 1538 and Calvin returned in 1541. They remained colleagues and correspondents throughout their careers.
- **Sources**: Parker, T.H.L. *John Calvin* (1975); Cottret, Bernard. *Calvin* (2000)
- **Strength**: strong

### 38. Calvin ↔ Viret
- **Source**: person-john-calvin
- **Target**: person-pierre-viret
- **Type**: collaborated_with
- **Dates**: 1536-1564
- **Evidence**: Pierre Viret was Calvin's close colleague, working with him and Farel in early Geneva. Viret led the Reformation in Lausanne but frequently collaborated with Calvin.
- **Sources**: Bruening, Michael W. *Calvinism's First Battleground: Conflict and Reform in the Pays de Vaud* (2005)
- **Strength**: strong

### 39. Calvin ↔ Beza
- **Source**: person-john-calvin
- **Target**: person-theodore-beza
- **Type**: collaborated_with
- **Dates**: 1549-1564 (Calvin's death)
- **Evidence**: Beza joined Calvin in Geneva and became rector of the Geneva Academy (1559). He was Calvin's closest associate in his final years and succeeded him.
- **Sources**: Manetsch, Scott M. *Calvin's Company of Pastors* (2013)
- **Strength**: strong

### 40. Farel ↔ Viret
- **Source**: person-guillaume-farel
- **Target**: person-pierre-viret
- **Type**: collaborated_with
- **Dates**: 1530s-1565
- **Evidence**: Farel and Viret worked together in the French-speaking Swiss Reformation, often called (with Calvin) the "triumvirate" of Geneva's reform.
- **Sources**: Naphy, William. *Calvin and the Consolidation of the Genevan Reformation* (1994)
- **Strength**: strong

### 41. Farel ↔ Froment
- **Source**: person-guillaume-farel
- **Target**: person-antoine-froment
- **Type**: collaborated_with
- **Dates**: 1530s
- **Evidence**: Froment worked alongside Farel in introducing the Reformation to Geneva in the early 1530s.
- **Sources**: Naphy, William. *Calvin and the Consolidation of the Genevan Reformation* (1994)
- **Strength**: moderate

### Strasbourg Circle

### 42. Bucer ↔ Capito
- **Source**: person-martin-bucer
- **Target**: person-wolfgang-capito
- **Type**: collaborated_with
- **Dates**: 1523-1541 (Capito's death)
- **Evidence**: Bucer and Capito were the two leading reformers in Strasbourg. They co-authored the Tetrapolitan Confession (1530) and worked together to establish the Strasbourg church.
- **Sources**: Burnett, Amy Nelson. *Teaching the Reformation* (2006)
- **Strength**: strong

### 43. Bucer ↔ Matthew Zell
- **Source**: person-martin-bucer
- **Target**: person-matthew-zell
- **Type**: collaborated_with
- **Dates**: 1520s-1548 (Zell's death)
- **Evidence**: Matthew Zell was one of the first Strasbourg priests to preach Protestant ideas. Bucer joined him in leading the Strasbourg Reformation.
- **Sources**: Chrisman, Miriam. *Strasbourg and the Reform* (1967)
- **Strength**: strong

### 44. Bucer ↔ Katharina Schütz Zell
- **Source**: person-martin-bucer
- **Target**: person-katharina-schutz-zell
- **Type**: knows
- **Dates**: 1520s-1548
- **Evidence**: Katharina Schütz Zell was an active participant in the Strasbourg reform circle, hosting refugees and writing theological works while her husband Matthew was alive and after his death.
- **Sources**: McKee, Elsie Anne. *Katharina Schütz Zell* (1999)
- **Strength**: moderate

### English Reformation Collaborations

### 45. Cranmer ↔ Ridley
- **Source**: person-thomas-cranmer
- **Target**: person-nicholas-ridley
- **Type**: collaborated_with
- **Dates**: 1530s-1555
- **Evidence**: Nicholas Ridley served as Cranmer's chaplain and collaborated closely with him on liturgical and doctrinal reform. They were martyred together as two of the "Oxford Martyrs."
- **Sources**: MacCulloch, Diarmaid. *Thomas Cranmer* (1996)
- **Strength**: strong

### 46. Cranmer ↔ Latimer
- **Source**: person-thomas-cranmer
- **Target**: person-hugh-latimer
- **Type**: collaborated_with
- **Dates**: 1530s-1555
- **Evidence**: Latimer was one of Cranmer's colleagues in the English Reformation, a powerful preacher under Edward VI. Both were Oxford Martyrs.
- **Sources**: MacCulloch, Diarmaid. *Thomas Cranmer* (1996)
- **Strength**: strong

### 47. Cranmer ↔ Cromwell
- **Source**: person-thomas-cranmer
- **Target**: person-thomas-cromwell
- **Type**: collaborated_with
- **Dates**: 1532-1540 (Cromwell's execution)
- **Evidence**: Cranmer and Cromwell were the two chief architects of Henry VIII's religious and political reformation. Cromwell handled the legal/administrative side while Cranmer managed the ecclesiastical.
- **Sources**: MacCulloch, Diarmaid. *Thomas Cranmer* (1996); Dickens, A.G. *Thomas Cromwell and the English Reformation* (1959)
- **Strength**: strong

### 48. Ridley ↔ Latimer
- **Source**: person-nicholas-ridley
- **Target**: person-hugh-latimer
- **Type**: collaborated_with
- **Dates**: 1540s-1555
- **Evidence**: Ridley and Latimer were fellow reformers under Edward VI and were burned at the stake together at Oxford on October 16, 1555. Latimer's famous words: "Be of good comfort, Master Ridley, and play the man."
- **Sources**: Foxe, John. *Actes and Monuments* (1563)
- **Strength**: strong

### 49. Tyndale ↔ Frith
- **Source**: person-william-tyndale
- **Target**: person-john-frith
- **Type**: collaborated_with
- **Dates**: 1520s-1533 (Frith's martyrdom)
- **Evidence**: John Frith was Tyndale's associate and assistant in exile. Frith wrote theological works and was captured and burned at Smithfield in 1533.
- **Sources**: Daniell, David. *William Tyndale* (1994)
- **Strength**: strong

### 50. Tyndale ↔ Coverdale
- **Source**: person-william-tyndale
- **Target**: person-miles-coverdale
- **Type**: collaborated_with
- **Dates**: 1520s-1535
- **Evidence**: Coverdale worked with Tyndale on Bible translation and used Tyndale's work extensively in producing the first complete printed English Bible (1535).
- **Sources**: Daniell, David. *The Bible in English* (2003)
- **Strength**: strong

### 51. Coverdale ↔ Cromwell
- **Source**: person-miles-coverdale
- **Target**: person-thomas-cromwell
- **Type**: collaborated_with
- **Dates**: 1535-1540
- **Evidence**: Cromwell patronized and protected Coverdale's Bible translation work, securing royal license for the Great Bible (1539).
- **Sources**: Dickens, A.G. *The English Reformation* (1964)
- **Strength**: strong

### 52. Cranmer ↔ Bucer
- **Source**: person-thomas-cranmer
- **Target**: person-martin-bucer
- **Type**: collaborated_with
- **Dates**: 1549-1551 (Bucer's death)
- **Evidence**: Bucer came to England in 1549 at Cranmer's invitation after being exiled from Strasbourg. He was appointed Regius Professor of Divinity at Cambridge and influenced the 1552 Book of Common Prayer through his *Censura*.
- **Sources**: MacCulloch, Diarmaid. *Thomas Cranmer* (1996); Stephens, W.P. *Martin Bucer* (2009)
- **Strength**: strong

### Swiss Brethren (Anabaptist) Collaboration

### 53. Grebel ↔ Manz
- **Source**: person-conrad-grebel
- **Target**: person-felix-manz
- **Type**: collaborated_with
- **Dates**: 1523-1526 (Grebel's death)
- **Evidence**: Conrad Grebel and Felix Manz were co-founders of the Swiss Brethren (Anabaptists), breaking with Zwingli in 1523-1524 over infant baptism. They performed the first adult rebaptism on January 21, 1525.
- **Sources**: Snyder, C. Arnold. *Anabaptist History and Theology* (1995)
- **Strength**: strong

### 54. Grebel ↔ Blaurock
- **Source**: person-conrad-grebel
- **Target**: person-george-blaurock
- **Type**: collaborated_with
- **Dates**: 1525-1526
- **Evidence**: George Blaurock was baptized by Grebel at the founding of the Swiss Brethren (January 21, 1525) and became a missionary for the movement.
- **Sources**: Snyder, C. Arnold. *Anabaptist History and Theology* (1995)
- **Strength**: strong

### 55. Manz ↔ Blaurock
- **Source**: person-felix-manz
- **Target**: person-george-blaurock
- **Type**: collaborated_with
- **Dates**: 1525-1527 (Manz's execution)
- **Evidence**: Manz and Blaurock were fellow Anabaptist leaders in the early Swiss Brethren movement, arrested and released together multiple times.
- **Sources**: Snyder, C. Arnold. *Anabaptist History and Theology* (1995)
- **Strength**: strong

### Christian Humanist Collaboration

### 56. Erasmus ↔ Thomas More
- **Source**: person-erasmus-of-rotterdam
- **Target**: person-thomas-more
- **Type**: collaborated_with
- **Dates**: 1499-1535 (More's execution)
- **Evidence**: Erasmus and More were close friends from 1499 when Erasmus visited England. Erasmus wrote *The Praise of Folly* (1509) at More's home. Their correspondence lasted decades.
- **Sources**: Marius, Richard. *Thomas More* (1984); McConica, James. *Erasmus* (1991)
- **Strength**: strong

### 57. Erasmus ↔ John Colet
- **Source**: person-erasmus-of-rotterdam
- **Target**: person-john-colet
- **Type**: collaborated_with
- **Dates**: 1499-1519 (Colet's death)
- **Evidence**: Erasmus met Colet at Oxford in 1499. Colet's lectures on Paul inspired Erasmus to pursue biblical scholarship. They remained friends and correspondents until Colet's death.
- **Sources**: McConica, James. *Erasmus* (1991)
- **Strength**: strong

### 58. More ↔ Colet
- **Source**: person-thomas-more
- **Target**: person-john-colet
- **Type**: knows
- **Dates**: 1499-1519
- **Evidence**: More and Colet were part of the same English humanist circle with Erasmus. More considered entering the clergy and was influenced by Colet's piety.
- **Sources**: Marius, Richard. *Thomas More* (1984)
- **Strength**: moderate

### 59. Lefèvre d'Étaples ↔ Briçonnet
- **Source**: person-jacques-lefevre-detaples
- **Target**: person-guillaume-briconnet
- **Type**: collaborated_with
- **Dates**: 1520s
- **Evidence**: Lefèvre d'Étaples was part of Bishop Briçonnet's reform circle at Meaux, attempting evangelical reform within the Catholic Church. The "Meaux Circle" was suppressed after 1525.
- **Sources**: Bentley, Jerry H. *Humanists and Holy Writ* (1983)
- **Strength**: strong

### 60. Lefèvre d'Étaples → Farel
- **Source**: person-jacques-lefevre-detaples
- **Target**: person-guillaume-farel
- **Type**: influenced
- **Dates**: 1520s
- **Evidence**: Farel was initially part of Lefèvre's Meaux Circle before moving toward more radical reform. Lefèvre's biblical humanism influenced Farel's early development.
- **Sources**: Bentley, Jerry H. *Humanists and Holy Writ* (1983)
- **Strength**: strong

### 61. Marguerite of Navarre ↔ Lefèvre d'Étaples
- **Source**: person-marguerite-of-navarre
- **Target**: person-jacques-lefevre-detaples
- **Type**: patron_of
- **Dates**: 1520s-1536
- **Evidence**: Marguerite protected Lefèvre and other reformers, using her influence as sister of King Francis I. Lefèvre spent his final years at her court.
- **Sources**: Bentley, Jerry H. *Humanists and Holy Writ* (1983); Blaisdell, Charmarie. "Marguerite of Navarre" in *Women of the Reformation* (1971)
- **Strength**: strong

### 62. Marguerite of Navarre ↔ Marot
- **Source**: person-marguerite-of-navarre
- **Target**: person-clement-marot
- **Type**: patron_of
- **Dates**: 1520s-1544
- **Evidence**: Marot was a court poet under Marguerite's patronage. She protected him when his Protestant sympathies brought danger.
- **Sources**: Bentley, Jerry H. *Humanists and Holy Writ* (1983)
- **Strength**: strong

---

## V. Correspondence Networks

### 63. Erasmus ↔ Reuchlin
- **Source**: person-erasmus-of-rotterdam
- **Target**: person-johannes-reuchlin
- **Type**: corresponded_with
- **Dates**: 1510s-1522
- **Evidence**: Erasmus and Reuchlin corresponded as fellow humanist scholars. Erasmus supported Reuchlin during the "Reuchlin Affair" controversy over Hebrew books.
- **Sources**: Rummel, Erika. *The Case Against Johann Reuchlin* (2002)
- **Strength**: strong

### 64. Erasmus ↔ Capito
- **Source**: person-erasmus-of-rotterdam
- **Target**: person-wolfgang-capito
- **Type**: corresponded_with
- **Dates**: 1510s-1520s
- **Evidence**: Capito and Erasmus met at Basel and corresponded. They later became estranged as Capito moved toward Protestant reform.
- **Sources**: Burnett, Amy Nelson. *Teaching the Reformation* (2006)
- **Strength**: moderate

### 65. Erasmus ↔ Spalatin
- **Source**: person-erasmus-of-rotterdam
- **Target**: person-georg-spalatin
- **Type**: corresponded_with
- **Dates**: 1510s-1520s
- **Evidence**: Spalatin corresponded with Erasmus and other humanists as part of his role at the Saxon court.
- **Sources**: Höss, Irmgard. *Georg Spalatin* (1956)
- **Strength**: moderate

### 66. Calvin ↔ Melanchthon
- **Source**: person-john-calvin
- **Target**: person-philip-melanchthon
- **Type**: corresponded_with
- **Dates**: 1540s-1560 (Melanchthon's death)
- **Evidence**: Calvin and Melanchthon maintained a friendly correspondence despite Lutheran-Reformed tensions. They addressed each other warmly and sought common ground on contested doctrines.
- **Sources**: Wengert, Timothy. *Philip Melanchthon, Speaker of the Reformation* (2010)
- **Strength**: strong

### 67. Bullinger ↔ Calvin
- **Source**: person-heinrich-bullinger
- **Target**: person-john-calvin
- **Type**: corresponded_with
- **Dates**: 1540s-1564
- **Evidence**: Bullinger and Calvin corresponded extensively and eventually reached agreement in the Consensus Tigurinus (1549) on the Eucharist, uniting the Zurich and Genevan Reformed traditions.
- **Sources**: Gordon, Bruce. *Calvin* (2009)
- **Strength**: strong

### 68. Bullinger ↔ Cranmer
- **Source**: person-heinrich-bullinger
- **Target**: person-thomas-cranmer
- **Type**: corresponded_with
- **Dates**: 1530s-1556 (Cranmer's death)
- **Evidence**: Bullinger corresponded with Cranmer and influenced the English Reformation. Many English exiles under Mary I fled to Zurich and corresponded with Bullinger.
- **Sources**: MacCulloch, Diarmaid. *Thomas Cranmer* (1996)
- **Strength**: strong

### 69. Bullinger ↔ Hooper
- **Source**: person-heinrich-bullinger
- **Target**: person-john-hooper
- **Type**: corresponded_with
- **Dates**: 1540s-1555
- **Evidence**: Hooper lived in Zurich during his exile (1547-1549) and was influenced by Bullinger's more radical Reformed views. They maintained correspondence after Hooper returned to England.
- **Sources**: Primus, John H. *The Vestments Controversy* (1960)
- **Strength**: strong

### 70. Knox ↔ Beza
- **Source**: person-john-knox
- **Target**: person-theodore-beza
- **Type**: corresponded_with
- **Dates**: 1550s-1572
- **Evidence**: Knox and Beza corresponded during Knox's Geneva exile and afterward as Knox led the Scottish Reformation.
- **Sources**: Dawson, Jane. *John Knox* (2015)
- **Strength**: moderate

---

## VI. Patronage Relationships

### 71. Frederick the Wise → Luther
- **Source**: person-frederick-the-wise
- **Target**: person-martin-luther
- **Type**: patron_of
- **Dates**: 1517-1525 (Frederick's death)
- **Evidence**: Frederick the Wise protected Luther from papal and imperial action. He refused to hand Luther over after the Diet of Worms and arranged Luther's "kidnapping" to the Wartburg Castle for his safety.
- **Sources**: Schwiebert, Ernest. *Luther and His Times* (1950); Brecht, Martin. *Martin Luther* (1985)
- **Strength**: strong

### 72. Frederick the Wise → Spalatin
- **Source**: person-frederick-the-wise
- **Target**: person-georg-spalatin
- **Type**: patron_of
- **Dates**: 1508-1525
- **Evidence**: Spalatin served Frederick the Wise as secretary, chaplain, and court historian. He mediated between the elector and Luther.
- **Sources**: Höss, Irmgard. *Georg Spalatin* (1956)
- **Strength**: strong

### 73. Frederick the Wise → Cranach
- **Source**: person-frederick-the-wise
- **Target**: person-lucas-cranach
- **Type**: patron_of
- **Dates**: 1505-1525
- **Evidence**: Lucas Cranach the Elder was court painter to Frederick the Wise and his successors. Frederick employed Cranach for portraits and artistic projects.
- **Sources**: Koerner, Joseph Leo. *The Reformation of the Image* (2004)
- **Strength**: strong

### 74. John the Steadfast → Luther
- **Source**: person-john-the-steadfast
- **Target**: person-martin-luther
- **Type**: patron_of
- **Dates**: 1525-1532
- **Evidence**: John the Steadfast continued his brother's protection of Luther and openly embraced Lutheranism. He supported the Augsburg Confession (1530) and co-founded the Schmalkaldic League.
- **Sources**: Schwiebert, Ernest. *Luther and His Times* (1950)
- **Strength**: strong

### 75. John Frederick I → Luther
- **Source**: person-john-frederick-i
- **Target**: person-martin-luther
- **Type**: patron_of
- **Dates**: 1532-1546 (Luther's death)
- **Evidence**: John Frederick I continued Saxon patronage of Luther and the Reformation, leading the Schmalkaldic League until his defeat.
- **Sources**: Brady, Thomas A. *Protestant Politics* (1995)
- **Strength**: strong

### 76. Philip of Hesse → Luther
- **Source**: person-philip-of-hesse
- **Target**: person-martin-luther
- **Type**: patron_of
- **Dates**: 1524-1546
- **Evidence**: Philip of Hesse was one of the most active Protestant princes, co-founding the Schmalkaldic League with Saxony. He organized the Marburg Colloquy (1529) attempting to unite Luther and Zwingli.
- **Sources**: Wright, William J. *Capitalism, the State, and the Lutheran Reformation* (1988)
- **Strength**: strong

### 77. Henry VIII → Cranmer
- **Source**: person-henry-viii
- **Target**: person-thomas-cranmer
- **Type**: patron_of
- **Dates**: 1532-1547 (Henry's death)
- **Evidence**: Henry VIII appointed Cranmer Archbishop of Canterbury (1533) and relied on him to annul his marriage to Catherine of Aragon. Henry protected Cranmer from conservative opponents.
- **Sources**: MacCulloch, Diarmaid. *Thomas Cranmer* (1996)
- **Strength**: strong

### 78. Henry VIII → Cromwell
- **Source**: person-henry-viii
- **Target**: person-thomas-cromwell
- **Type**: patron_of
- **Dates**: 1530-1540 (Cromwell's execution)
- **Evidence**: Henry VIII relied on Thomas Cromwell as chief minister to engineer the break with Rome, dissolve the monasteries, and manage royal finances. Henry executed Cromwell in 1540 over the Anne of Cleves debacle.
- **Sources**: Elton, G.R. *The Tudor Revolution in Government* (1953)
- **Strength**: strong

### 79. Cromwell → Barnes
- **Source**: person-thomas-cromwell
- **Target**: person-robert-barnes
- **Type**: patron_of
- **Dates**: 1530s
- **Evidence**: Cromwell patronized Barnes and used him as a diplomatic intermediary with Lutheran Germany. Barnes was executed in 1540, the same day as Cromwell.
- **Sources**: Clebsch, W.A. *England's Earliest Protestants* (1964)
- **Strength**: strong

### 80. Cromwell → Coverdale
- **Source**: person-thomas-cromwell
- **Target**: person-miles-coverdale
- **Type**: patron_of
- **Dates**: 1535-1540
- **Evidence**: Cromwell supported Coverdale's Bible translation work and secured official approval for the Great Bible (1539).
- **Sources**: Dickens, A.G. *The English Reformation* (1964)
- **Strength**: strong

---

## VII. Oppositions and Debates

### 81. Luther ↔ Erasmus
- **Source**: person-martin-luther
- **Target**: person-erasmus-of-rotterdam
- **Type**: opposed
- **Dates**: 1524-1536 (Erasmus's death)
- **Evidence**: The Luther-Erasmus controversy over free will (1524-1525) was one of the defining intellectual battles of the Reformation. Erasmus wrote *De libero arbitrio* (1524) defending human free will; Luther responded with *De servo arbitrio* (1525) asserting human bondage to sin.
- **Sources**: McSorley, Harry. *Luther: Right or Wrong?* (1969)
- **Strength**: strong

### 82. Luther ↔ Zwingli
- **Source**: person-martin-luther
- **Target**: person-huldrych-zwingli
- **Type**: opposed
- **Dates**: 1520s-1531 (Zwingli's death)
- **Evidence**: Luther and Zwingli disagreed fundamentally on the Lord's Supper. At the Marburg Colloquy (1529), they agreed on 14 of 15 articles but could not reconcile on the Eucharist. Luther reportedly said "You are of a different spirit."
- **Sources**: Sasse, Hermann. *This Is My Body* (1959); Wandel, Lee Palmer. *The Eucharist in the Reformation* (2006)
- **Strength**: strong

### 83. Luther ↔ Karlstadt
- **Source**: person-martin-luther
- **Target**: person-andreas-karlstadt
- **Type**: opposed
- **Dates**: 1521-1525
- **Evidence**: Karlstadt was initially Luther's colleague but led radical reforms during Luther's Wartburg exile (1521-1522). Luther returned to reverse Karlstadt's changes, and they clashed over icons, the Eucharist, and the pace of reform. Karlstadt was eventually expelled from Saxony.
- **Sources**: Brecht, Martin. *Martin Luther* (1990); Pater, Calvin Augustine. *Karlstadt as the Father of the Baptist Movements* (1984)
- **Strength**: strong

### 84. Luther ↔ Müntzer
- **Source**: person-martin-luther
- **Target**: person-thomas-muntzer
- **Type**: opposed
- **Dates**: 1521-1525 (Müntzer's execution)
- **Evidence**: Luther initially supported Müntzer but rejected his emphasis on direct revelation and social revolution. Luther condemned Müntzer's involvement in the Peasants' War, calling him a "murderous prophet."
- **Sources**: Baylor, Michael G. *The Radical Reformation* (1991)
- **Strength**: strong

### 85. Luther ↔ Eck
- **Source**: person-martin-luther
- **Target**: person-johann-eck
- **Type**: opposed
- **Dates**: 1518-1543 (Eck's death)
- **Evidence**: Johann Eck was Luther's chief Catholic opponent. At the Leipzig Debate (1519), Eck maneuvered Luther into admitting sympathy with Jan Hus. Eck helped draft the papal bull *Exsurge Domine* condemning Luther and wrote the *Confutatio* against the Augsburg Confession.
- **Sources**: Bagchi, David. *Luther's Earliest Opponents* (1991)
- **Strength**: strong

### 86. Luther ↔ Cajetan
- **Source**: person-martin-luther
- **Target**: person-cardinal-thomas-cajetan
- **Type**: opposed
- **Dates**: 1518
- **Evidence**: Cardinal Cajetan interrogated Luther at Augsburg (October 1518) on behalf of the pope, demanding recantation. Luther refused, and the meeting ended in stalemate. Cajetan was more moderate than Eck but still required Luther's submission.
- **Sources**: Brecht, Martin. *Martin Luther* (1985)
- **Strength**: strong

### 87. Zwingli ↔ Grebel
- **Source**: person-huldrych-zwingli
- **Target**: person-conrad-grebel
- **Type**: opposed
- **Dates**: 1523-1526 (Grebel's death)
- **Evidence**: Grebel was Zwingli's student who broke with him over infant baptism and the pace of reform. Zwingli defended infant baptism and supported magistrate authority over the church; Grebel rejected both. Zurich executed Manz (Grebel's associate) by drowning.
- **Sources**: Snyder, C. Arnold. *Anabaptist History and Theology* (1995)
- **Strength**: strong

### 88. Zwingli ↔ Manz
- **Source**: person-huldrych-zwingli
- **Target**: person-felix-manz
- **Type**: opposed
- **Dates**: 1523-1527 (Manz's execution)
- **Evidence**: Felix Manz was executed by the Zurich council (with Zwingli's approval) by drowning on January 5, 1527—the first Swiss Anabaptist martyr. The sentence was a grim pun: rebaptizers would be baptized permanently.
- **Sources**: Snyder, C. Arnold. *Anabaptist History and Theology* (1995)
- **Strength**: strong

### 89. Luther ↔ Agricola (Antinomian Controversy)
- **Source**: person-martin-luther
- **Target**: person-johann-agricola
- **Type**: opposed
- **Dates**: 1537-1540
- **Evidence**: The Antinomian Controversy pitted Luther against his former student Agricola over the role of the law in Christian life. Luther accused Agricola of teaching that the law had no role in salvation; Agricola eventually recanted.
- **Sources**: Wengert, Timothy. *Law and Gospel* (1997)
- **Strength**: strong

### 90. More ↔ Luther
- **Source**: person-thomas-more
- **Target**: person-martin-luther
- **Type**: opposed
- **Dates**: 1523-1535 (More's execution)
- **Evidence**: Thomas More wrote polemics against Luther under a pseudonym (*Responsio ad Lutherum*, 1523) and in his own name. He defended Catholic doctrine and papal authority.
- **Sources**: Marius, Richard. *Thomas More* (1984)
- **Strength**: strong

### 91. More ↔ Tyndale
- **Source**: person-thomas-more
- **Target**: person-william-tyndale
- **Type**: opposed
- **Dates**: 1528-1535
- **Evidence**: More wrote multiple polemical works against Tyndale's Bible translation and theology, including the massive *Confutation of Tyndale's Answer* (1532-1533). More saw Tyndale as a dangerous heretic.
- **Sources**: Marius, Richard. *Thomas More* (1984); Daniell, David. *William Tyndale* (1994)
- **Strength**: strong

### 92. Erasmus ↔ Oecolampadius (estrangement)
- **Source**: person-erasmus-of-rotterdam
- **Target**: person-johannes-oecolampadius
- **Type**: opposed
- **Dates**: late 1520s
- **Evidence**: Erasmus and Oecolampadius had been colleagues at Basel, but Erasmus became estranged when Basel adopted the Reformation (1529). Erasmus left Basel for Freiburg rather than live under Protestant rule.
- **Sources**: McConica, James. *Erasmus* (1991)
- **Strength**: moderate

### 93. Cranmer ↔ Hooper (Vestments Controversy)
- **Source**: person-thomas-cranmer
- **Target**: person-john-hooper
- **Type**: opposed
- **Dates**: 1550-1551
- **Evidence**: Hooper initially refused consecration as Bishop of Gloucester because he objected to wearing vestments. Cranmer insisted on traditional vestments. The dispute was resolved by compromise (Hooper wore vestments for the consecration but not afterward).
- **Sources**: Primus, John H. *The Vestments Controversy* (1960)
- **Strength**: moderate

---

## VIII. Other Notable Relationships

### 94. Luther → Tyndale (intellectual influence)
- **Source**: person-martin-luther
- **Target**: person-william-tyndale
- **Type**: influenced
- **Dates**: 1520s
- **Evidence**: Tyndale's English New Testament (1526) was significantly influenced by Luther's German translation. Tyndale may have studied in Wittenberg and knew Luther's theological works.
- **Sources**: Daniell, David. *William Tyndale* (1994)
- **Strength**: strong

### 95. Erasmus → Bilney (intellectual influence)
- **Source**: person-erasmus-of-rotterdam
- **Target**: person-thomas-bilney
- **Type**: influenced
- **Dates**: c. 1516-1519
- **Evidence**: Bilney was converted to evangelical faith by reading Erasmus's Greek New Testament, specifically the Latin translation of 1 Timothy 1:15 ("Christ Jesus came into the world to save sinners").
- **Sources**: Foxe, John. *Actes and Monuments* (1563)
- **Strength**: strong

### 96. Cranach → Katharina von Bora
- **Source**: person-lucas-cranach
- **Target**: person-katharina-von-bora
- **Type**: knows
- **Dates**: 1523-1552
- **Evidence**: Lucas Cranach sheltered Katharina and other escaped nuns at his Wittenberg home in 1523 after their escape from the convent. Cranach later painted portraits of both Luther and Katharina.
- **Sources**: Bainton, Roland. *Here I Stand* (1950)
- **Strength**: strong

### 97. Bugenhagen → Luther and Katharina (married them)
- **Source**: person-johannes-bugenhagen
- **Target**: person-martin-luther
- **Type**: knows
- **Dates**: 1525
- **Evidence**: Johannes Bugenhagen, as Wittenberg's parish minister, performed the marriage ceremony of Luther and Katharina von Bora on June 13, 1525. He later baptized their children and preached Luther's funeral sermon.
- **Sources**: Brecht, Martin. *Martin Luther* (1990)
- **Strength**: strong

### 98. Calvin ↔ Marot (Psalter collaboration)
- **Source**: person-john-calvin
- **Target**: person-clement-marot
- **Type**: collaborated_with
- **Dates**: 1541-1543
- **Evidence**: Calvin collaborated with Marot on the Genevan Psalter. Marot's metrical French translations of the Psalms became the foundation of Huguenot worship.
- **Sources**: Garside, Charles. *The Origins of Calvin's Theology of Music* (1979)
- **Strength**: strong

### 99. Philip of Hesse → Bucer (adviser)
- **Source**: person-philip-of-hesse
- **Target**: person-martin-bucer
- **Type**: knows
- **Dates**: 1520s-1540
- **Evidence**: Bucer served as a theological adviser to Philip of Hesse and participated in the Marburg Colloquy (1529). Bucer notoriously advised Philip on his bigamy (1540), damaging both their reputations.
- **Sources**: Greschat, Martin. *Martin Bucer* (2004)
- **Strength**: strong

### 100. Philip of Hesse ↔ Zwingli (Marburg Colloquy)
- **Source**: person-philip-of-hesse
- **Target**: person-huldrych-zwingli
- **Type**: knows
- **Dates**: 1529
- **Evidence**: Philip organized and hosted the Marburg Colloquy (October 1529), inviting both Luther and Zwingli to attempt to reconcile their differences on the Eucharist.
- **Sources**: Sasse, Hermann. *This Is My Body* (1959)
- **Strength**: strong

### 101. Charles V ↔ Luther (political opposition)
- **Source**: person-charles-v
- **Target**: person-martin-luther
- **Type**: opposed
- **Dates**: 1521-1546
- **Evidence**: Charles V presided over the Diet of Worms (1521) where Luther was condemned. Charles declared Luther an outlaw in the Edict of Worms. He spent decades trying to suppress Protestantism, eventually defeating the Schmalkaldic League at Mühlberg (1547).
- **Sources**: Roper, Lyndal. *Martin Luther: Renegade and Prophet* (2016)
- **Strength**: strong

### 102. Jonas → Luther (present at death)
- **Source**: person-justus-jonas
- **Target**: person-martin-luther
- **Type**: knows
- **Dates**: 1521-1546
- **Evidence**: Justus Jonas was present at Luther's death in Eisleben on February 18, 1546, and recorded his final moments.
- **Sources**: Brecht, Martin. *Martin Luther* (1993)
- **Strength**: strong

### 103. Foxe → Oxford Martyrs (chronicled)
- **Source**: person-john-foxe
- **Target**: person-thomas-cranmer
- **Type**: knows
- **Dates**: post-1556
- **Evidence**: John Foxe chronicled the martyrdoms of Cranmer, Ridley, and Latimer in his *Actes and Monuments* (1563), shaping Protestant memory of these events for centuries.
- **Sources**: Foxe, John. *Actes and Monuments* (1563)
- **Strength**: strong

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Family relationships | 8 |
| Teacher-student / influence | 11 |
| Succession relationships | 5 |
| Collaborations | 28 |
| Correspondence | 8 |
| Patronage | 10 |
| Oppositions | 13 |
| Other notable | 10 |
| **Total documented** | **~93** |

*Note: Some relationships could be classified in multiple categories.*

---

## Relationships Needing Further Research

1. **Bucer ↔ Melanchthon**: Both attempted to mediate Lutheran-Reformed tensions; need to document their correspondence and relationship.
2. **Women reformers**: Relationships among Katharina Schütz Zell, Marie Dentière, Katharina von Bora—did they know each other or correspond?
3. **Anabaptist → mainstream connections**: Need clearer documentation of Hubmaier's relationship to Zwingli before Anabaptism.
4. **Beza's network**: Beza's extensive correspondence with English and Scottish reformers needs fuller documentation.
5. **Scandinavian connections**: If these figures are added later, their connections to Bugenhagen (who organized Nordic churches) would be important.

---

## Sources Consulted

### Primary Sources
- Foxe, John. *Actes and Monuments* (1563)
- Luther, Martin. *De servo arbitrio* (1525)
- Erasmus. *De libero arbitrio* (1524)
- Calvin, John. *Institutes of the Christian Religion* (1536-1559)
- Knox, John. *History of the Reformation in Scotland*

### Secondary Sources
- Brecht, Martin. *Martin Luther* (3 vols., 1985-1993)
- MacCulloch, Diarmaid. *Thomas Cranmer: A Life* (1996)
- Gordon, Bruce. *The Swiss Reformation* (2002)
- Parker, T.H.L. *John Calvin: A Biography* (1975)
- Cottret, Bernard. *Calvin: A Biography* (2000)
- Snyder, C. Arnold. *Anabaptist History and Theology* (1995)
- Scheible, Heinz. *Melanchthon: Eine Biographie* (1997)
- Roper, Lyndal. *Martin Luther: Renegade and Prophet* (2016)
- Dawson, Jane. *John Knox* (2015)

### Reference Works
- *Oxford Dictionary of National Biography*
- *Stanford Encyclopedia of Philosophy*
- *Encyclopedia Britannica*
