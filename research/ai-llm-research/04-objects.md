# AI/LLM Research Network - Key Objects

**Date**: 2026-01-18  
**Purpose**: Document significant works (papers, models, systems, books) in the AI/LLM research network.

---

## Foundational Research Papers

### Attention Is All You Need (2017)
- **Type**: Research paper
- **ID**: `object-transformer-paper`
- **Date**: June 2017 (arXiv); NeurIPS 2017
- **Authors**: Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan Gomez, Łukasz Kaiser, Illia Polosukhin
- **Description**: Introduced the Transformer architecture that underlies all modern large language models. Replaced recurrence with attention mechanisms, enabling massive parallelization and scaling.
- **Significance**: The most consequential AI paper of the decade; foundation of GPT, BERT, LLaMA, Claude, and virtually all modern LLMs.
- **Citation**: arXiv:1706.03762
- **Notes**: All 8 authors went on to found or co-found major AI companies (Cohere, Essential AI, Sakana AI, NEAR Protocol, Adept)

### ImageNet Classification with Deep Convolutional Neural Networks (AlexNet, 2012)
- **Type**: Research paper
- **ID**: `object-alexnet-paper`
- **Date**: December 2012 (NeurIPS)
- **Authors**: Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton
- **Description**: Won ImageNet 2012 with unprecedented accuracy (15.3% top-5 error vs. 26.2% runner-up). Demonstrated the power of GPUs for training deep CNNs.
- **Significance**: Triggered the deep learning revolution; considered the starting point of modern AI era.
- **Citation**: NeurIPS 2012
- **Notes**: Led to Google's acquisition of DNNresearch (Hinton's company)

### Learning Representations by Back-propagating Errors (1986)
- **Type**: Research paper
- **ID**: `object-backprop-paper`
- **Date**: October 1986
- **Authors**: David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams
- **Description**: Popularized backpropagation algorithm for training multi-layer neural networks.
- **Significance**: Foundational technique underlying all modern neural network training.
- **Citation**: Nature, Vol 323, 533-536

### Generative Adversarial Networks (2014)
- **Type**: Research paper
- **ID**: `object-gan-paper`
- **Date**: June 2014 (arXiv); NeurIPS 2014
- **Authors**: Ian Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio
- **Description**: Introduced adversarial training framework where generator and discriminator networks compete.
- **Significance**: Revolutionized generative AI; enabled realistic image synthesis before diffusion models.
- **Citation**: arXiv:1406.2661

### Adam: A Method for Stochastic Optimization (2014)
- **Type**: Research paper
- **ID**: `object-adam-paper`
- **Date**: December 2014 (arXiv); ICLR 2015
- **Authors**: Diederik P. Kingma, Jimmy Lei Ba
- **Description**: Introduced Adam optimizer combining adaptive learning rates with momentum.
- **Significance**: Most widely used optimizer in deep learning; used in virtually all modern neural network training.
- **Citation**: arXiv:1412.6980

### Auto-Encoding Variational Bayes (VAE, 2013)
- **Type**: Research paper
- **ID**: `object-vae-paper`
- **Date**: December 2013 (arXiv); ICLR 2014
- **Authors**: Diederik P. Kingma, Max Welling
- **Description**: Introduced Variational Auto-Encoders, enabling probabilistic latent space modeling.
- **Significance**: Foundation for many generative models; key technique in modern AI systems.
- **Citation**: arXiv:1312.6114

### Deep Residual Learning for Image Recognition (ResNet, 2015)
- **Type**: Research paper
- **ID**: `object-resnet-paper`
- **Date**: December 2015 (arXiv)
- **Authors**: Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun
- **Description**: Introduced skip connections enabling training of very deep networks (152+ layers).
- **Significance**: Won ImageNet 2015; residual connections now standard in all deep architectures.
- **Citation**: arXiv:1512.03385
- **Notes**: Authors were at Microsoft Research Asia (Chinese lab, but highly influential on Western AI)

