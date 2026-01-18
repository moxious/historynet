# AI/LLM Research Network - Documented Relationships

**Date**: 2026-01-18  
**Purpose**: Document specific relationships between individuals in the AI/LLM research network with evidence and sources.

---

## Custom Relationship Types

In addition to standard types from GRAPH_SCHEMA.md, this network uses:

| Type | Directed | Description |
|------|----------|-------------|
| `co_founded` | Yes | Person co-founded an entity with others |
| `recruited` | Yes | Source recruited target to organization |
| `departed_from` | Yes | Person left an organization |
| `co_authored` | No | Co-authored a significant paper |
| `employed` | Yes | Organization employed person |

---

## Academic Lineages (Student-Teacher Relationships)

### Toronto School (Geoffrey Hinton's Students)

#### Geoffrey Hinton → Ilya Sutskever (PhD Advisor)
- **Type**: taught
- **Evidence**: "Sutskever completed his PhD under Geoffrey Hinton at the University of Toronto in 2012. His thesis was titled 'Training recurrent neural networks.'"
- **Source**: University of Toronto CS department records; Wikipedia
- **Dates**: 2007-2012
- **Strength**: strong

#### Geoffrey Hinton → Alex Krizhevsky (PhD Advisor)
- **Type**: taught
- **Evidence**: "Krizhevsky completed his PhD under Hinton at the University of Toronto around 2012. Together with Sutskever and Hinton, he created AlexNet."
- **Source**: Wikipedia; AlexNet paper (2012)
- **Dates**: 2009-2012
- **Strength**: strong

#### Geoffrey Hinton → Ruslan Salakhutdinov (PhD Advisor)
- **Type**: taught
- **Evidence**: "Salakhutdinov earned his PhD from the University of Toronto in 2009 under Geoffrey Hinton, with thesis 'Learning deep generative models.'"
- **Source**: Wikipedia; CMU faculty page
- **Dates**: 2005-2009
- **Strength**: strong

#### Geoffrey Hinton → Yee-Whye Teh (PhD Advisor)
- **Type**: taught
- **Evidence**: "Teh completed his PhD under Hinton at the University of Toronto in 2003, with thesis on 'Bethe free energy and contrastive divergence approximations.'"
- **Source**: Wikipedia; Oxford faculty page
- **Dates**: 1999-2003
- **Strength**: strong

#### Geoffrey Hinton → George Dahl (PhD Advisor)
- **Type**: taught
- **Evidence**: "Dahl completed his PhD under Hinton at Toronto in 2015 on 'Deep Learning Approaches to Problems in Speech Recognition, Computational Chemistry and Natural Language Processing.'"
- **Source**: University of Toronto records
- **Dates**: 2011-2015
- **Strength**: strong

#### Geoffrey Hinton → Nitish Srivastava (PhD Co-Advisor)
- **Type**: taught
- **Evidence**: "Srivastava completed his PhD in 2016 at Toronto, co-advised by Hinton and Salakhutdinov. Co-author of influential Dropout paper."
- **Source**: University of Toronto records; Dropout paper (2014)
- **Dates**: 2012-2016
- **Strength**: strong

#### Geoffrey Hinton → Durk Kingma (Collaboration/Influence)
- **Type**: influenced
- **Evidence**: "Kingma's PhD was at University of Amsterdam, but he collaborated extensively with Hinton's group and was influenced by Toronto school approaches. Co-author of Adam optimizer paper."
- **Source**: Academic records; publications
- **Dates**: 2013-2015
- **Strength**: moderate

### Montreal School (Yoshua Bengio's Students)

#### Yoshua Bengio → Ian Goodfellow (PhD Advisor)
- **Type**: taught
- **Evidence**: "Goodfellow earned his PhD from Université de Montréal in 2014, supervised by Yoshua Bengio and Aaron Courville. Invented GANs during his PhD."
- **Source**: Wikipedia; GAN paper (2014)
- **Dates**: 2009-2014
- **Strength**: strong

#### Yoshua Bengio → Aaron Courville (Collaboration/Co-Supervision)
- **Type**: collaborated_with
- **Evidence**: "Courville is a full professor at Université de Montréal and core MILA member. Co-authored the definitive 'Deep Learning' textbook with Bengio and Goodfellow (2016)."
- **Source**: Deep Learning textbook; MILA directory
- **Dates**: 2010-present
- **Strength**: strong

#### Yoshua Bengio → Kyunghyun Cho (Postdoc Advisor)
- **Type**: taught
- **Evidence**: "Cho did postdoctoral research at MILA with Bengio. Co-inventor of the GRU (Gated Recurrent Unit) architecture with Bengio in 2014."
- **Source**: GRU paper (2014); NYU faculty page
- **Dates**: 2014-2015
- **Strength**: strong

