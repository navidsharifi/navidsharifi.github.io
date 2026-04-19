# Cutting-Edge Research Report: Top Universities (2023–2026)
## Stanford, MIT, Oxford, Cambridge, Harvard

*Compiled: April 2026*

---

## Table of Contents
1. [Stochastic Optimization for Inventory Control & Supply Chains](#area-1)
2. [Probabilistic Forecasting](#area-2)
3. [Queue Theory in Healthcare and Supply Chains](#area-3)
4. [Portfolio Optimization and Fintech Risk Management](#area-4)
5. [Data Envelopment Analysis (DEA)](#area-5)
6. [Multi-Criteria Decision Making (MCDM/MADM/MODM)](#area-6)
7. [Healthcare Systems Operations Research](#area-7)
8. [Integration of Forecasting with Optimization](#area-8)

---

<a name="area-1"></a>
## Area 1: Stochastic Optimization for Inventory Control & Supply Chains

### Key Professors & Labs

| Professor | Affiliation | Lab/Group | Focus |
|-----------|------------|-----------|-------|
| **Dimitris Bertsimas** | MIT Sloan / ORC | Analytics & Optimization Lab | Robust/adaptive optimization, data-driven decision-making, personalized medicine, prescriptive analytics |
| **Georgia Perakis** | MIT Sloan / ORC (Co-director) | Predictive & Prescriptive Analytics Lab | Supply chain optimization, pricing, healthcare analytics |
| **David Simchi-Levi** | MIT CEE | Data Science Lab | Statistical learning, inventory optimization, dynamic pricing, online/offline learning |
| **Yinyu Ye** | Stanford MS&E (Emeritus) | Computational Optimization Laboratory | Linear/mathematical programming, optimization algorithm design, OR models |
| **Alexandre Jacquillat** | MIT Sloan / ORC | — | Stochastic optimization, data-driven decision-making, large-scale optimization, transportation |
| **Retsef Levi** | MIT Sloan / ORC | — | Analytics, algorithms for food, health, agriculture supply chains |
| **Yossi Sheffi** | MIT CTL | Center for Transportation & Logistics | Supply chain management, enterprise resilience, risk management |
| **Andy Sun** | MIT Sloan / ORC | — | Multistage optimization under uncertainty, mixed-integer nonlinear optimization |
| **Nikos Trichakis** | MIT Sloan / ORC | — | Optimization, health management, supply chain management, finance |
| **Y. Karen Zheng** | MIT Sloan / ORC | — | Behavioral operations, sustainable supply chains, information transparency |

### Recent Papers (2023–2026)

1. **Bertsimas & Andrianesis** (2024). "Ensembling wind forecasting models to construct data-driven uncertainty sets in robust optimization." *IEEE Power & Energy Society*.
2. **Basciftci & Ahmed** (2024). "Adaptive two-stage stochastic programming with an analysis on capacity expansion planning problem." *Manufacturing & Service Operations Management*.
3. **Zhang, Turan, Sarker & Essam** (2025). "Robust optimization approaches in inventory management: Part A — the survey." *IISE Transactions*.
4. **Cohen, Dai, Perakis et al.** (2026). "OM Forum — Supply Chain Management in the AI Era: A Vision Statement from the Operations Management Community." *Manufacturing & Service Operations Management*.
5. **Bertsimas** (2022). *Robust and Adaptive Optimization* (textbook, Dynamic Ideas Press).

### Evolution of the Field (Last 5 Years)

The field has undergone a **paradigm shift from classical stochastic programming to data-driven approaches**:

- **Classical era (pre-2020):** Two-stage and multi-stage stochastic programming dominated, requiring explicit probability distributions for uncertain parameters. Computational intractability for large instances was a major barrier.
- **Robust optimization revolution:** Bertsimas and co-authors popularized robust optimization as a computationally tractable alternative to stochastic programming. Uncertainty sets replaced probability distributions.
- **Data-driven/distributionally robust optimization (DRO) (2020–present):** The field moved to constructing uncertainty sets directly from data using machine learning. DRO bridges stochastic and robust optimization by optimizing over ambiguity sets of probability distributions.
- **Prescriptive analytics (2023–2026):** Integration of machine learning predictions directly into optimization formulations ("predict-then-optimize" and "end-to-end" approaches). The key innovation is that the prediction model is trained with the downstream optimization task in mind.
- **LLM and AI integration (2025–2026):** Emerging work on using large language models for supply chain decision support and automated formulation of optimization problems.

### Key Open Problems

1. **Scalability of data-driven methods** to real-world supply chain networks with millions of SKUs
2. **Multi-agent stochastic optimization** in decentralized supply chains
3. **Robustness-performance tradeoffs** — how to calibrate conservatism in robust/DRO methods
4. **Online learning + optimization** — sequential decision-making under non-stationary demand
5. **Causal inference in supply chains** — moving beyond correlation-based demand forecasting

### Future Directions

- Foundation models for supply chain optimization
- Digital twins with embedded stochastic optimization
- Sustainable/green supply chain optimization under uncertainty
- Integration of behavioral operations with stochastic models

---

<a name="area-2"></a>
## Area 2: Probabilistic Forecasting

### Key Professors & Labs

| Professor | Affiliation | Lab/Group | Focus |
|-----------|------------|-----------|-------|
| **Rob J. Hyndman** | Monash University (Global influence) | — | Forecast reconciliation, probabilistic forecasting, time series methods, anomaly detection |
| **Bahman Rostami-Tabar** | Cardiff University | — | Hierarchical forecasting in healthcare, forecasting for social good |
| **Tommi Jaakkola** | MIT EECS / ORC | — | Probabilistic modeling, machine learning, computational chemistry |
| **Devavrat Shah** | MIT EECS / ORC | — | Stochastic networks, statistical inference |
| **Stephen Bates** | MIT EECS (Affiliated ORC) | — | Statistical inference, uncertainty quantification with AI |
| **Yarin Gal** | Oxford Statistics / CS | Oxford Applied and Theoretical Machine Learning (OATML) Group | Bayesian deep learning, uncertainty estimation in deep learning |
| **Arnaud Doucet** | Oxford Statistics | — | Sequential Monte Carlo methods, Bayesian computation |

### Recent Papers (2023–2026)

1. **Rasul, Ashok, Williams et al.** (2023). "Lag-Llama: Towards Foundation Models for Probabilistic Time Series Forecasting." *arXiv:2310.08278*. [Cited 509 times]
2. **Das, Kong, Sen, Zhou** (2023). "A Decoder-Only Foundation Model for Time-Series Forecasting." *arXiv:2310.10688* (Google's TimesFM). [Cited 867 times]
3. **Liang, Wen, Nie et al.** (2024). "Foundation Models for Time Series Analysis: A Tutorial and Survey." *KDD 2024*. [Cited 509 times]
4. **Cao, Ye, Zhang, Liu** (2024). "TimeDiT: General-Purpose Diffusion Transformers for Time Series Foundation Model." *arXiv:2409.02322*. [Cited 56 times]
5. **Hyndman & Rostami-Tabar** (2024). "Forecasting interrupted time series." *J. Operational Research Society* 76(4), 790–803.
6. **Girolimetto, Athanasopoulos, Di Fonzo, Hyndman** (2024). "Cross-temporal probabilistic forecast reconciliation." *International Journal of Forecasting* 40(3), 1134–1151.
7. **Rostami-Tabar & Hyndman** (2025). "Hierarchical Time Series Forecasting in Emergency Medical Services." *Journal of Service Research* 28(2), 278–295.
8. **Wang & Hyndman** (2024). "Online conformal inference for multi-step time series forecasting." *arXiv:2410.13115*.
9. **Wang, Hyndman, Wickramasuriya** (2025). "Optimal forecast reconciliation with time series selection." *European J. Operational Research* 323(2), 455–470.
10. **Rostami-Tabar, Greene, Shmueli, Hyndman** (2025). "Good intentions, unintended consequences: exploring forecasting harms." *arXiv:2411.16531*.

### How Deep Learning Is Changing Probabilistic Forecasting

#### Foundation Models Revolution (2023–2026)
The most significant shift in probabilistic forecasting has been the emergence of **time series foundation models** (TSFMs):

- **Lag-Llama** (2023): First dedicated foundation model for univariate probabilistic forecasting, based on a decoder-only transformer with lags as covariates.
- **TimesFM** (Google, 2023): Decoder-only foundation model achieving strong zero-shot forecasting performance.
- **TimeDiT** (2024): Diffusion transformers applied to probabilistic time series forecasting, enabling high-quality uncertainty quantification.
- **Chronos** (Amazon, 2024): Tokenizes time series values and uses language model architectures for probabilistic forecasting.
- **Moirai** (Salesforce, 2024): Any-variate, any-frequency foundation model with in-context learning.

#### Key Architectural Trends
1. **Transformer-based architectures** dominate, with both encoder-decoder and decoder-only variants
2. **Diffusion models** for generating probabilistic forecasts with calibrated uncertainty
3. **Conformal prediction** methods for distribution-free prediction intervals (Wang & Hyndman, 2024)
4. **Hierarchical/reconciled probabilistic forecasting** — ensuring coherence across aggregation levels

### Key Open Problems

1. **Calibration of foundation model uncertainty** — zero-shot probabilistic forecasts are often miscalibrated
2. **Distribution-free probabilistic forecasting** — conformal prediction for non-exchangeable time series
3. **Forecast reconciliation at scale** — combining bottom-up and top-down probabilistic forecasts coherently
4. **Multivariate probabilistic forecasting** — capturing cross-series dependencies
5. **Ethical implications of forecasting** — bias amplification in demand/workforce forecasting (Rostami-Tabar et al., 2025)
6. **Domain-specific fine-tuning** — when and how to adapt foundation models vs. training from scratch

### Future Directions

- Universal time series foundation models with better probabilistic calibration
- Integration of causal reasoning into probabilistic forecasting
- Real-time probabilistic streaming forecasts
- Forecast reconciliation for very large hierarchies (millions of series)

---

<a name="area-3"></a>
## Area 3: Queue Theory in Healthcare and Supply Chains

### Key Professors & Labs

| Professor | Affiliation | Lab/Group | Focus |
|-----------|------------|-----------|-------|
| **Dimitris Bertsimas** | MIT Sloan / ORC | — | Queueing theory, stochastic processes (applied probability) |
| **David Gamarnik** | MIT Sloan / ORC | — | Discrete probability, stochastic networks |
| **Daniel Freund** | MIT Sloan / ORC | — | Applied probability, transportation, online marketplaces |
| **Stanley Gershwin** | MIT ME (Senior Lecturer) | — | Manufacturing systems, queueing theory, control theory |
| **Eytan Modiano** | MIT AeroAstro / ORC | — | Communications, network control, stochastic networks |
| **Richard Larson** | MIT (Professor Emeritus) | — | Queueing theory for public systems (inducted into IAOTP Hall of Fame, 2025) |
| **Georgia Perakis** | MIT Sloan / ORC | — | Healthcare analytics, supply chain queueing |
| **Vivek Farias** | MIT Sloan / ORC | — | Reinforcement learning, approximation algorithms, commerce platforms |

### Recent Papers (2023–2026)

1. **Thompson, Levine, Chen, Sahiner et al.** (2024). "Applying queueing theory to evaluate wait-time-savings of triage algorithms." *Queueing Systems*. [Cited 9 times]
2. **Saini, Singh, Sharma** (2025). "A queueing theory approach to analyze the impact of COVID-19 pandemic on hospitals system capabilities." *J. Manage. World*.
3. **Hinestroza, Ruiz, Anacona et al.** (2025). "Queuing theory & discrete simulation as a tool to improve medicine delivery center service levels." *Yugoslav J. Operations Research*.
4. **Harki** (2024). "Multi-Level Feedback Queue Scheduling Technique: Model Proposal to Reduce Risk and Enhance Performance of Healthcare Systems." *Cihan University-Erbil Scientific J.*
5. **Zhao & Gilbert** (2025). "A queuing theory-based approach to evaluate service delivery quality." *International Journal of Quality and Service Sciences*.

### Key Models Being Developed

1. **AI-augmented queueing systems**: Integration of ML-based triage algorithms with queueing models to evaluate wait-time savings in emergency departments
2. **Multi-class queueing networks** for hospital patient flow with heterogeneous service times
3. **Fluid queueing models** for pandemic surge capacity planning
4. **Digital twin queueing models** coupling simulation with real-time data for hospital operations
5. **Network queueing with abandonment** for modeling patient no-shows and leave-without-being-seen

### Evolution (Last 5 Years)

- **Pre-2020:** Classical M/M/c, M/G/1 models applied to healthcare in stylized settings
- **2020–2022:** COVID-19 accelerated research on **surge capacity queueing models**, pandemic-responsive scheduling
- **2023–2025:** Integration of **reinforcement learning** with queueing control policies; data-driven queueing parameter estimation
- **2025–2026:** Emergence of **LLM-assisted queueing system design** and **real-time digital twins** for hospital operations

### Key Open Problems

1. **Non-stationary queueing** in healthcare with time-varying arrival rates and service distributions
2. **Multi-facility network queueing** for ambulance routing and patient transfers
3. **Fairness in queueing** — equitable waiting time policies across patient demographics
4. **Heavy-traffic approximations** for modern service systems with heterogeneous servers
5. **Integration of queueing theory with scheduling optimization** for operating room and bed management

---

<a name="area-4"></a>
## Area 4: Portfolio Optimization and Fintech Risk Management

### Key Professors & Labs

| Professor | Affiliation | Lab/Group | Focus |
|-----------|------------|-----------|-------|
| **Andrew W. Lo** | MIT Sloan / ORC | Laboratory for Financial Engineering (LFE) | Adaptive Markets Hypothesis, financial engineering, healthcare finance, climate finance |
| **Jiang Wang** | MIT Sloan / ORC | — | Asset pricing theory, financial markets, international finance |
| **Yinyu Ye** | Stanford MS&E (Emeritus) | Computational Optimization Lab | Mathematical programming applied to finance |
| **John Mulvey** | Princeton ORFE | — | End-to-end portfolio optimization with neural networks |
| **Oxford-Man Institute** | University of Oxford | Oxford-Man Institute of Quantitative Finance | Quantitative finance research |

### Recent Papers & Books (2023–2026)

1. **Lo & Zhang** (2025). *The Adaptive Markets Hypothesis* (Book, Oxford University Press). — Mathematical/statistical foundations of the AMH for reconciling EMH and behavioral finance.
2. **Lo** (2025–2026). "LLM Economicus? Mapping the Behavioral Biases of LLMs via Utility Theory." — Testing whether LLMs exhibit systematic behavioral biases.
3. **Lo** (2025). "Can ChatGPT Plan Your Retirement?: Generative AI and Financial Advice."
4. **Wang, Gao, Harvey, Liu, Tao** (2026). "Machine Learning Meets Markowitz." *NBER Working Paper w34861*. — End-to-end learning framework integrating prediction and portfolio optimization. [Cited 4 times]
5. **Uysal, Li, Mulvey** (2024). "End-to-end risk budgeting portfolio optimization with neural networks." *Annals of Operations Research*. [Cited 67 times]
6. **Lo** (2025–2026). "Performance Attribution for Portfolio Constraints." — Impact investing framework.
7. **Lo** (2025). "Financing Fusion Energy" and "What Can Fusion Energy Learn From Biotechnology?" — Climate finance research.

### Andrew Lo's Key Research Themes (2024–2026)

Andrew Lo's recent work spans four frontier areas:
1. **Fintech & AI**: Testing LLMs for financial decision-making biases; evaluating generative AI for retirement planning
2. **Adaptive Markets Hypothesis**: Mathematical formalization published as an Oxford University Press book (2025)
3. **Healthcare Finance**: Novel drug development financing models (BridgeBio case study), clinical trial correlation estimation
4. **Climate Finance**: Applying biotech financing models to fusion energy development

### Evolution (Last 5 Years)

- **2020–2021:** Mean-variance optimization enhanced with ML-estimated covariance matrices; factor models augmented with alternative data
- **2022–2023:** **Deep reinforcement learning** for dynamic portfolio management; end-to-end learning replacing two-stage predict-then-optimize
- **2024–2025:** **Foundation models in finance** — LLMs tested for financial advice and behavioral biases; end-to-end frameworks like "Machine Learning Meets Markowitz" (NBER 2026)
- **2025–2026:** ESG/impact portfolio optimization with quantified social returns; climate finance instruments

### Key Open Problems

1. **End-to-end portfolio optimization** that jointly predicts and allocates, avoiding the two-stage approximation error
2. **Robust portfolio optimization under model uncertainty** — distributionally robust approaches
3. **LLM reliability for financial advice** — understanding systematic biases
4. **Non-stationary financial environments** — adaptive portfolio strategies
5. **Impact measurement** in ESG portfolios — quantifying social/environmental returns

### Future Directions

- Foundation models specifically trained for financial time series
- Quantum computing for portfolio optimization
- Real-time adaptive portfolio management with streaming data
- Climate risk integration into standard portfolio models

---

<a name="area-5"></a>
## Area 5: Data Envelopment Analysis (DEA)

### Key Professors & Labs

| Professor | Affiliation | Focus |
|-----------|------------|-------|
| **Ali Emrouznejad** | University of Surrey (formerly Aston) | DEA methodology, inverse DEA, sustainability, SDGs |
| **Gholam R. Amin** | Sultan Qaboos University | Inverse DEA, performance assessment |
| **Vincent Charles** | University of Bradford | DEA for SDGs, environmental policy |
| **Kaoru Tone** | GRIPS, Japan (Emeritus) | SBM-DEA, network DEA |
| **Joe Zhu** | Worcester Polytechnic Institute | Network DEA, DEA software |

### Recent Papers (2023–2026)

1. **Emrouznejad & Amin** (2023). "Advances in inverse data envelopment analysis: empowering performance assessment." *IMA Journal of Management Mathematics* 34(3), 415. [Cited 18 times]
2. **Charles & Emrouznejad** (2024). "DEA-based index systems for addressing the United Nations' SDGs." *Environmental Science & Policy*. [Cited 8 times]
3. **Ratner, Lychev, Muravleva** (2025). "Measuring Circular Economy with Data Envelopment Analysis: A Systematic Literature Review." *Mathematical and Computational Applications*. [Cited 6 times]
4. **Le & Lu** (2025). "Charting the Landscape of Data Envelopment Analysis in Renewable Energy and Carbon Emission Efficiency." *Energies*.
5. **Wei & Yuan** (2025). "A study on the technological innovation efficiency of China's high-tech industries based on three-stage DEA and Malmquist index." *Operational Research*.

### Latest Methodological Innovations

1. **Inverse DEA**: Instead of measuring efficiency, inverse DEA determines what input/output changes are needed to achieve a target efficiency. Major advances by Emrouznejad & Amin (2023).
2. **Dynamic Network DEA (DN-DEA)**: Models with intertemporal linkages and internal sub-processes, allowing assessment of efficiency over time.
3. **Three-stage DEA with Malmquist Index**: Combining environmental variable adjustment with productivity change decomposition.
4. **DEA for Sustainable Development Goals (SDGs)**: Novel index systems for benchmarking countries/regions against UN SDGs.
5. **Fuzzy and stochastic DEA**: Handling uncertain/imprecise data in efficiency measurement.
6. **DEA-ML Hybrid Models**: Using machine learning to supplement DEA — e.g., random forests for variable selection, neural networks for nonlinear frontier estimation.

### Evolution (Last 5 Years)

- **2020–2021:** Traditional CCR/BCC models still dominated applications; network DEA gaining traction
- **2022–2023:** Surge in **inverse DEA** methods; environmental/sustainability applications grew rapidly
- **2024–2025:** Integration with **circular economy measurement**, renewable energy efficiency, and SDG benchmarking
- **2025–2026:** Emerging **DEA + AI hybrid approaches** — using ML for pre-processing and post-analysis of DEA results

### Key Open Problems

1. **Big Data DEA**: Scaling DEA to millions of decision-making units with high-dimensional inputs/outputs
2. **Causal DEA**: Moving beyond efficiency measurement to understanding causal drivers of inefficiency
3. **Real-time DEA**: Dynamic efficiency monitoring with streaming operational data
4. **Robust DEA**: Methods that are insensitive to outliers and data errors
5. **DEA for complex networks**: Modeling multi-level, multi-period organizational structures

### Future Directions

- AI-powered automated DEA model selection
- DEA for healthcare system benchmarking at national scale
- Integration of DEA with causal inference methods
- Blockchain-verified DEA for transparent public sector benchmarking

---

<a name="area-6"></a>
## Area 6: Multi-Criteria Decision Making (MCDM/MADM/MODM)

### Key Professors & Research Groups

| Professor/Author | Affiliation | Focus |
|-----------|------------|-------|
| **Dragan Pamucar** | University of Belgrade | MCDM methodology, hybrid AI-MCDM |
| **Edmundas Kazimieras Zavadskas** | Vilnius Gediminas Technical University | MCDM in construction/engineering |
| **Kalyanmoy Deb** | Michigan State University | Multi-objective evolutionary optimization (NSGA-II, NSGA-III) |
| **Jiuping Xu** | Sichuan University | MODM for supply chain, healthcare |
| **Cengiz Kahraman** | Istanbul Technical University | Fuzzy MCDM, intuitionistic/neutrosophic extensions |

### Recent Papers (2023–2026)

1. **Kumar & Pamucar** (2025). "A comprehensive and systematic review of MCDM methods: two decades from 2004 to 2024." *Spectrum of Decision Making and Applications*. [Cited 114 times]
2. **Vo & Nguyen** (2024). *Multi-Criteria Decision-Making and Optimum Design with Machine Learning: A Practical Guide* (Book, CRC Press).
3. **Baydaş & Ersoy** (2025). "Artificial intelligence-assisted MCDM methodology: from research trends to the future roadmap." *Türk Doğa ve Fen Dergisi*.
4. **Demir** (2025). "The synergy of fuzzy logic and multi-criteria decision-making: Application areas and global trends." *J. Intelligent Decision Making and Information Systems*.
5. **Alsaedi & Varnamkhasti** (2024). "Integrating multi-criteria decision analysis with deep reinforcement learning: A novel framework for intelligent decision-making." *International J. Mathematical Modelling and Computations*.
6. **Phruksaphanrat** (2024). "Comparative study of machine learning techniques for inventory classification based on MCDM." *ACM Int. Conf. on Machine Learning Technologies*.

### Integration of MCDM with AI/ML

The most transformative trend in MCDM (2023–2026) is the **deep integration with AI**:

1. **ML for weight elicitation**: Using neural networks and evolutionary algorithms to learn MCDM weights from data instead of expert judgment
2. **Deep Reinforcement Learning + MCDM**: DRL agents that use MCDM frameworks for multi-objective reward shaping (Alsaedi et al., 2024)
3. **Explainable AI (XAI) via MCDM**: Using AHP/TOPSIS to select and rank XAI methods (Matejová & Paralič, 2025)
4. **Fuzzy-Neural MCDM Hybrids**: Combining intuitionistic fuzzy sets with deep learning for handling linguistic uncertainty
5. **AutoMCDM**: Automated MCDM method selection using meta-learning

### Evolution (Last 5 Years)

- **2020–2021:** Classical AHP, TOPSIS, VIKOR, PROMETHEE remained dominant; fuzzy extensions proliferated
- **2022–2023:** Neutrosophic and spherical fuzzy extensions; first systematic AI-MCDM integration attempts
- **2024–2025:** **Deep learning + MCDM** hybrids emerged; books published on ML-MCDM integration; applications to XAI method selection
- **2025–2026:** Emergence of **large-scale MCDM** with thousands of alternatives/criteria, powered by ML preprocessing

### Key Open Problems

1. **Scalability**: Traditional MCDM methods break down with thousands of criteria and alternatives
2. **Consistency in AI-augmented weights**: Ensuring that ML-derived weights satisfy consistency axioms
3. **Uncertainty representation**: Moving beyond fuzzy to probabilistic/distributional approaches
4. **Group MCDM with AI mediation**: Using AI to reconcile divergent expert preferences
5. **Dynamic/temporal MCDM**: Decision-making where criteria and alternatives evolve over time

### Future Directions

- LLM-powered preference elicitation for MCDM
- Real-time multi-objective optimization with MCDM for autonomous systems
- MCDM for AI governance and ethical AI assessment
- Integration of MCDM with digital twin decision support systems

---

<a name="area-7"></a>
## Area 7: Healthcare Systems Operations Research

### Key Professors & Labs

| Professor | Affiliation | Lab/Group | Focus |
|-----------|------------|-----------|-------|
| **Dimitris Bertsimas** | MIT Sloan / ORC | — | Personalized medicine, health care quality, drug surveillance, diabetes/cancer therapies, hospital operations |
| **Georgia Perakis** | MIT Sloan / ORC | — | Healthcare analytics, predictive/prescriptive analytics |
| **Retsef Levi** | MIT Sloan / ORC | — | Food safety, healthcare algorithms |
| **Nikos Trichakis** | MIT Sloan / ORC | — | Health management, analytics, optimization |
| **David Sontag** | MIT EECS / ORC | Clinical Machine Learning Group | Machine learning for healthcare, graphical models, causal inference |
| **Joseph Doyle** | MIT Sloan / ORC | — | Health economics, measuring healthcare quality |
| **Arnold Barnett** | MIT Sloan / ORC | — | Risk analysis, health, probability modeling |

### Recent Papers (2023–2026)

1. **Bertsimas et al.** — Ongoing series on personalized diabetes management (published in *Diabetes Care*), gastric cancer treatment optimization.
2. **Cohen, Dai, Perakis et al.** (2026). "OM Forum — Supply Chain Management in the AI Era." *M&SOM*. — Includes healthcare supply chain applications.
3. **ML4H Symposium** (2024). "Recent Advances, Applications and Open Challenges in Machine Learning for Health." *arXiv:2502.06693*. — Comprehensive overview of ML in healthcare.
4. **MIT IMES Annual Report** (2025). New two-part course on "Artificial Intelligence in Healthcare" launched at MIT in 2024–2025.
5. **Thompson et al.** (2024). "Applying queueing theory to evaluate wait-time-savings of triage algorithms." *Queueing Systems*. — AI-enabled triage queueing models.

### Bertsimas Healthcare Research Program

Dimitris Bertsimas has built one of the world's largest healthcare OR research programs at MIT. His principal healthcare interests include:
- **Personalized medicine** — adjusting treatment based on patient genomic/phenotype characteristics
- **Prediction of healthcare risk** — ML models for early disease detection
- **Quality in healthcare** — measuring and optimizing hospital performance
- **Drug surveillance** — monitoring adverse drug effects
- **Multidrug therapies in cancer** — optimizing combination therapies
- **Diabetes therapies** — personalized insulin/medication management
- **Hospital operations** — bed management, scheduling, resource allocation

### Frontier Problems in Healthcare OR

1. **AI-powered clinical decision support** — integrating ML predictions with optimization for treatment planning
2. **Equitable resource allocation** — fair distribution of scarce healthcare resources (vaccines, organs, ICU beds)
3. **Pandemic preparedness modeling** — robust optimization for surge capacity under deep uncertainty
4. **Precision public health** — using OR to target population-level interventions
5. **Mental health operations** — scheduling and capacity planning for mental health services (acute shortage area)
6. **Workforce planning** — optimizing nurse/physician staffing under uncertainty (NHS and global shortage context)
7. **Surgical scheduling under uncertainty** — stochastic optimization for operating room allocation
8. **Supply chain for pharmaceuticals** — cold chain optimization, drug shortage mitigation

### Evolution (Last 5 Years)

- **2020–2022:** COVID-19 dominated — vaccine distribution optimization, ventilator allocation, pandemic forecasting. Bertsimas published COVID analytics work.
- **2023–2024:** Shift to **personalized medicine at scale** using large health datasets; clinical ML models gaining FDA attention
- **2025–2026:** **Generative AI in healthcare** — LLMs for clinical decision support; AI-powered drug discovery optimization; digital twins of hospital systems

### Future Directions

- Integration of wearable/IoT data with hospital optimization models
- Federated learning for privacy-preserving healthcare OR
- OR for health equity — optimization models that explicitly incorporate fairness constraints
- Real-time hospital digital twins for operational decision-making

---

<a name="area-8"></a>
## Area 8: Integration of Forecasting with Optimization

### Key Professors & Research Groups

| Professor | Affiliation | Focus |
|-----------|------------|-------|
| **Adam Elmachtoub** | Columbia University | Smart Predict-then-Optimize (SPO) framework, decision-focused learning |
| **Paul Grigas** | UC Berkeley | Predict-then-optimize, contextual optimization |
| **Priya Donti** | MIT EECS/LIDS (New faculty, 2024) | Machine learning for optimization in power/energy systems, task-based end-to-end learning |
| **Dimitris Bertsimas** | MIT Sloan / ORC | Prescriptive analytics, data-driven optimization |
| **Georgia Perakis** | MIT Sloan / ORC | Predictive + prescriptive analytics |
| **Zuo-Jun Max Shen** | UC Berkeley / HKU | Contextual optimization, decision-focused learning |

### Recent Papers (2023–2026)

1. **Yang, Liang, Su et al.** (2025). "DFF: Decision-Focused Fine-Tuning for Smarter Predict-then-Optimize with Limited Data." *AAAI 2025*. [Cited 9 times]
2. **Zhang & Li** (2026). "A Review of End-to-End Decision Optimization Research: An Architectural Perspective." *Algorithms*.
3. **Wang, Wang, Zhang, Song** (2025). "Bridging Prediction and Decision: Advances and Challenges in Data-Driven Optimization." *Nexus (Cell Press)*. [Cited 20 times]
4. **Wan, Liu, Grigas, Shen** (2026). "Decision-Focused Sequential Experimental Design: A Directional Uncertainty-Guided Approach." *arXiv:2602.05340*.
5. **Yi, Wu, Alghumayjan, Anderson** (2025). "A Decision-Focused Predict-then-Bid Framework for Strategic Energy Storage." *arXiv:2505.01551*.
6. **Smets, Delarue, Toubeau** (2025). "Forecasting Electricity Prices With Decision-Focused Learning for Storage Optimization." *IEEE Conf. European Energy Market*.
7. **Cao & Xu** (2025). "An End-to-End Approach for Microgrid Probabilistic Forecasting and Robust Operation via Decision-focused Learning." *arXiv:2512.12755*.

### The Predict-then-Optimize Framework: State of the Art

#### Traditional Approach (Two-Stage)
1. **Stage 1 (Predict):** Train a forecasting model to minimize prediction error (e.g., MSE, CRPS)
2. **Stage 2 (Optimize):** Use forecasted parameters as inputs to an optimization model

**Problem:** Minimizing prediction error does not equal minimizing decision cost. A forecast that is slightly worse in MSE but better aligned with the optimization structure can yield much better decisions.

#### Decision-Focused Learning (End-to-End)
The key innovation is training the prediction model to minimize the **downstream decision loss** (regret):

Regret(θ̂) = f(x*(θ̂), θ_true) - f(x*(θ_true), θ_true)

Where x*(θ̂) is the optimal decision under predicted parameters and θ_true are the true parameters.

#### Key Methods:
- **SPO+ Loss** (Elmachtoub & Grigas): A convex surrogate for the SPO loss, enabling gradient-based training
- **Differentiable Optimization Layers**: Backpropagating through optimization problems (e.g., OptNet, cvxpylayers)
- **Decision-Focused Fine-Tuning (DFF)**: Fine-tuning pretrained forecasting models with decision loss (AAAI 2025)
- **Contrastive Predict-then-Optimize**: Using contrastive learning to align prediction and decision objectives

### Evolution (Last 5 Years)

- **2020–2021:** SPO+ framework established as the theoretical foundation; early demonstrations on small-scale problems
- **2022–2023:** Scaling to real-world problems (energy, transportation); differentiable optimization layers matured
- **2024–2025:** **Decision-focused fine-tuning** of foundation models; applications to energy storage bidding, vehicle routing, inventory control
- **2025–2026:** Integration of **probabilistic forecasting with robust optimization** in end-to-end frameworks; decision-focused sequential experimental design

### Key Open Problems

1. **Computational tractability**: Backpropagating through integer programs remains extremely challenging
2. **Generalization**: Decision-focused models can overfit to the training optimization instances
3. **When does end-to-end help?**: Theoretical characterization of when decision-focused learning significantly outperforms two-stage
4. **Multi-period/sequential settings**: Extending to dynamic, multi-stage optimization problems
5. **Fairness and robustness**: Ensuring decision-focused models don't exploit distributional shortcuts
6. **Foundation model integration**: How to decision-focus fine-tune time series foundation models

### Future Directions

- Decision-focused foundation models (pre-trained for optimization tasks)
- End-to-end learning for stochastic/robust optimization with probabilistic forecasts
- Decision-focused learning for multi-agent/game-theoretic settings
- Automated pipeline selection: when to use end-to-end vs. two-stage

---

## Cross-Cutting Themes Across All Areas

### 1. The Data-Driven Revolution
Every area reviewed shows a shift from model-based to **data-driven approaches**, with ML supplementing or replacing traditional mathematical models.

### 2. Foundation Models & LLMs
The influence of large pretrained models is spreading from NLP to:
- Time series forecasting (Lag-Llama, TimesFM, Chronos)
- Financial decision-making (Lo's LLM economicus research)
- Supply chain optimization (Cohen et al., 2026)

### 3. End-to-End Integration
The traditional pipeline of "forecast → decide" is being replaced by **joint optimization of prediction and decision**, across supply chains, energy, finance, and healthcare.

### 4. Fairness and Ethics
Growing attention to:
- Equitable healthcare resource allocation
- Bias in forecasting (Rostami-Tabar et al., 2025)
- Fair queueing policies
- Responsible AI in MCDM

### 5. Sustainability
DEA for SDGs, green supply chain optimization, climate finance (Lo), circular economy measurement — sustainability is now a first-class optimization objective.

---

## Summary Table: Key Researchers by Area

| Area | Top Researchers | Top University |
|------|----------------|---------------|
| Stochastic Opt. / Inventory | Bertsimas, Simchi-Levi, Perakis, Ye | **MIT** |
| Probabilistic Forecasting | Hyndman, Rostami-Tabar, Gal | **Monash/Oxford** |
| Queueing Theory / Healthcare | Bertsimas, Gamarnik, Larson, Gershwin | **MIT** |
| Portfolio Optimization / Fintech | Lo, Mulvey, Oxford-Man Institute | **MIT/Oxford** |
| DEA | Emrouznejad, Amin, Charles | **Surrey/Bradford** |
| MCDM | Pamucar, Deb, Kahraman | **Belgrade/MSU** |
| Healthcare OR | Bertsimas, Sontag, Perakis, Trichakis | **MIT** |
| Forecasting + Optimization | Elmachtoub, Grigas, Donti, Shen | **Columbia/Berkeley/MIT** |

---

*Note: This report synthesizes information from university websites, Google Scholar, published papers, and institutional reports. Some paper details may require verification against the original sources. The field is rapidly evolving — papers from late 2025 and 2026 may be preprints.*