### Dropout: A Simple Way to Prevent Neural Networks from Overfitting (2014)
- **Type**: Research paper
- **ID**: `object-dropout-paper`
- **Date**: JMLR 2014
- **Authors**: Nitish Srivastava, Geoffrey Hinton, Alex Krizhevsky, Ilya Sutskever, Ruslan Salakhutdinov
- **Description**: Introduced dropout regularization, randomly dropping neurons during training.
- **Significance**: Fundamental regularization technique used in nearly all neural networks.
- **Citation**: JMLR 15:1929-1958

### Sequence to Sequence Learning with Neural Networks (2014)
- **Type**: Research paper
- **ID**: `object-seq2seq-paper`
- **Date**: September 2014 (arXiv); NeurIPS 2014
- **Authors**: Ilya Sutskever, Oriol Vinyals, Quoc V. Le
- **Description**: Introduced encoder-decoder sequence-to-sequence architecture.
- **Significance**: Foundation for machine translation; precursor to Transformer attention mechanisms.
- **Citation**: arXiv:1409.3215

---

## GPT Series (OpenAI)

### GPT-1: Improving Language Understanding by Generative Pre-Training (2018)
- **Type**: Research paper / Model
- **ID**: `object-gpt1`
- **Date**: June 2018
- **Authors**: Alec Radford, Karthik Narasimhan, Tim Salimans, Ilya Sutskever
- **Organization**: OpenAI
- **Description**: First GPT model; demonstrated transfer learning through generative pre-training on unlabeled text.
- **Significance**: Established the pre-training + fine-tuning paradigm that dominates modern NLP.
- **Parameters**: 117 million

### GPT-2: Language Models are Unsupervised Multitask Learners (2019)
- **Type**: Research paper / Model
- **ID**: `object-gpt2`
- **Date**: February 2019
- **Authors**: Alec Radford, Jeffrey Wu, Rewon Child, David Luan, Dario Amodei, Ilya Sutskever
- **Organization**: OpenAI
- **Description**: Scaled GPT to 1.5B parameters; demonstrated impressive zero-shot capabilities.
- **Significance**: First "too dangerous to release" AI; sparked debate about AI risks and staged release.
- **Parameters**: 1.5 billion
- **Notes**: Initially withheld from public release; Dario Amodei was co-author before founding Anthropic

### GPT-3: Language Models are Few-Shot Learners (2020)
- **Type**: Research paper / Model
- **ID**: `object-gpt3`
- **Date**: May 2020 (arXiv); June 2020 (API)
- **Authors**: Tom Brown et al. (31 authors)
- **Organization**: OpenAI
- **Description**: Scaled to 175B parameters; demonstrated surprising few-shot and zero-shot capabilities.
- **Significance**: Proved scaling laws; showed emergent capabilities; established API-based AI business model.
- **Parameters**: 175 billion
- **Citation**: arXiv:2005.14165
- **Notes**: Tom Brown (lead author) later co-founded Anthropic

### GPT-4 (2023)
- **Type**: Model / Technical report
- **ID**: `object-gpt4`
- **Date**: March 2023
- **Organization**: OpenAI
- **Description**: Multimodal model accepting text and images; significant capability improvement over GPT-3.5.
- **Significance**: First truly multimodal LLM at scale; raised bar for AI capabilities.
- **Notes**: Technical details (parameters, architecture) not publicly disclosed

### GPT-4 Turbo (2023)
- **Type**: Model
- **ID**: `object-gpt4-turbo`
- **Date**: November 2023
- **Organization**: OpenAI
- **Description**: Faster, cheaper version of GPT-4 with 128K context window.
- **Significance**: Made GPT-4 level capabilities economically viable for more applications.

### GPT-4o (2024)
- **Type**: Model
- **ID**: `object-gpt4o`
- **Date**: May 2024
- **Organization**: OpenAI
- **Description**: Omni-model with native multimodal capabilities across text, audio, and vision.
- **Significance**: First model with real-time voice conversation capabilities.

---

## ChatGPT and Consumer AI Products

### ChatGPT (2022)
- **Type**: Product / System
- **ID**: `object-chatgpt`
- **Date**: November 30, 2022
- **Organization**: OpenAI
- **Description**: Conversational AI interface built on GPT-3.5 (later GPT-4); trained with RLHF.
- **Significance**: Fastest-growing consumer application in history (100M users in 2 months); brought AI to mainstream public consciousness.
- **Key People**: Sam Altman (launch), Mira Murati (development oversight), John Schulman (RLHF)
- **Notes**: Used PPO algorithm (created by John Schulman) for RLHF training