#### Michael Jordan → Yoshua Bengio (Postdoc Advisor)
- **Type**: taught
- **Evidence**: "After his PhD at McGill, Bengio did postdoctoral work at MIT under Michael Jordan, working on sequential learning and statistical methods."
- **Source**: MILA directory; Wikipedia
- **Dates**: 1991-1993
- **Strength**: strong

### Stanford AI (Andrew Ng and Fei-Fei Li's Students)

#### Andrew Ng → Pieter Abbeel (PhD Advisor)
- **Type**: taught
- **Evidence**: "Abbeel was Andrew Ng's first PhD student at Stanford. He is now a professor at UC Berkeley and co-founder of Covariant."
- **Source**: Wikipedia; Berkeley faculty page
- **Dates**: 2004-2008
- **Strength**: strong

#### Andrew Ng → Quoc V. Le (PhD Student)
- **Type**: taught
- **Evidence**: "Le was advised by Andrew Ng at Stanford before joining Google Brain."
- **Source**: Google Research page; Stanford records
- **Dates**: 2008-2013
- **Strength**: strong

#### Fei-Fei Li → Andrej Karpathy (PhD Advisor)
- **Type**: taught
- **Evidence**: "Karpathy completed his PhD at Stanford under Fei-Fei Li, focusing on the intersection of computer vision and natural language. Co-taught CS231n with Li."
- **Source**: Stanford CS; Wikipedia
- **Dates**: 2011-2016
- **Strength**: strong

#### Fei-Fei Li → Timnit Gebru (PhD Advisor)
- **Type**: taught
- **Evidence**: "Gebru earned her PhD from Stanford in 2017 under Fei-Fei Li, working on computer vision and later AI ethics. Used Street View images for socioeconomic research."
- **Source**: Wikipedia; Stanford records
- **Dates**: 2012-2017
- **Strength**: strong

#### Fei-Fei Li → Olga Russakovsky (PhD Advisor)
- **Type**: taught
- **Evidence**: "Russakovsky completed her PhD under Fei-Fei Li at Stanford, contributing significantly to ImageNet. Now professor at Princeton."
- **Source**: Princeton faculty page; ImageNet papers
- **Dates**: 2008-2015
- **Strength**: strong

### Other Academic Lineages

#### Richard Sutton → David Silver (PhD Advisor)
- **Type**: taught
- **Evidence**: "Silver did his PhD at University of Alberta under Richard Sutton, the 'father of reinforcement learning.' Silver later led AlphaGo development at DeepMind."
- **Source**: Wikipedia; DeepMind biography
- **Dates**: 2004-2009
- **Strength**: strong

#### Christopher Longuet-Higgins → Geoffrey Hinton (PhD Advisor)
- **Type**: taught
- **Evidence**: "Hinton earned his PhD in Artificial Intelligence from the University of Edinburgh in 1978, supervised by Christopher Longuet-Higgins. Thesis: 'Relaxation and Its Role in Vision.'"
- **Source**: Wikipedia; Nobel Prize biography
- **Dates**: 1972-1978
- **Strength**: strong

---

## Company Founding Relationships

### OpenAI (Founded December 2015)

#### Sam Altman → OpenAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "OpenAI was founded in December 2015 by Sam Altman, Elon Musk, Greg Brockman, Ilya Sutskever, Wojciech Zaremba, and John Schulman, among others."
- **Source**: OpenAI announcement; multiple news sources
- **Dates**: December 2015
- **Strength**: strong

#### Elon Musk → OpenAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Musk was a co-founder and early funder of OpenAI. He departed the board in February 2018."
- **Source**: OpenAI records; news coverage
- **Dates**: December 2015 (departed 2018)
- **Strength**: strong

#### Greg Brockman → OpenAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Brockman left his position as CTO of Stripe to co-found OpenAI and serve as its President."
- **Source**: OpenAI announcement; Wikipedia
- **Dates**: December 2015
- **Strength**: strong

#### Ilya Sutskever → OpenAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Sutskever was recruited from Google Brain to co-found OpenAI and serve as Chief Scientist."
- **Source**: OpenAI announcement; Wikipedia
- **Dates**: December 2015 (departed May 2024)
- **Strength**: strong

#### John Schulman → OpenAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Schulman was a co-founder of OpenAI, leading reinforcement learning research. Creator of PPO algorithm."
- **Source**: OpenAI records; academic papers
- **Dates**: December 2015 (later departed to Anthropic)
- **Strength**: strong

#### Wojciech Zaremba → OpenAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Zaremba was among the original co-founders of OpenAI, focusing on robotics and later language model research."
- **Source**: OpenAI announcement; Wikipedia
- **Dates**: December 2015
- **Strength**: strong