### DALL-E (2021)
- **Type**: Model / System
- **ID**: `object-dalle`
- **Date**: January 2021
- **Organization**: OpenAI
- **Authors**: Aditya Ramesh, Mikhail Pavlov, Gabriel Goh, Scott Gray, Chelsea Voss, Alec Radford, Mark Chen, Ilya Sutskever
- **Description**: First large-scale text-to-image generation system using Transformer architecture.
- **Significance**: Demonstrated AI could generate novel images from text descriptions.

### DALL-E 2 (2022)
- **Type**: Model / System
- **ID**: `object-dalle2`
- **Date**: April 2022
- **Organization**: OpenAI
- **Key People**: Aditya Ramesh, Mark Chen
- **Description**: Diffusion-based text-to-image model with dramatically improved quality over DALL-E.
- **Significance**: Brought photorealistic image generation to mainstream; used CLIP embeddings.

### DALL-E 3 (2023)
- **Type**: Model / System
- **ID**: `object-dalle3`
- **Date**: October 2023
- **Organization**: OpenAI
- **Description**: Third generation with improved prompt following and integration with ChatGPT.
- **Significance**: Integrated directly into ChatGPT for seamless image generation.

### CLIP (2021)
- **Type**: Model / Research paper
- **ID**: `object-clip`
- **Date**: January 2021
- **Organization**: OpenAI
- **Authors**: Alec Radford, Jong Wook Kim, Chris Hallacy, Aditya Ramesh, Gabriel Goh, Sandhini Agarwal, et al.
- **Description**: Contrastive Language-Image Pre-training; connected images and text in shared embedding space.
- **Significance**: Foundation for multimodal AI; enabled DALL-E, Stable Diffusion, and many other systems.
- **Citation**: arXiv:2103.00020

### Codex / GitHub Copilot (2021)
- **Type**: Model / Product
- **ID**: `object-codex`
- **Date**: August 2021
- **Organization**: OpenAI / GitHub (Microsoft)
- **Key People**: Wojciech Zaremba, Mark Chen
- **Description**: GPT-3 fine-tuned on code; powers GitHub Copilot.
- **Significance**: First widely-adopted AI coding assistant; transformed software development.

---

## Anthropic / Claude Series

### Claude (2023)
- **Type**: Model / System
- **ID**: `object-claude`
- **Date**: March 2023 (Claude 1)
- **Organization**: Anthropic
- **Description**: Conversational AI assistant trained with Constitutional AI (RLHF + AI feedback).
- **Significance**: First major GPT competitor trained with alternative alignment approach.
- **Key People**: Dario Amodei, Daniela Amodei, Jared Kaplan

### Claude 2 (2023)
- **Type**: Model
- **ID**: `object-claude2`
- **Date**: July 2023
- **Organization**: Anthropic
- **Description**: Improved version with 100K context window and better coding capabilities.
- **Significance**: First LLM with 100K+ context available to general users.

### Claude 3 Family (2024)
- **Type**: Model family
- **ID**: `object-claude3`
- **Date**: March 2024
- **Organization**: Anthropic
- **Description**: Family of models (Haiku, Sonnet, Opus) at different capability/cost tradeoffs.
- **Significance**: Opus competed with GPT-4 on benchmarks; introduced multimodal vision.

### Constitutional AI Paper (2022)
- **Type**: Research paper
- **ID**: `object-constitutional-ai`
- **Date**: December 2022
- **Organization**: Anthropic
- **Authors**: Yuntao Bai et al.
- **Description**: Training AI to be helpful, harmless, and honest using AI-generated critiques and principles.
- **Significance**: Alternative to pure RLHF; foundational to Claude's training approach.
- **Citation**: arXiv:2212.08073

### Scaling Laws for Neural Language Models (2020)
- **Type**: Research paper
- **ID**: `object-scaling-laws`
- **Date**: January 2020
- **Organization**: OpenAI (pre-Anthropic split)
- **Authors**: Jared Kaplan, Sam McCandlish, Tom Henighan, Tom Brown, et al.
- **Description**: Established power-law relationships between model size, data, and performance.
- **Significance**: Theoretical foundation for the scaling paradigm; predicted benefits of larger models.
- **Citation**: arXiv:2001.08361
- **Notes**: Many authors later co-founded Anthropic

---

## Meta AI / LLaMA Series

### LLaMA: Open and Efficient Foundation Language Models (2023)
- **Type**: Research paper / Model family
- **ID**: `object-llama`
- **Date**: February 2023
- **Organization**: Meta AI
- **Authors**: Hugo Touvron, Thibaut Lavril, Gautier Izacard, Xavier Martinet, Marie-Anne Lachaux, Timothée Lacroix, Baptiste Rozière, Naman Goyal, et al.
- **Description**: Family of open-weight LLMs (7B-65B parameters) trained on public data only.
- **Significance**: Launched open-weight LLM movement; leaked weights democratized LLM research.
- **Citation**: arXiv:2302.13971
- **Notes**: Weights leaked online shortly after release, spurring massive open-source ecosystem

### LLaMA 2 (2023)
- **Type**: Model family
- **ID**: `object-llama2`
- **Date**: July 2023
- **Organization**: Meta AI
- **Authors**: Hugo Touvron et al.
- **Description**: Officially open-weight models (7B-70B) with permissive license for commercial use.
- **Significance**: First major truly open-weight competitive LLM; enabled open-source AI ecosystem.
- **Citation**: arXiv:2307.09288

### LLaMA 3 (2024)
- **Type**: Model family
- **ID**: `object-llama3`
- **Date**: April 2024
- **Organization**: Meta AI
- **Description**: Third generation with 8B-70B+ variants; significantly improved capabilities.
- **Significance**: Closed gap with GPT-4 class models in open-weight space.

### Code Llama (2023)
- **Type**: Model family
- **ID**: `object-code-llama`
- **Date**: August 2023
- **Organization**: Meta AI
- **Authors**: Baptiste Rozière, Jonas Gehring, Fabian Gloeckle, et al.
- **Description**: Code-specialized LLaMA variants for code generation and understanding.
- **Significance**: Open-weight alternative to Codex; supports code infilling.
- **Citation**: arXiv:2308.12950

### fastText (2016)
- **Type**: Library / System
- **ID**: `object-fasttext`
- **Date**: August 2016
- **Organization**: Meta AI (Facebook Research)
- **Authors**: Armand Joulin, Edouard Grave, Piotr Bojanowski, Tomas Mikolov
- **Description**: Library for efficient text classification and word representations.
- **Significance**: Made word embeddings practical for production; widely used in industry.

---

## DeepMind Systems

### AlphaGo (2016)
- **Type**: System
- **ID**: `object-alphago`
- **Date**: January 2016 (Nature paper); March 2016 (Lee Sedol match)
- **Organization**: DeepMind
- **Key People**: David Silver, Aja Huang, Demis Hassabis
- **Description**: First AI system to defeat a professional Go player; combined deep learning with Monte Carlo tree search.
- **Significance**: Landmark achievement in AI; demonstrated deep RL could solve previously intractable games.
- **Citation**: Nature 529, 484-489

### AlphaGo Zero (2017)
- **Type**: System / Research paper
- **ID**: `object-alphago-zero`
- **Date**: October 2017
- **Organization**: DeepMind
- **Key People**: David Silver, Julian Schrittwieser, Demis Hassabis
- **Description**: Learned Go from scratch through self-play, surpassing original AlphaGo.
- **Significance**: Showed superhuman performance possible without human knowledge; pure self-play learning.
- **Citation**: Nature 550, 354-359

### AlphaZero (2018)
- **Type**: System / Research paper
- **ID**: `object-alphazero`
- **Date**: December 2018
- **Organization**: DeepMind
- **Key People**: David Silver, Demis Hassabis
- **Description**: Generalized AlphaGo Zero to chess and shogi, mastering all three games.
- **Significance**: Demonstrated a single algorithm could achieve superhuman performance across multiple domains.
- **Citation**: Science 362, 1140-1144