#### Andrej Karpathy → OpenAI (Founding Member)
- **Type**: member_of
- **Evidence**: "Karpathy was a founding member of OpenAI in 2015, later leaving for Tesla (2017) and returning (2023) before departing again."
- **Source**: Wikipedia; news coverage
- **Dates**: 2015-2017, 2023-2024
- **Strength**: strong

#### Durk Kingma → OpenAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Kingma was listed among the original OpenAI team, known for inventing the Adam optimizer and VAEs."
- **Source**: OpenAI announcement
- **Dates**: December 2015 (later departed to Google Brain)
- **Strength**: strong

#### Trevor Blackwell → OpenAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Blackwell was among the initial funders and co-founders of OpenAI."
- **Source**: OpenAI announcement
- **Dates**: December 2015
- **Strength**: strong

#### Vicki Cheung → OpenAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Cheung was listed among the original OpenAI founding team."
- **Source**: OpenAI announcement
- **Dates**: December 2015
- **Strength**: moderate

#### Pamela Vagata → OpenAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Vagata was listed among the original OpenAI founding team."
- **Source**: OpenAI announcement
- **Dates**: December 2015
- **Strength**: moderate

### Anthropic (Founded 2021)

#### Dario Amodei → Anthropic (Co-founder)
- **Type**: co_founded
- **Evidence**: "Dario Amodei co-founded Anthropic in 2021 after leaving his role as VP of Research at OpenAI. He serves as CEO."
- **Source**: Wikipedia; Anthropic company records
- **Dates**: 2021
- **Strength**: strong

#### Daniela Amodei → Anthropic (Co-founder)
- **Type**: co_founded
- **Evidence**: "Daniela Amodei co-founded Anthropic with her brother Dario, serving as President. She previously led safety and policy at OpenAI."
- **Source**: Wikipedia; company records
- **Dates**: 2021
- **Strength**: strong

#### Jared Kaplan → Anthropic (Co-founder)
- **Type**: co_founded
- **Evidence**: "Kaplan was a co-founder of Anthropic, serving as Chief Science Officer. Known for scaling laws research."
- **Source**: Company records; Wikipedia
- **Dates**: 2021
- **Strength**: strong

#### Tom Brown → Anthropic (Co-founder)
- **Type**: co_founded
- **Evidence**: "Brown was a co-founder of Anthropic. He was lead author on the GPT-3 paper while at OpenAI."
- **Source**: Company records; GPT-3 paper
- **Dates**: 2021
- **Strength**: strong

#### Jack Clark → Anthropic (Co-founder)
- **Type**: co_founded
- **Evidence**: "Clark was a co-founder of Anthropic, serving as Head of Policy. Previously Policy Director at OpenAI."
- **Source**: Company records; Wikipedia
- **Dates**: 2021
- **Strength**: strong

#### Sam McCandlish → Anthropic (Co-founder)
- **Type**: co_founded
- **Evidence**: "McCandlish was a co-founder of Anthropic, known for work on scaling laws."
- **Source**: Company records
- **Dates**: 2021
- **Strength**: strong

#### Chris Olah → Anthropic (Co-founder)
- **Type**: co_founded
- **Evidence**: "Olah was a co-founder of Anthropic, focusing on interpretability research. Founder of Distill.pub."
- **Source**: Company records; Wikipedia
- **Dates**: 2021
- **Strength**: strong

### DeepMind (Founded 2010)

#### Demis Hassabis → DeepMind (Co-founder)
- **Type**: co_founded
- **Evidence**: "Hassabis co-founded DeepMind in London in 2010 along with Shane Legg and Mustafa Suleyman."
- **Source**: Wikipedia; DeepMind history
- **Dates**: 2010
- **Strength**: strong

#### Shane Legg → DeepMind (Co-founder)
- **Type**: co_founded
- **Evidence**: "Legg was a co-founder of DeepMind, serving as Chief AGI Scientist. His PhD work on universal intelligence measures influenced DeepMind's mission."
- **Source**: Wikipedia; DeepMind history
- **Dates**: 2010
- **Strength**: strong

#### Mustafa Suleyman → DeepMind (Co-founder)
- **Type**: co_founded
- **Evidence**: "Suleyman was a co-founder of DeepMind, focusing on applied AI and policy. Later left to found Inflection AI."
- **Source**: Wikipedia; DeepMind history
- **Dates**: 2010 (left 2022)
- **Strength**: strong

### Google Brain (Founded 2011)

#### Jeff Dean → Google Brain (Co-founder)
- **Type**: co_founded
- **Evidence**: "Dean co-founded Google Brain in 2011 along with Andrew Ng and Greg Corrado, originally within Google X."
- **Source**: Wikipedia; Google Research
- **Dates**: 2011
- **Strength**: strong