### AlphaFold (2018)
- **Type**: System
- **ID**: `object-alphafold`
- **Date**: December 2018 (CASP13)
- **Organization**: DeepMind
- **Key People**: John Jumper, Demis Hassabis
- **Description**: AI system for protein structure prediction; won CASP13 competition.
- **Significance**: First major step toward solving protein folding problem.

### AlphaFold 2 (2020)
- **Type**: System / Research paper
- **ID**: `object-alphafold2`
- **Date**: November 2020 (CASP14); July 2021 (Nature paper)
- **Organization**: DeepMind
- **Key People**: John Jumper, Demis Hassabis
- **Description**: Solved protein structure prediction at atomic accuracy.
- **Significance**: Considered "solved" problem of protein folding; won Nobel Prize in Chemistry 2024.
- **Citation**: Nature 596, 583-589
- **Notes**: AlphaFold database released with 200M+ predicted protein structures

### Gemini (2023)
- **Type**: Model family
- **ID**: `object-gemini`
- **Date**: December 2023
- **Organization**: Google DeepMind
- **Key People**: Demis Hassabis, Jeff Dean, Oriol Vinyals, Noam Shazeer
- **Description**: Natively multimodal LLM family (Nano, Pro, Ultra) from merged Google DeepMind.
- **Significance**: Google's flagship LLM response to GPT-4; trained across text, image, audio, video.

### AlphaStar (2019)
- **Type**: System
- **ID**: `object-alphastar`
- **Date**: January 2019
- **Organization**: DeepMind
- **Key People**: Oriol Vinyals, David Silver
- **Description**: AI system achieving Grandmaster level in StarCraft II.
- **Significance**: Demonstrated AI could handle real-time strategy with imperfect information.
- **Citation**: Nature 575, 350-354

---

## Google AI / Google Brain

### TensorFlow (2015)
- **Type**: Software framework
- **ID**: `object-tensorflow`
- **Date**: November 2015
- **Organization**: Google Brain
- **Key People**: Jeff Dean, Rajat Monga
- **Description**: Open-source machine learning framework.
- **Significance**: Dominant deep learning framework from 2015-2019; enabled widespread ML adoption.

### BERT: Pre-training of Deep Bidirectional Transformers (2018)
- **Type**: Research paper / Model
- **ID**: `object-bert`
- **Date**: October 2018
- **Organization**: Google AI
- **Authors**: Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova
- **Description**: Bidirectional Transformer pre-trained with masked language modeling.
- **Significance**: Revolutionized NLP; dominated benchmarks; introduced MLM pre-training.
- **Citation**: arXiv:1810.04805

### Word2Vec (2013)
- **Type**: Research paper / Model
- **ID**: `object-word2vec`
- **Date**: January 2013
- **Organization**: Google
- **Authors**: Tomas Mikolov, Kai Chen, Greg Corrado, Jeffrey Dean
- **Description**: Efficient methods for learning distributed word representations.
- **Significance**: Made word embeddings practical; "king - man + woman = queen" captured public imagination.
- **Citation**: arXiv:1301.3781

### Meena / LaMDA (2020-2022)
- **Type**: Model / System
- **ID**: `object-lamda`
- **Date**: January 2020 (Meena); May 2021 (LaMDA)
- **Organization**: Google
- **Key People**: Noam Shazeer
- **Description**: Dialog-focused language models; LaMDA powered early Bard.
- **Significance**: Google's conversational AI before Gemini; Meena team spawned Character.AI.

---

## European AI (Mistral, Stability)

### Mistral 7B (2023)
- **Type**: Model
- **ID**: `object-mistral-7b`
- **Date**: September 2023
- **Organization**: Mistral AI
- **Key People**: Arthur Mensch, Guillaume Lample, Timothée Lacroix
- **Description**: Highly efficient 7B parameter open-weight model outperforming LLaMA 2 13B.
- **Significance**: Demonstrated European AI competitiveness; efficient architecture innovations.

### Mixtral 8x7B (2023)
- **Type**: Model
- **ID**: `object-mixtral`
- **Date**: December 2023
- **Organization**: Mistral AI
- **Description**: Mixture of Experts model with 8 experts, each 7B parameters.
- **Significance**: Open-weight MoE model competing with GPT-3.5; demonstrated MoE efficiency.

### Stable Diffusion (2022)
- **Type**: Model / System
- **ID**: `object-stable-diffusion`
- **Date**: August 2022
- **Organization**: Stability AI / LMU Munich (academic research)
- **Authors**: Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, Björn Ommer
- **Description**: Open-source latent diffusion model for text-to-image generation.
- **Significance**: First widely-available open image generation model; sparked open generative AI movement.
- **Citation**: arXiv:2112.10752 (Latent Diffusion Models paper)
- **Notes**: Based on academic research from LMU Munich

### Latent Diffusion Models Paper (2021)
- **Type**: Research paper
- **ID**: `object-ldm-paper`
- **Date**: December 2021
- **Organization**: LMU Munich / Runway
- **Authors**: Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, Björn Ommer
- **Description**: Introduced latent space diffusion for efficient high-resolution image synthesis.
- **Significance**: Foundational technique for Stable Diffusion, DALL-E 3, and modern image generation.
- **Citation**: arXiv:2112.10752

---

## Hugging Face / Open-Source AI

### Transformers Library (2019)
- **Type**: Software library
- **ID**: `object-transformers-library`
- **Date**: October 2019 (PyTorch version)
- **Organization**: Hugging Face
- **Key People**: Thomas Wolf, Lysandre Debut, Victor Sanh
- **Description**: Open-source library for using pre-trained Transformer models.
- **Significance**: Democratized access to state-of-the-art NLP models; de facto standard for using LLMs.
- **Notes**: Originally PyTorch-Transformers; renamed after Hugging Face acquisition

### Hugging Face Hub (2019-)
- **Type**: Platform / System
- **ID**: `object-huggingface-hub`
- **Date**: 2019+
- **Organization**: Hugging Face
- **Key People**: Clément Delangue, Julien Chaumond
- **Description**: Platform for hosting and sharing ML models, datasets, and demos.
- **Significance**: Central repository for open-source AI; hosts most publicly available models.

### Model Cards for Model Reporting (2019)
- **Type**: Research paper / Standard
- **ID**: `object-model-cards`
- **Date**: January 2019
- **Organization**: Google (researchers later at Hugging Face)
- **Authors**: Margaret Mitchell, Simone Wu, Andrew Zaldivar, et al.
- **Description**: Framework for documenting ML models' intended uses, limitations, and biases.
- **Significance**: Established documentation standard for responsible AI; widely adopted in industry.
- **Citation**: FAT* 2019

---

## xAI

### Grok (2023)
- **Type**: Model / System
- **ID**: `object-grok`
- **Date**: November 2023
- **Organization**: xAI
- **Key People**: Elon Musk, Igor Babuschkin
- **Description**: Conversational AI with real-time information access and irreverent personality.
- **Significance**: Musk's response to ChatGPT; integrated with X (Twitter) platform.

### Grok-1 Open Release (2024)
- **Type**: Model
- **ID**: `object-grok1-open`
- **Date**: March 2024
- **Organization**: xAI
- **Description**: Open-weight release of Grok-1 (314B parameter MoE model).
- **Significance**: Largest open-weight model at time of release.

---

## Key Textbooks

### Deep Learning (2016)
- **Type**: Textbook
- **ID**: `object-deep-learning-book`
- **Date**: November 2016
- **Authors**: Ian Goodfellow, Yoshua Bengio, Aaron Courville
- **Publisher**: MIT Press
- **Description**: Comprehensive textbook covering mathematical foundations and modern deep learning.
- **Significance**: Definitive textbook in the field; used in courses worldwide.
- **URL**: https://www.deeplearningbook.org/

### Reinforcement Learning: An Introduction (1998/2018)
- **Type**: Textbook
- **ID**: `object-rl-book`
- **Date**: 1998 (1st edition); 2018 (2nd edition)
- **Authors**: Richard S. Sutton, Andrew G. Barto
- **Publisher**: MIT Press
- **Description**: Foundational textbook on reinforcement learning theory and algorithms.
- **Significance**: The canonical RL textbook; influenced all modern deep RL research.