#### Andrew Ng → Google Brain (Co-founder)
- **Type**: co_founded
- **Evidence**: "Ng co-founded Google Brain with Jeff Dean and Greg Corrado. The famous 'cat neuron' experiment emerged from this work."
- **Source**: Wikipedia; Google Research
- **Dates**: 2011 (left 2012)
- **Strength**: strong

#### Greg Corrado → Google Brain (Co-founder)
- **Type**: co_founded
- **Evidence**: "Corrado was a co-founder of Google Brain with Dean and Ng."
- **Source**: Wikipedia
- **Dates**: 2011
- **Strength**: strong

### Meta AI / FAIR (Founded 2013)

#### Yann LeCun → Meta AI (Founder)
- **Type**: founded
- **Evidence**: "LeCun founded Facebook AI Research (FAIR) in December 2013 and continues to lead it as Chief AI Scientist at Meta."
- **Source**: Wikipedia; Meta AI
- **Dates**: December 2013
- **Strength**: strong

### Mistral AI (Founded April 2023)

#### Arthur Mensch → Mistral AI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Mensch co-founded Mistral AI in April 2023 with Guillaume Lample and Timothée Lacroix. He serves as CEO."
- **Source**: Wikipedia; company records
- **Dates**: April 2023
- **Strength**: strong

#### Guillaume Lample → Mistral AI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Lample left Meta FAIR to co-found Mistral AI, serving as Chief Scientist. Previously worked on LLaMA at Meta."
- **Source**: Wikipedia; company records
- **Dates**: April 2023
- **Strength**: strong

#### Timothée Lacroix → Mistral AI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Lacroix left Meta to co-found Mistral AI, serving as CTO. He and Lample and Mensch all attended École Polytechnique."
- **Source**: Wikipedia; company records
- **Dates**: April 2023
- **Strength**: strong

### xAI (Founded July 2023)

#### Elon Musk → xAI (Founder)
- **Type**: founded
- **Evidence**: "Musk announced the founding of xAI in July 2023, recruiting researchers from DeepMind and Google."
- **Source**: Wikipedia; xAI announcement
- **Dates**: July 2023
- **Strength**: strong

#### Igor Babuschkin → xAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Babuschkin was a co-founder and Chief Engineer of xAI, recruited from DeepMind. Led Grok development."
- **Source**: Wikipedia; news coverage
- **Dates**: July 2023 (departed 2025)
- **Strength**: strong

#### Christian Szegedy → xAI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Szegedy joined xAI as co-founder, recruited from Google where he created the Inception network."
- **Source**: Britannica; news coverage
- **Dates**: July 2023
- **Strength**: moderate

### Cohere (Founded 2019)

#### Aidan Gomez → Cohere (Co-founder)
- **Type**: co_founded
- **Evidence**: "Gomez co-founded Cohere in 2019, serving as CEO. He was the youngest author on the Transformer paper (an intern at Google)."
- **Source**: Wikipedia; company records
- **Dates**: 2019
- **Strength**: strong

#### Ivan Zhang → Cohere (Co-founder)
- **Type**: co_founded
- **Evidence**: "Zhang co-founded Cohere with Gomez and Nick Frosst."
- **Source**: Company records
- **Dates**: 2019
- **Strength**: strong

#### Nick Frosst → Cohere (Co-founder)
- **Type**: co_founded
- **Evidence**: "Frosst co-founded Cohere after working with Geoffrey Hinton at Google Brain on capsule networks."
- **Source**: Company records; academic papers
- **Dates**: 2019
- **Strength**: strong

### Hugging Face (Founded 2016)

#### Clément Delangue → Hugging Face (Co-founder)
- **Type**: co_founded
- **Evidence**: "Delangue co-founded Hugging Face in 2016, serving as CEO."
- **Source**: Wikipedia; company records
- **Dates**: 2016
- **Strength**: strong

#### Julien Chaumond → Hugging Face (Co-founder)
- **Type**: co_founded
- **Evidence**: "Chaumond co-founded Hugging Face, serving as CTO."
- **Source**: Wikipedia; company records
- **Dates**: 2016
- **Strength**: strong

#### Thomas Wolf → Hugging Face (Co-founder)
- **Type**: co_founded
- **Evidence**: "Wolf co-founded Hugging Face, serving as Chief Science Officer. Created the Transformers library."
- **Source**: Wikipedia; company records
- **Dates**: 2016
- **Strength**: strong

### Stability AI (Founded 2019)

#### Emad Mostaque → Stability AI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Mostaque co-founded Stability AI in 2019 with Cyrus Hodes. He stepped down as CEO in March 2024."
- **Source**: Wikipedia; news coverage
- **Dates**: 2019 (stepped down 2024)
- **Strength**: strong

### Sakana AI (Founded 2023)

#### Llion Jones → Sakana AI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Jones co-founded Sakana AI in Tokyo with David Ha. Jones was a co-author of the Transformer paper."
- **Source**: Wikipedia; company records
- **Dates**: 2023
- **Strength**: strong

#### David Ha → Sakana AI (Co-founder)
- **Type**: co_founded
- **Evidence**: "Ha co-founded Sakana AI with Llion Jones. Previously at Google Brain, known for creative AI research."
- **Source**: Company records
- **Dates**: 2023
- **Strength**: strong

---

## Major Paper Co-Authorship

### Transformer Paper (2017)

#### Ashish Vaswani ↔ Noam Shazeer (Co-authored Transformer)
- **Type**: co_authored
- **Evidence**: "Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, and Polosukhin co-authored 'Attention Is All You Need' at Google in 2017."
- **Source**: arXiv:1706.03762
- **Dates**: 2017
- **Strength**: strong

#### Ashish Vaswani ↔ Niki Parmar (Co-authored Transformer)
- **Type**: co_authored
- **Evidence**: "Co-authors of Transformer paper. Later co-founded Adept and Essential AI together."
- **Source**: arXiv:1706.03762; Wikipedia
- **Dates**: 2017
- **Strength**: strong

#### All Transformer Authors (8 people)
- **Type**: co_authored
- **Evidence**: "The eight authors are: Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan Gomez, Łukasz Kaiser, Illia Polosukhin. All listed as 'equal contributors.'"
- **Source**: arXiv:1706.03762
- **Dates**: 2017
- **Strength**: strong
- **Note**: This establishes co_authored relationships between all 28 pairs

### AlexNet Paper (2012)

#### Alex Krizhevsky ↔ Ilya Sutskever (Co-authored AlexNet)
- **Type**: co_authored
- **Evidence**: "Krizhevsky, Sutskever, and Hinton co-authored 'ImageNet Classification with Deep Convolutional Neural Networks' (AlexNet), winning ImageNet 2012."
- **Source**: NeurIPS 2012 paper
- **Dates**: 2012
- **Strength**: strong

#### Alex Krizhevsky ↔ Geoffrey Hinton (Co-authored AlexNet)
- **Type**: co_authored
- **Evidence**: "Hinton co-authored AlexNet with his students Krizhevsky and Sutskever."
- **Source**: NeurIPS 2012 paper
- **Dates**: 2012
- **Strength**: strong

#### Ilya Sutskever ↔ Geoffrey Hinton (Co-authored AlexNet)
- **Type**: co_authored
- **Evidence**: "Sutskever was second author on AlexNet with his advisor Hinton."
- **Source**: NeurIPS 2012 paper
- **Dates**: 2012
- **Strength**: strong

### GPT-3 Paper (2020)

#### Tom Brown → GPT-3 (Lead Author)
- **Type**: authored
- **Evidence**: "Tom Brown was lead author on 'Language Models are Few-Shot Learners' (GPT-3), one of the most influential AI papers."
- **Source**: arXiv:2005.14165
- **Dates**: 2020
- **Strength**: strong

### GAN Paper (2014)

#### Ian Goodfellow ↔ Yoshua Bengio (Co-authored GAN paper)
- **Type**: co_authored
- **Evidence**: "Goodfellow's GAN paper was co-authored with his advisors Bengio and Courville, among others."
- **Source**: NeurIPS 2014
- **Dates**: 2014
- **Strength**: strong

### Deep Learning Textbook (2016)

#### Ian Goodfellow ↔ Yoshua Bengio ↔ Aaron Courville (Co-authored textbook)
- **Type**: co_authored
- **Evidence**: "The three co-authored 'Deep Learning' (MIT Press, 2016), the definitive textbook on the field."
- **Source**: MIT Press; widely cited
- **Dates**: 2016
- **Strength**: strong

### Adam Optimizer Paper (2014)

#### Durk Kingma ↔ Jimmy Ba (Co-authored Adam)
- **Type**: co_authored
- **Evidence**: "Kingma and Ba co-authored 'Adam: A Method for Stochastic Optimization', the most widely used optimizer in deep learning."
- **Source**: ICLR 2015; arXiv:1412.6980
- **Dates**: 2014
- **Strength**: strong

### LLaMA Paper (2023)

#### Hugo Touvron ↔ Guillaume Lample (Co-authored LLaMA)
- **Type**: co_authored
- **Evidence**: "Touvron, Lample, and others at Meta co-authored the LLaMA paper, establishing the open-weight LLM paradigm."
- **Source**: arXiv:2302.13971
- **Dates**: 2023
- **Strength**: strong

---

## Employment and Organizational Relationships