### Probabilistic Graphical Models (2009)
- **Type**: Textbook
- **ID**: `object-pgm-book`
- **Date**: 2009
- **Authors**: Daphne Koller, Nir Friedman
- **Publisher**: MIT Press
- **Description**: Comprehensive textbook on probabilistic graphical models.
- **Significance**: Foundation for understanding Bayesian ML approaches.

### Speech and Language Processing (2000/2024)
- **Type**: Textbook
- **ID**: `object-nlp-book`
- **Date**: 2000 (1st); 2008 (2nd); 2024 (3rd online)
- **Authors**: Daniel Jurafsky, James H. Martin
- **Description**: Standard NLP textbook covering classical and neural approaches.
- **Significance**: Foundational NLP education; 3rd edition covers Transformers and LLMs.

---

## Courses and Educational Materials

### CS231n: Convolutional Neural Networks for Visual Recognition
- **Type**: Course
- **ID**: `object-cs231n`
- **Date**: First taught 2015
- **Organization**: Stanford University
- **Instructors**: Fei-Fei Li, Andrej Karpathy, Justin Johnson
- **Description**: Influential course on deep learning for computer vision.
- **Significance**: Trained a generation of CV researchers; Karpathy's lectures widely viewed online.

### CS229: Machine Learning
- **Type**: Course
- **ID**: `object-cs229`
- **Date**: Ongoing (Andrew Ng era: 2003-2012)
- **Organization**: Stanford University
- **Instructors**: Andrew Ng (originally)
- **Description**: Foundational ML course; basis for Coursera Machine Learning.
- **Significance**: Most influential ML course; spawned MOOCs.

### Machine Learning (Coursera, 2011)
- **Type**: Online course
- **ID**: `object-coursera-ml`
- **Date**: 2011 (Stanford online); 2012 (Coursera launch)
- **Organization**: Coursera / Stanford
- **Instructor**: Andrew Ng
- **Description**: First major MOOC on machine learning; millions of enrollees.
- **Significance**: Democratized ML education globally; launched MOOC movement.

### Neural Networks for Machine Learning (Coursera, 2012)
- **Type**: Online course
- **ID**: `object-hinton-coursera`
- **Date**: 2012
- **Organization**: Coursera / University of Toronto
- **Instructor**: Geoffrey Hinton
- **Description**: Deep learning course by Hinton covering neural network fundamentals.
- **Significance**: Brought Hinton's ideas to mass audience during deep learning revolution.

### DeepLearning.AI Specializations (2017-)
- **Type**: Course series
- **ID**: `object-deeplearning-ai`
- **Date**: 2017+
- **Organization**: DeepLearning.AI (Andrew Ng)
- **Instructor**: Andrew Ng
- **Description**: Series of specializations on deep learning, NLP, TensorFlow, etc.
- **Significance**: Most popular deep learning education platform; millions of learners.

### Distill.pub (2016-2021)
- **Type**: Journal / Publication
- **ID**: `object-distill`
- **Date**: 2016-2021
- **Organization**: Independent (founded by Chris Olah and Shan Carter)
- **Key People**: Chris Olah
- **Description**: Online journal for clear explanations of ML concepts with interactive visualizations.
- **Significance**: Pioneered visual ML explanations; highly influential despite short run.
- **Notes**: Discontinued in 2021 but articles remain influential

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Foundational Papers | 9 |
| GPT Series | 6 |
| OpenAI Consumer Products | 6 |
| Anthropic/Claude | 5 |
| Meta/LLaMA | 5 |
| DeepMind Systems | 8 |
| Google AI | 5 |
| European AI | 4 |
| Hugging Face/Open Source | 4 |
| xAI | 2 |
| Textbooks | 4 |
| Courses/Educational | 7 |
| **Total Objects** | **~65** |

---

## Research Gaps

1. **Academic papers**: Many influential papers not yet included (LSTM, attention mechanisms, etc.)
2. **Industry systems**: Production systems (Google Search ranking, recommendation systems) not covered
3. **Datasets**: ImageNet, Common Crawl, The Pile, etc. could be separate category
4. **Benchmarks**: GLUE, SuperGLUE, MMLU, etc. not documented
5. **Hardware**: TPUs, H100s have been transformative but excluded per scope