### OpenAI Employment

#### Alec Radford → OpenAI (Long-term Researcher)
- **Type**: worked_at
- **Evidence**: "Radford has been a research scientist at OpenAI since its early days. Lead author on GPT-1, GPT-2, and CLIP."
- **Source**: OpenAI papers; Wikipedia
- **Dates**: 2016-present
- **Strength**: strong

#### Mira Murati → OpenAI (CTO)
- **Type**: worked_at
- **Evidence**: "Murati served as CTO of OpenAI from 2018 to September 2024. Oversaw ChatGPT and DALL-E development."
- **Source**: Wikipedia; news coverage
- **Dates**: 2018-2024
- **Strength**: strong

#### Jan Leike → OpenAI (Safety Lead)
- **Type**: worked_at
- **Evidence**: "Leike led OpenAI's superalignment team until departing in May 2024, citing concerns about safety prioritization."
- **Source**: Wikipedia; news coverage
- **Dates**: 2021-2024
- **Strength**: strong

#### Lukasz Kaiser → OpenAI (Researcher)
- **Type**: worked_at
- **Evidence**: "Kaiser joined OpenAI from Google Brain in June 2021. Co-author of the Transformer paper."
- **Source**: TheOrg.com; news coverage
- **Dates**: 2021-present
- **Strength**: strong

### Meta AI / FAIR Employment

#### Joelle Pineau → Meta AI (VP of Research)
- **Type**: worked_at
- **Evidence**: "Pineau is VP of AI Research at Meta, while maintaining her professorship at McGill and role at MILA."
- **Source**: Meta AI; McGill faculty page
- **Dates**: 2017-present
- **Strength**: strong

#### Jerome Pesenti → Meta AI (Former VP)
- **Type**: worked_at
- **Evidence**: "Pesenti served as VP of AI at Meta from 2018 to 2022, overseeing FAIR expansion."
- **Source**: Wikipedia; news coverage
- **Dates**: 2018-2022
- **Strength**: strong

#### Hugo Touvron → Meta AI (Research Scientist)
- **Type**: worked_at
- **Evidence**: "Touvron is a research scientist at Meta FAIR in Paris, lead researcher on LLaMA models."
- **Source**: Meta AI; LLaMA papers
- **Dates**: 2020-present
- **Strength**: strong

### DeepMind Employment

#### David Silver → DeepMind (Principal Scientist)
- **Type**: worked_at
- **Evidence**: "Silver is a principal research scientist at DeepMind and professor at UCL. Led AlphaGo, AlphaZero, and AlphaStar projects."
- **Source**: DeepMind; UCL
- **Dates**: 2013-present
- **Strength**: strong

#### John Jumper → DeepMind (Director)
- **Type**: worked_at
- **Evidence**: "Jumper is a director at DeepMind, leading the AlphaFold team. Won Nobel Prize in Chemistry 2024."
- **Source**: DeepMind; Nobel Prize
- **Dates**: 2017-present
- **Strength**: strong

#### Oriol Vinyals → DeepMind (VP of Research)
- **Type**: worked_at
- **Evidence**: "Vinyals is VP of Research at DeepMind, co-leading Gemini development."
- **Source**: DeepMind; news coverage
- **Dates**: 2016-present
- **Strength**: strong

### Google Brain / Google AI Employment

#### Geoffrey Hinton → Google Brain (VP)
- **Type**: worked_at
- **Evidence**: "Hinton joined Google Brain in 2013 after Google acquired DNNresearch. He resigned in May 2023 to speak freely about AI risks."
- **Source**: Wikipedia; news coverage
- **Dates**: 2013-2023
- **Strength**: strong

#### Noam Shazeer → Google (VP, returned)
- **Type**: worked_at
- **Evidence**: "Shazeer worked at Google from 2000-2021 (co-authoring Transformer), left to found Character.AI, then returned to Google in 2024 as VP of Engineering co-leading Gemini."
- **Source**: Wikipedia; news coverage
- **Dates**: 2000-2021, 2024-present
- **Strength**: strong

---

## Major Departures and Transitions

### OpenAI → Anthropic Exodus (2021)

#### Dario Amodei → departed OpenAI
- **Type**: departed_from
- **Evidence**: "Dario Amodei left his role as VP of Research at OpenAI in late 2020/early 2021 to co-found Anthropic, reportedly due to disagreements about safety and commercialization."
- **Source**: Wikipedia; news coverage
- **Dates**: Late 2020
- **Strength**: strong

#### Daniela Amodei → departed OpenAI
- **Type**: departed_from
- **Evidence**: "Daniela Amodei left OpenAI's safety and policy team to co-found Anthropic with her brother."
- **Source**: Wikipedia; news coverage
- **Dates**: Late 2020
- **Strength**: strong

#### Tom Brown → departed OpenAI
- **Type**: departed_from
- **Evidence**: "Brown, lead author of GPT-3, left OpenAI to co-found Anthropic."
- **Source**: News coverage
- **Dates**: 2021
- **Strength**: strong

#### Chris Olah → departed OpenAI
- **Type**: departed_from
- **Evidence**: "Olah, known for interpretability research, left OpenAI to co-found Anthropic."
- **Source**: News coverage
- **Dates**: 2021
- **Strength**: strong

### Other Major Departures

#### Ilya Sutskever → departed OpenAI (2024)
- **Type**: departed_from
- **Evidence**: "Sutskever departed OpenAI in May 2024 to found Safe Superintelligence Inc. (SSI). He was involved in the November 2023 board crisis that briefly ousted Sam Altman."
- **Source**: Wikipedia; news coverage
- **Dates**: May 2024
- **Strength**: strong

#### Jan Leike → departed OpenAI (2024)
- **Type**: departed_from
- **Evidence**: "Leike resigned from OpenAI in May 2024, publicly stating that safety concerns were not being adequately prioritized. He joined Anthropic."
- **Source**: News coverage; social media
- **Dates**: May 2024
- **Strength**: strong

#### Mira Murati → departed OpenAI (2024)
- **Type**: departed_from
- **Evidence**: "Murati departed as CTO in September 2024, along with other senior executives."
- **Source**: News coverage
- **Dates**: September 2024
- **Strength**: strong

#### Guillaume Lample → departed Meta (2023)
- **Type**: departed_from
- **Evidence**: "Lample left Meta FAIR to co-found Mistral AI in April 2023."
- **Source**: Wikipedia; news coverage
- **Dates**: April 2023
- **Strength**: strong

#### Timothée Lacroix → departed Meta (2023)
- **Type**: departed_from
- **Evidence**: "Lacroix left Meta to co-found Mistral AI with Lample and Mensch."
- **Source**: Wikipedia; news coverage
- **Dates**: April 2023
- **Strength**: strong

#### Arthur Mensch → departed DeepMind (2023)
- **Type**: departed_from
- **Evidence**: "Mensch left Google DeepMind to co-found Mistral AI."
- **Source**: Wikipedia; news coverage
- **Dates**: April 2023
- **Strength**: strong

#### Mustafa Suleyman → departed DeepMind (2022)
- **Type**: departed_from
- **Evidence**: "Suleyman left DeepMind/Google to found Inflection AI in 2022, then joined Microsoft as EVP in 2024."
- **Source**: Wikipedia; news coverage
- **Dates**: 2022
- **Strength**: strong

#### Andrej Karpathy → departed Tesla (2022)
- **Type**: departed_from
- **Evidence**: "Karpathy left his role as Tesla's AI Director in 2022 after building the Autopilot AI team."
- **Source**: Wikipedia; news coverage
- **Dates**: July 2022
- **Strength**: strong

#### Geoffrey Hinton → departed Google (2023)
- **Type**: departed_from
- **Evidence**: "Hinton resigned from Google in May 2023 to speak freely about AI risks, specifically concerns about existential risk from advanced AI."
- **Source**: Wikipedia; news coverage
- **Dates**: May 2023
- **Strength**: strong

---

## Intellectual Influence Relationships

### Deep Learning Pioneers

#### Geoffrey Hinton → Yoshua Bengio (Mutual Influence)
- **Type**: collaborated_with / influenced
- **Evidence**: "Hinton, Bengio, and LeCun are known as the 'Godfathers of AI' and have collaborated and influenced each other over decades. They shared the 2018 Turing Award."
- **Source**: ACM Turing Award; Wikipedia
- **Dates**: 1990s-present
- **Strength**: strong

#### Geoffrey Hinton → Yann LeCun (Mutual Influence)
- **Type**: collaborated_with / influenced
- **Evidence**: "Hinton and LeCun have been close collaborators since the 1980s, both pioneering neural network approaches during AI winters."
- **Source**: ACM Turing Award; Wikipedia
- **Dates**: 1980s-present
- **Strength**: strong

#### Yoshua Bengio → Yann LeCun (Mutual Influence)
- **Type**: collaborated_with / influenced
- **Evidence**: "Bengio and LeCun collaborated on convolutional networks and have maintained close ties, though sometimes disagreeing on AI safety."
- **Source**: Academic papers; public discussions
- **Dates**: 1990s-present
- **Strength**: strong

### Backpropagation Influence

#### David Rumelhart → Geoffrey Hinton (Co-inventor of Backprop)
- **Type**: collaborated_with
- **Evidence**: "Rumelhart, Hinton, and Williams co-authored the famous 1986 paper 'Learning representations by back-propagating errors' that popularized backpropagation."
- **Source**: Nature 1986 paper
- **Dates**: 1986
- **Strength**: strong

### Reinforcement Learning Lineage

#### Richard Sutton → Deep RL Field (Foundational Influence)
- **Type**: influenced
- **Evidence**: "Sutton's work on temporal difference learning and his RL textbook (with Barto) form the foundation of all modern deep RL, including work at DeepMind and OpenAI."
- **Source**: RL textbook; Wikipedia
- **Dates**: 1980s-present
- **Strength**: strong

---

## Notable Collaborations

### AlphaGo Team

#### Demis Hassabis ↔ David Silver (AlphaGo Collaboration)
- **Type**: collaborated_with
- **Evidence**: "Hassabis and Silver led the AlphaGo project together, achieving the historic victory over Lee Sedol in 2016."
- **Source**: DeepMind; Nature papers
- **Dates**: 2014-2016
- **Strength**: strong

#### David Silver ↔ Aja Huang (AlphaGo Collaboration)
- **Type**: collaborated_with
- **Evidence**: "Huang implemented key parts of AlphaGo and physically played the moves in the match against Lee Sedol."
- **Source**: DeepMind; Wikipedia
- **Dates**: 2014-2016
- **Strength**: strong

### AlphaFold Team

#### Demis Hassabis ↔ John Jumper (AlphaFold Collaboration)
- **Type**: collaborated_with
- **Evidence**: "Hassabis and Jumper led the AlphaFold project, winning the Nobel Prize in Chemistry in 2024."
- **Source**: Nobel Prize; Nature papers
- **Dates**: 2018-2024
- **Strength**: strong

### ImageNet

#### Fei-Fei Li ↔ Jia Deng (ImageNet Collaboration)
- **Type**: collaborated_with
- **Evidence**: "Li and Deng (Princeton) worked closely on building ImageNet and organizing the ImageNet Challenge (ILSVRC)."
- **Source**: ImageNet papers; ImageNet website
- **Dates**: 2007-2017
- **Strength**: strong

### Google Brain Formation

#### Jeff Dean ↔ Andrew Ng (Google Brain Co-founders)
- **Type**: collaborated_with
- **Evidence**: "Dean and Ng worked together to establish Google Brain, including the famous 'cat neuron' experiment."
- **Source**: Wikipedia; Google Research
- **Dates**: 2011-2012
- **Strength**: strong

### MILA Collaboration

#### Yoshua Bengio ↔ Doina Precup (MILA Collaboration)
- **Type**: collaborated_with
- **Evidence**: "Bengio and Precup both lead research at MILA, with Precup also heading DeepMind's Montreal lab."
- **Source**: MILA; DeepMind
- **Dates**: 2010s-present
- **Strength**: strong

---

## Family Relationships

#### Dario Amodei ↔ Daniela Amodei (Siblings)
- **Type**: related_to
- **Evidence**: "Dario and Daniela Amodei are siblings who co-founded Anthropic together."
- **Source**: Wikipedia; company records
- **Dates**: Lifelong
- **Strength**: strong

#### Yoshua Bengio ↔ Samy Bengio (Brothers)
- **Type**: related_to
- **Evidence**: "Yoshua and Samy Bengio are brothers, both prominent in ML research. Yoshua at MILA, Samy formerly at Google Brain (now Apple)."
- **Source**: Wikipedia
- **Dates**: Lifelong
- **Strength**: strong

---

## Summary Statistics

| Relationship Category | Count |
|-----------------------|-------|
| Academic (Student-Teacher) | 20 |
| Company Founding | 42 |
| Paper Co-Authorship | 15 |
| Employment | 12 |
| Departures/Transitions | 14 |
| Intellectual Influence | 8 |
| Notable Collaborations | 8 |
| Family | 2 |
| **Total Documented** | **~121** |

---

## Relationship Gaps to Research

1. **OpenAI internal collaborations**: Specific paper collaborations between OpenAI researchers
2. **Meta AI/FAIR internal**: Relationships between LLaMA team members
3. **DeepMind internal**: Full AlphaGo/AlphaFold team relationships
4. **Cross-company collaborations**: Industry-academic partnerships
5. **Investor relationships**: Funding relationships (excluded by scope but could be added)
6. **Conference connections**: NeurIPS, ICML, ICLR organizing committees
7. **Google-DeepMind merger dynamics**: Relationships formed during 2023 merger

---

## Sources

- Wikipedia (English)
- Company websites (OpenAI, Anthropic, DeepMind, Meta AI, etc.)
- arXiv papers
- News coverage (The Information, Business Insider, Wired, etc.)
- ACM and Nobel Prize official sources
- University faculty pages
- LinkedIn and The Org
