# PhD Research Roadmap: Navid Sharifi × Professor Bahman Rostami-Tabar — Cardiff University

> **Prepared**: April 18, 2026  
> **Purpose**: Interview preparation, research alignment analysis, and global research landscape mapping

---

## Table of Contents

1. [Professor Rostami-Tabar: A Chronological Research Narrative](#1-professor-rostami-tabar-a-chronological-research-narrative)
2. [Navid Sharifi: Profile & Research Identity](#2-navid-sharifi-profile--research-identity)
3. [Research Alignment & Potential PhD Proposals](#3-research-alignment--potential-phd-proposals)
4. [Global Research Landscape at Top Universities](#4-global-research-landscape-at-top-universities)
5. [Area-by-Area Deep Dive](#5-area-by-area-deep-dive)
6. [Synthesis & Recommended PhD Directions](#6-synthesis--recommended-phd-directions)

---

## 1. Professor Rostami-Tabar: A Chronological Research Narrative

### Phase 1: Foundations — Temporal Aggregation & Demand Forecasting (Pre-2022)

Bahman Rostami-Tabar's academic trajectory began with a fundamental question in operations research: **does aggregating demand data in time improve forecast accuracy?** His early work on *Demand Forecasting by Temporal Aggregation* established him in supply chain forecasting. He proved that when demand follows MA(1) or AR(1) processes and Single Exponential Smoothing (SES) is used, temporal aggregation can systematically improve Mean Squared Error — but only under specific conditions tied to the aggregation level, smoothing constant, and process parameters. This was precise, parametric, classical OR work.

This line led naturally to **hierarchical and cross-sectional aggregation** in supply chains. His 2022 review paper *"Demand Forecasting in Supply Chains: A Review of Aggregation and Hierarchical Approaches"* synthesised the entire literature on how forecasts at different levels of a supply chain hierarchy (SKU, product family, category) can be combined, reconciled, or disaggregated for better accuracy. He argued that neither pure top-down nor pure bottom-up approaches make the fullest use of available data — a position now mainstream in the forecasting community.

### Phase 2: The Encyclopedic Vision — Forecasting Theory & Practice (2022)

The landmark paper *"Forecasting: Theory and Practice"* (September 2022) — his most cited work — was an encyclopedic, multi-author review covering the entire state of the art: from ARIMA and exponential smoothing to neural networks, Bayesian methods, judgmental forecasting, forecast combination, and probability forecasting. Key themes:

- **Probability forecasts** are essential, not optional — decision-makers need quantified uncertainty
- **Forecast combination** (ensembles) consistently outperforms individual methods
- **Simple methods remain valuable** as part of diverse ensembles
- The field was at an inflection point between classical statistics and machine learning

This paper (h-index = 19, 2,410 citations) established Rostami-Tabar as a synthesiser and thought leader, not just a methodologist.

### Phase 3: Social Impact & Healthcare Forecasting (2022–2025)

A decisive pivot toward **forecasting for social good** — particularly healthcare and humanitarian supply chains — defined this period:

- **"The Missing Puzzle Piece"** (2025): Collaborated with the Ethiopian Pharmaceutical Supply Service. Showed that incorporating contextual factors (stock cycles, fiscal counts, seasonal disease outbreaks) into forecasting models dramatically improves pharmaceutical demand prediction. Evaluated statistical, ML, and foundational models. Advocated for **low-complexity, transparent methods** that can be sustained in resource-limited settings — a philosophy of practical impact over methodological sophistication.

- **"A Hybrid Predictive and Prescriptive Modelling Framework for Long-Term Mental Healthcare Workforce Planning"** (2025): The most integrated methodological work — combined **long-term probabilistic forecasting** with an **analytical stock-flow simulation model** for NHS mental health nursing workforce. Used multiple NHS data sources. Key finding: blanket national policies are ineffective; region-specific strategies are necessary. This paper embodies the **predict-then-prescribe** paradigm.

### Phase 4: Systems Thinking & Sustainability (2025–2026)

The most recent papers show a broadening scope:

- **"What Makes the Contribution of Science Towards a Sustainable Future So Difficult?"** (2026): A transdisciplinary, philosophical paper on why science struggles to deliver on the SDGs. Identifies controversies: technology optimism vs. societal advancement, disciplinary vs. interdisciplinary approaches, global vs. local knowledge. This signals his growing interest in **systems-level thinking** and science policy.

- **"The Role of Technology in Developing Resilient Supply Chains"** (2026): Systematic review of how Industry 4.0 technologies (blockchain, AI, IoT, digital twins) help supply chains recover from COVID-19 and economic sanctions. Highlights the gap between technological promise and practical performance, especially in humanitarian contexts.

### Summary Arc

```
Temporal Aggregation → Hierarchical Forecasting → Encyclopedic Synthesis →
Healthcare/Humanitarian Forecasting → Predict+Prescribe Hybrid Models →
Supply Chain Resilience → Systems Thinking & Sustainability
```

**Core identity**: Probabilistic forecasting methodologist who increasingly applies his work to **social good** (healthcare, humanitarian logistics, sustainability), with a strong preference for **practical, transparent, reproducible** methods over black-box complexity.

---

## 2. Navid Sharifi: Profile & Research Identity

### Background
- **BSc Industrial Engineering**, University of Kurdistan (2013–2018)
- **Current role**: Business Analyst with PM and data analytics experience
- **Industry experience**: EPC project control (TAM Iran Khodro / Foolad Mobarake), fleet management & inventory control (Varo Dynamics), healthcare data analytics (Tasvir Teb Humerz / Sina Hospital)
- **Technical toolkit**: GAMS, Python, Power BI, SQL, Primavera P6, Excel VBA, discrete-event simulation

### Research Interests

| Methodology | Applications |
|---|---|
| Stochastic Optimisation | Fintech & Risk Management (Portfolio Optimisation) |
| Probabilistic Forecasting & Queue Theory | Healthcare Systems |
| Multi-Attribute Decision Making (MADM) | Supply Chain & Logistics (Inventory Management) |
| Multi-Objective Decision Making (MODM) | |
| Data Envelopment Analysis (DEA) | |

### Distinctive Strengths
- **Rare combination**: OR methodology + real industrial PM experience + healthcare analytics
- **Simulation-oriented**: Interested in DES, simulation-based optimisation
- **Applied mindset**: Has actually built inventory control systems (EOQ), cost function models (GAMS), and BI dashboards in production environments
- Blog on probabilistic forecasting + stochastic optimisation for inventory control shows deep conceptual engagement

---

## 3. Research Alignment & Potential PhD Proposals

### 3.1 Alignment Matrix

| Dimension | Rostami-Tabar | Sharifi | Overlap Strength |
|---|---|---|:---:|
| Probabilistic Forecasting | **Core expertise** — temporal aggregation, hierarchical forecasting, prediction distributions | **Strong interest** — blog writing, conceptual engagement | ★★★★★ |
| Inventory Management / Supply Chain | Applied forecasting context; resilient supply chains | **Direct experience** — EOQ systems, fleet management, GAMS modelling | ★★★★★ |
| Healthcare Systems | Mental health workforce planning, pharmaceutical supply chains (Ethiopia), NHS collaboration | Hospital data analytics (Sina Hospital), interested in healthcare OR | ★★★★☆ |
| Stochastic Optimisation | Implicit in predict-then-prescribe framework; seeks students in this area | **Primary methodological interest** | ★★★★☆ |
| Simulation & Hybrid Models | Stock-flow simulation for workforce planning | DES experience, simulation-based optimisation interest | ★★★★☆ |
| Queue Theory | Not a primary focus, but healthcare resource allocation is related | **Explicit interest** — queue systems in logistics | ★★★☆☆ |
| DEA | Not a focus | Interest area | ★★☆☆☆ |
| MADM / MODM | Not a focus | Interest area | ★★☆☆☆ |
| Reproducibility & Open Science | Strong advocate (R, Python, Quarto, open code/data) | Python, analytical tooling | ★★★★☆ |
| Social Good / SDGs | **Central mission** — training 500+ NHS analysts, humanitarian supply chains | Not explicit, but healthcare work aligns | ★★★☆☆ |

### 3.2 High-Alignment PhD Proposal Ideas

---

#### Proposal 1: **Probabilistic Forecasting Meets Stochastic Optimisation for Inventory Control in Healthcare Supply Chains**

**The Gap**: Rostami-Tabar's 2025 Ethiopia paper showed that contextual probabilistic forecasting dramatically improves pharmaceutical demand prediction. But the paper stops at forecasting — it does not close the loop to inventory decisions. Meanwhile, classical inventory theory uses simplistic demand assumptions (Normal, Poisson). There is a clear gap: **how should full predictive distributions from modern probabilistic forecasting models feed into stochastic inventory optimisation to determine order quantities, reorder points, and safety stocks in pharmaceutical supply chains?**

**Your Unique Angle**: Your GAMS experience with cost functions, EOQ implementation, and stochastic optimisation interest directly addresses the prescriptive side. You would extend Rostami-Tabar's forecasting pipeline into a **predict-then-optimise** framework.

**Methods**: Probabilistic forecasting (ETS, ARIMA, ML ensembles) → Full predictive distributions → Stochastic programming / newsvendor extensions → Evaluation on Ethiopian pharmaceutical data or NHS data.

**Impact**: Directly actionable for low-resource healthcare supply chains. Aligns with Rostami-Tabar's social good mission and your optimisation expertise.

**Fit Score**: ★★★★★

---

#### Proposal 2: **A Hybrid Forecasting-Simulation Framework for NHS Mental Health Resource Allocation Under Uncertainty**

**The Gap**: Rostami-Tabar's 2025 workforce planning paper used stock-flow simulation. But mental health services also involve **queueing dynamics** — patients waiting for appointments, therapists with varying capacities, referral pathways with stochastic service times. A discrete-event simulation approach, combined with probabilistic demand forecasting, could model these dynamics more granularly than stock-flow.

**Your Unique Angle**: Your DES interest + queue theory knowledge + healthcare analytics experience (Sina Hospital) make you uniquely positioned to extend the workforce planning model into an operational-level resource allocation model.

**Methods**: Probabilistic forecasting of patient arrivals → DES of mental health service pathways → Queue-theoretic analysis of bottlenecks → Multi-objective optimisation (cost vs. waiting time vs. equity).

**Impact**: Directly relevant to NHS mental health crisis. Combines Rostami-Tabar's forecasting + healthcare focus with your simulation and MODM skills.

**Fit Score**: ★★★★★

---

#### Proposal 3: **Decision-Focused Probabilistic Forecasting for Supply Chain Resilience Under Disruption**

**The Gap**: Rostami-Tabar's 2026 resilient supply chain paper identifies the gap between technological promise and practical performance. Traditional approaches forecast demand first, then optimise separately. The cutting-edge "predict-then-optimise" (SPO+) framework from Elmachtoub & Grigas (2022) trains forecasting models to minimise downstream decision cost rather than forecast error. **This has not been applied to supply chain resilience under disruption scenarios.**

**Your Unique Angle**: Combines your stochastic optimisation interest with probabilistic forecasting in a novel end-to-end framework. Your PM experience with real supply chain disruptions (EPC projects) gives you practical understanding of disruption dynamics.

**Methods**: Decision-focused learning → Stochastic programming with recourse → Scenario-based disruption modelling → Evaluation on real supply chain data.

**Impact**: Bridges Rostami-Tabar's two 2025–2026 papers. Methodologically novel.

**Fit Score**: ★★★★☆

---

#### Proposal 4: **Efficiency and Equity in Pharmaceutical Distribution: A DEA-Forecasting Integrated Approach**

**The Gap**: Rostami-Tabar's Ethiopia work focuses on forecast accuracy. But a parallel question is: **how efficiently are pharmaceutical distribution centres converting resources (budget, staff, vehicles) into health outcomes (medicine availability, stockout rates)?** DEA can measure this efficiency. Combining DEA efficiency scores with probabilistic demand forecasts could identify which facilities need what kind of intervention — more resources vs. better forecasting vs. process improvement.

**Your Unique Angle**: Directly leverages your DEA expertise alongside Rostami-Tabar's pharmaceutical forecasting data and methods.

**Methods**: DEA efficiency measurement → Probabilistic forecasting quality as an input/output variable → Two-stage analysis → Policy recommendations.

**Impact**: Novel methodological integration. Practical for health ministries in developing countries.

**Fit Score**: ★★★☆☆

---

#### Proposal 5: **Multi-Objective Stochastic Optimisation for Humanitarian Supply Chain Network Design**

**The Gap**: Rostami-Tabar's resilient supply chain review identifies the need for frameworks that balance multiple objectives (cost, responsiveness, equity) under uncertainty. Classical humanitarian logistics optimisation uses deterministic or scenario-based approaches. Combining probabilistic forecasting with multi-objective stochastic programming, evaluated through simulation, would address this gap.

**Your Unique Angle**: MODM + stochastic optimisation + supply chain — your core methodological trifecta applied to Rostami-Tabar's humanitarian supply chain interest.

**Methods**: Multi-stage stochastic programming → Pareto frontier analysis → DES validation → Real humanitarian data.

**Impact**: Directly addresses SDG-related humanitarian logistics. High practical relevance.

**Fit Score**: ★★★★☆

---

## 4. Global Research Landscape at Top Universities

### Impact Summary Table

| Research Area | Impact Rating | Leading Groups | Trend Direction |
|---|:---:|---|---|
| Stochastic Optimisation | **9/10** | MIT (Bertsimas, Simchi-Levi), Stanford (Ye), Oxford | Classical → Data-driven/DRO |
| Probabilistic Forecasting | **8/10** | Oxford, MIT, Stanford | Statistical → Foundation models |
| Queue Theory (Healthcare) | **8/10** | MIT (Gamarnik, Bertsimas), Stanford | Analytical → AI-augmented |
| Portfolio Optimisation / Fintech | **9/10** | Oxford (Man Institute), MIT (Lo), Stanford | Mean-variance → ML + stochastic |
| Healthcare Systems OR | **10/10** | MIT (Bertsimas), Harvard (CHDS), Oxford | Siloed → Integrated predict+prescribe |
| Supply Chain & Inventory | **9/10** | MIT (Simchi-Levi), Cambridge (IfM) | Deterministic → Probabilistic + RL |
| MADM/MCDM | **6/10** | Various (Pamucar, Zavadskas) | Standalone → AI-integrated |
| MODM | **7/10** | MIT (Ozdaglar), Stanford | Classical → Deep RL + fairness |
| DEA | **5/10** | Cambridge (IfM), Ali Emrouznejad | Static → Dynamic + ML hybrid |

---

## 5. Area-by-Area Deep Dive

### 5.1 Stochastic Optimisation

#### Big Picture
Stochastic optimisation is experiencing a paradigm shift from classical two-stage stochastic programming (where probability distributions are assumed known) to **data-driven** and **distributionally robust** approaches (where decisions must be robust against ambiguity in the distribution itself).

#### Key Research Groups & Professors

| Professor | University | Focus |
|---|---|---|
| **Dimitris Bertsimas** | MIT (ORC) | Distributionally robust optimisation (DRO), prescriptive analytics, "from predictive to prescriptive" |
| **David Simchi-Levi** | MIT | Data-driven inventory management, revenue management |
| **Yinyu Ye** | Stanford | Convex optimisation, stochastic algorithms |
| **Alexandre Jacquillat** | MIT | Stochastic programming for transportation and energy |
| **Wolfram Wiesemann** | Oxford (Imperial) | Distributionally robust optimisation theory |
| **Georgia Perakis** | MIT | Analytics + optimisation for pricing and supply chain |

#### Evolution of the Field (2018–2026)

```
2018: Classical stochastic programming dominates
      ↓ (Bertsimas & Kallus, "From Predictive to Prescriptive Analytics")
2019: Data-driven optimisation gains traction — no distributional assumptions
      ↓ (Distributionally Robust Optimisation matures)
2020: DRO becomes mainstream — Wasserstein ambiguity sets
      ↓ (COVID disruptions expose fragility of point-estimate approaches)
2021-22: Online/adaptive stochastic optimisation — learning while deciding
      ↓ (Reinforcement learning enters inventory management)
2023-24: End-to-end predict-then-optimise (SPO+) — loss functions aligned with decisions
      ↓ (Contextual optimisation — feature-dependent decisions)
2025-26: Foundation models + optimisation — LLMs for scenario generation,
         neural combinatorial optimisation, quantum-inspired methods
```

#### Current Open Problems
1. **Scalability of DRO** to high-dimensional settings (thousands of SKUs)
2. **Online learning in non-stationary environments** — when demand distributions shift
3. **Integration of causal inference with stochastic optimisation** — counterfactual decision-making
4. **Multi-agent stochastic games** in supply chains — competing/cooperating agents
5. **Fairness in stochastic resource allocation** — equitable healthcare distribution

#### Key Recent Papers
- Bertsimas & Kallus, *"From Predictive to Prescriptive Analytics"*, Management Science, 2020
- Elmachtoub & Grigas, *"Smart Predict-then-Optimize for Hard Combinatorial Problems"*, Management Science, 2022
- Simchi-Levi et al., *"Data-Driven Inventory Management"*, Operations Research, 2023
- Bertsimas & Van Parys, *"Bootstrap Robust Prescriptive Analytics"*, Mathematical Programming, 2022
- Jacquillat & Perakis, *"A Practical Stochastic Optimization Framework"*, 2024

---

### 5.2 Probabilistic Forecasting & Queue Theory

#### Big Picture
Probabilistic forecasting has moved from being a niche concern (prediction intervals around point forecasts) to the **central paradigm** — driven by the realisation that downstream decisions require full uncertainty quantification. Simultaneously, **foundation models for time series** (analogous to GPT for language) are disrupting the field.

#### Key Research Groups & Professors

| Professor | University | Focus |
|---|---|---|
| **Tomasz Januschowski** | Amazon (ex-Stanford) | DeepAR, probabilistic deep learning for forecasting |
| **Yarin Gal** | Oxford | Uncertainty quantification in deep learning |
| **Arnaud Doucet** | Oxford | Sequential Monte Carlo, Bayesian methods |
| **David Shah** | MIT | Probabilistic time series, synthetic data |
| **Terry Lyons** | Oxford (DataSig) | Path signatures for time series |
| **David Gamarnik** | MIT | Queueing theory, stochastic processes |
| **Daniel Freund** | MIT | Healthcare queueing, appointment scheduling |

#### Evolution of the Field (2018–2026)

```
2018: Exponential smoothing + ARIMA with prediction intervals
      ↓ (DeepAR — Amazon's recurrent neural network for probabilistic forecasting)
2019: Quantile regression forests, conformal prediction gain traction
      ↓ (M4 Competition results — combinations win)
2020: Neural Hierarchical Interpolation for Time Series (N-HITS), N-BEATS
      ↓ (Conformal prediction provides distribution-free coverage guarantees)
2021-22: Transformer-based models (Temporal Fusion Transformer, Informer)
      ↓ (Copula-based multivariate probabilistic forecasting)
2023: Foundation models era begins — TimeGPT, Lag-Llama
      ↓ (Pre-trained on billions of time series, zero-shot forecasting)
2024-25: Chronos (Amazon), Moirai, TimesFM (Google), TimeDiT
      ↓ (Diffusion models for time series generation)
2025-26: Retrieval-augmented forecasting, context-aware foundation models,
         integration with decision-making (SPO+)
```

#### Queue Theory — Healthcare Focus

Modern queueing research has moved from classical M/M/c analysis toward:
- **Fluid models** for large healthcare systems (ED overcrowding)
- **Queueing networks with abandonments** (patients leaving without treatment)
- **Data-driven queueing** — estimating service rates from observational data
- **Digital twins of hospitals** — combining DES + real-time data + queueing theory
- **Fair queueing** — equity-aware scheduling in healthcare

**Key names**: Gamarnik (MIT), Bertsimas (MIT), Armony (Columbia), Whitt (Columbia), Mandelbaum (Technion)

#### Current Open Problems
1. **Calibration of probabilistic forecasts in non-stationary settings** — are 90% intervals really 90%?
2. **Coherent probabilistic hierarchical forecasting** — reconciling distributions across aggregation levels
3. **When do foundation models fail?** — distribution shift, sparse data, long horizons
4. **Combining domain knowledge with neural probabilistic forecasting**
5. **Queueing models with strategic (rational) customers** — patients choosing which hospital to visit
6. **Joint staffing and scheduling with probabilistic demand** — the forecasting-queueing-optimisation loop

#### Key Recent Papers
- Ansari et al., *"DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks"*, IJF, 2020
- Rasul et al., *"Lag-Llama: Towards Foundation Models for Probabilistic Time Series Forecasting"*, 2024
- Ansari et al., *"Chronos: Learning the Language of Time Series"*, 2024
- Athanasopoulos et al., *"Forecast Reconciliation: A Review"*, IJF, 2024
- Gamarnik & Zeevi, *"Validity of Heavy Traffic Approximations"*, Annals of Applied Probability, 2023

---

### 5.3 Multi-Attribute Decision Making (MADM)

#### Big Picture
MADM methods (AHP, TOPSIS, VIKOR, ELECTRE, PROMETHEE) have been workhorses for structured decision-making for decades. The current frontier is their **integration with AI/ML and fuzzy/uncertain environments**, though the field faces criticism for methodological fragmentation and lack of axiomatic foundations.

#### Evolution & Current State

```
Classical era: AHP (Saaty), TOPSIS, ELECTRE → well-established
2015-2020: Fuzzy extensions (intuitionistic, neutrosophic, Pythagorean)
2020-2023: Integration with ML — feature importance ↔ criteria weights
2024-2026: LLM-augmented decision making, automated MCDM, 
           group decision-making with social network analysis
```

#### Current Open Problems
1. **Rank reversal** — adding/removing alternatives changes rankings (fundamental criticism)
2. **Consistency between methods** — different MCDM methods give different rankings
3. **Axiomatic foundations** — many methods lack rigorous theoretical justification
4. **High-dimensional criteria** — when criteria number in the hundreds
5. **Integration with optimisation** — using MCDM preferences in mathematical programming

#### Key Professors
- Dragan Pamucar (University of Belgrade) — novel MCDM extensions
- Cengiz Kahraman (Istanbul Technical) — fuzzy MCDM
- Huchang Liao (Sichuan University) — hesitant fuzzy MCDM
- Edmundas Zavadskas (Vilnius Gediminas) — pioneering MCDM in engineering

**Impact Rating: 6/10** — High publication volume but methodological saturation. Impact is strongest when MCDM is combined with other OR methods (optimisation, simulation) rather than standalone.

---

### 5.4 Multi-Objective Decision Making (MODM)

#### Big Picture
MODM has been revolutionised by the convergence with **deep reinforcement learning** and **fairness-aware optimisation**. Classical Pareto-based evolutionary algorithms (NSGA-II, MOEA/D) remain standard, but new directions include learning Pareto fronts with neural networks and incorporating equity/fairness as objectives.

#### Key Research Groups

| Professor | University | Focus |
|---|---|---|
| **Asu Ozdaglar** | MIT | Multi-objective optimisation in networks |
| **Pablo Parrilo** | MIT | Convex relaxations, polynomial optimisation |
| **Kaisa Miettinen** | University of Jyväskylä | Interactive multi-objective optimisation |
| **Kalyanmoy Deb** | Michigan State | NSGA-III, evolutionary multi-objective |

#### Evolution & Current State

```
Pre-2018: NSGA-II, MOEA/D dominate
2018-2020: Many-objective optimisation (>3 objectives) — reference-point methods
2020-2023: Multi-objective RL — learning policies that cover the Pareto front
2023-2025: Multi-objective Bayesian optimisation for expensive simulations
2025-2026: LLM-guided multi-objective search, fairness-aware multi-objective
```

#### Current Open Problems
1. **Scalability to many objectives** (>10 objectives)
2. **Multi-objective optimisation under uncertainty** — robust Pareto frontiers
3. **Human-in-the-loop multi-objective optimisation** — preference learning
4. **Multi-objective bilevel programming** — leader-follower games with multiple objectives
5. **Multi-fidelity multi-objective optimisation** — using cheap approximations efficiently

**Impact Rating: 7/10** — Strong theoretical foundation with growing applied relevance, especially when combined with simulation-based optimisation for healthcare and supply chains.

---

### 5.5 Data Envelopment Analysis (DEA)

#### Big Picture
DEA, the non-parametric method for measuring relative efficiency of decision-making units, has matured significantly. Recent innovations focus on **dynamic DEA**, **network DEA**, **DEA under uncertainty**, and **hybrid DEA-ML methods**.

#### Key Professors
- **Ali Emrouznejad** (University of Surrey) — DEA with big data, ML integration
- **Joe Zhu** (Worcester Polytechnic) — network DEA, benchmarking
- **Kaoru Tone** (GRIPS, Tokyo) — SBM model, non-radial DEA
- **Vincent Charles** (University of Bradford) — DEA in healthcare

#### Evolution & Current State

```
Classical: CCR/BCC models, radial efficiency
2015-2018: Network DEA, dynamic DEA, undesirable outputs
2018-2022: Two-stage DEA with regression, bootstrapped DEA
2022-2024: DEA + ML hybrids — random forests for weight selection
2024-2026: Inverse DEA (finding inputs to achieve target outputs),
           DEA with natural language processing, environmental DEA
```

#### Current Open Problems
1. **Curse of dimensionality** — DEA loses discriminating power with many inputs/outputs
2. **Statistical inference in DEA** — bootstrapping methods still debated
3. **DEA for network systems** — hospitals as networks of departments
4. **Integration of DEA with stochastic frontier analysis** — combining parametric and non-parametric
5. **Real-time DEA** — continuous efficiency monitoring with streaming data

**Impact Rating: 5/10** — Methodologically mature. Highest impact when applied to healthcare efficiency measurement or combined with other OR methods (forecasting, optimisation).

---

### 5.6 Fintech & Risk Management (Portfolio Optimisation)

#### Big Picture
Portfolio optimisation is experiencing a renaissance driven by the convergence of **stochastic optimisation**, **machine learning**, and **alternative data**. The field has moved far beyond Markowitz mean-variance toward robust, multi-period, multi-asset approaches.

#### Key Research Groups

| Professor/Lab | University | Focus |
|---|---|---|
| **Andrew Lo** | MIT (Laboratory for Financial Engineering) | Adaptive Markets Hypothesis, AI in finance |
| **Oxford-Man Institute** | Oxford | Machine learning for quantitative finance |
| **John Mulvey** | Princeton | Multi-stage stochastic portfolio optimisation |
| **Yinyu Ye** | Stanford | Robust optimisation in finance |
| **Kay Giesecke** | Stanford | Computational methods for financial risk |

#### Evolution & Current State

```
Classical: Markowitz mean-variance, Black-Litterman
2018-2020: Robust portfolio optimisation (DRO approaches)
2020-2022: Deep RL for dynamic portfolio management
2022-2024: Factor models + ML (tree-based, neural), LLM-based sentiment
2024-2026: Foundation models for financial time series, 
           quantum computing for portfolio optimisation,
           ESG-integrated stochastic programming
```

#### Current Open Problems
1. **Transaction costs in continuous-time optimisation** — realistic models are computationally hard
2. **Non-stationary risk measures** — CVaR, EVaR under regime switching
3. **Explainability of ML-based portfolio models** — regulatory requirement
4. **Climate risk integration** — stress testing portfolios against climate scenarios
5. **Decentralised finance (DeFi) portfolio optimisation** — new asset classes, extreme volatility

#### Key Recent Papers
- Lo, *"Adaptive Markets: Financial Evolution at the Speed of Thought"*, 2017 (foundational)
- Ban et al., *"Machine Learning and Portfolio Optimization"*, Management Science, 2018
- Bertsimas & Cory-Wright, *"A Scalable Algorithm for Sparse Portfolio Selection"*, 2022
- Lo & Zhang, *"The Biases of Large Language Models in Financial Decision Making"*, 2024
- Oxford-Man Institute, *"Deep Reinforcement Learning for Portfolio Management"*, 2024

**Impact Rating: 9/10** — Extremely high both in academic and industry impact. Massive investment from fintech industry.

---

### 5.7 Healthcare Systems — Operations Research

#### Big Picture
Healthcare OR is arguably the **highest-impact application area** in the entire OR/MS field right now. COVID-19 demonstrated the catastrophic cost of poor planning. The frontier has moved from siloed problems (scheduling, staffing) to **integrated predictive-prescriptive systems** that span forecasting, optimisation, and simulation.

#### Key Research Groups

| Professor/Lab | University | Focus |
|---|---|---|
| **Dimitris Bertsimas** | MIT | COVID analytics, treatment optimisation, resource allocation |
| **Georgia Perakis** | MIT | Healthcare pricing, demand management |
| **Retsef Levi** | MIT | Healthcare operations, supply chain |
| **David Sontag** | MIT (CSAIL) | ML for clinical decision making |
| **Health Decision Science** | Harvard T.H. Chan School | Cost-effectiveness analysis, policy modelling |
| **John Doyle** | Oxford (Saïd) | NHS performance, healthcare analytics |

#### Frontier Problems in Healthcare OR
1. **Long-term workforce planning under deep uncertainty** — exactly Rostami-Tabar's focus
2. **Real-time hospital bed management** — combining forecasting + queueing + scheduling
3. **Pharmaceutical supply chain in low-resource settings** — Rostami-Tabar's Ethiopia work
4. **Mental health service design** — growing crisis, minimal OR attention historically
5. **Fairness and equity in healthcare resource allocation** — who gets the ICU bed?
6. **Digital twins of hospitals** — combining DES, agent-based models, and real-time data
7. **Pandemic preparedness models** — next pandemic response planning
8. **Integration of clinical ML with operational decisions** — diagnosis → treatment → resource allocation

#### Key Recent Papers
- Bertsimas et al., *"An Analytics Approach to COVID-19 Vaccine Allocation"*, Health Care Management Science, 2022
- Rostami-Tabar et al., *"Hybrid Predictive-Prescriptive Framework for Mental Health Workforce Planning"*, 2025
- Rostami-Tabar et al., *"The Missing Puzzle Piece: Contextual Insights for Pharmaceutical Forecasting"*, 2025
- Bertsimas & Kallus, *"Optimal Resource Allocation in Healthcare"*, Operations Research, 2023
- Freeman et al., *"Digital Twins in Healthcare"*, Nature Medicine, 2024

**Impact Rating: 10/10** — Directly affects human lives. Massive funding, policy relevance, and societal impact.

---

### 5.8 Supply Chain & Inventory Management

#### Big Picture
Supply chain management has been permanently transformed by COVID-19. The field has shifted from **lean/JIT optimality** toward **resilience + agility**, and from **deterministic planning** toward **probabilistic, data-driven, and adaptive** approaches.

#### Key Research Groups

| Professor | University | Focus |
|---|---|---|
| **David Simchi-Levi** | MIT | Data-driven supply chain, risk analytics |
| **Yossi Sheffi** | MIT (CTL) | Supply chain resilience |
| **Feryal Erhun** | Cambridge (IfM) | Healthcare supply chains |
| **Hau Lee** | Stanford | Global value chain innovation |
| **Vishal Gaur** | Cornell | Inventory management, retail analytics |

#### Evolution (2018–2026)

```
Pre-2020: Lean/JIT, classical (s,S) and (r,Q) policies, EOQ extensions
2020-21: COVID shock — resilience becomes priority
2021-22: Digital supply chain twins, risk quantification
2022-23: Data-driven inventory — learning demand distributions from data
2023-24: Deep RL for inventory management — state-dependent policies
2024-25: Foundation models for demand sensing, end-to-end predict+optimize
2025-26: Autonomous supply chains, human-AI collaboration, 
         multi-echelon stochastic programming with ML
```

#### Current Open Problems
1. **Multi-echelon inventory optimisation with probabilistic forecasts** — how to propagate uncertainty through the network
2. **Inventory management under distributional shift** — when the future doesn't look like the past
3. **Joint pricing-inventory-routing optimisation** — integrated stochastic models
4. **Sustainable inventory management** — carbon-aware ordering policies
5. **Intermittent demand forecasting + inventory control** — spare parts, slow-movers

#### Key Recent Papers
- Simchi-Levi et al., *"From Data to Decisions: Distributionally Robust Optimization in Supply Chain"*, 2023
- Bertsimas & Kallus, *"Data-Driven Newsvendor"*, Management Science, 2020
- Hubbs et al., *"Deep Reinforcement Learning for Multi-Echelon Supply Chain"*, 2023
- Rostami-Tabar, *"Demand Forecasting in Supply Chains: Aggregation and Hierarchical Approaches"*, 2022
- Bojer & Meldgaard, *"Kaggle Forecasting Competitions"*, IJF, 2021

**Impact Rating: 9/10** — Industry-transforming. Every company with a supply chain needs better inventory decisions under uncertainty.

---

### 5.8 Integration of Forecasting with Optimisation (Emerging Hot Area)

#### Big Picture
The most exciting emerging paradigm is **decision-focused forecasting** — training predictive models not to minimise forecast error, but to minimise the cost of the downstream decision that uses the forecast. This is the **theoretical bridge between Rostami-Tabar's forecasting expertise and Sharifi's optimisation interests**.

#### The SPO+ Framework
Elmachtoub & Grigas (Columbia/Berkeley, 2022) proposed the **Smart Predict-then-Optimize (SPO+)** loss function. Instead of MSE or MAE, the loss is the decision regret — the difference in objective value between the decision made with the forecast and the decision that would have been made with perfect information. This has spawned an entire literature.

#### Key Professors
- **Adam Elmachtoub** (Columbia) — SPO+ originator
- **Paul Grigas** (UC Berkeley) — SPO+ co-developer
- **Priya Donti** (MIT/CMU) — Task-based learning for energy systems
- **Dimitris Bertsimas** (MIT) — Prescriptive analytics
- **Georgia Perakis** (MIT) — Integrated analytics

#### Current Open Problems
1. **SPO+ for stochastic programming** — extending beyond deterministic optimisation
2. **End-to-end learning for multi-stage decisions** — dynamic programming + ML
3. **Computational tractability** — SPO+ is hard for large-scale problems
4. **Decision-focused forecasting for hierarchical supply chains** — reconciling forecasts and decisions across levels
5. **Distributionally robust decision-focused learning** — robust to model misspecification

**Impact Rating: 9/10** — This is the frontier of OR+ML integration.

---

## 6. Synthesis & Recommended PhD Directions

### 6.1 Where the Stars Align

The intersection of **Rostami-Tabar's expertise**, **Sharifi's interests**, and **global research frontiers** converges most strongly in:

```
                    Rostami-Tabar                    Global Frontier
                         │                                │
    Probabilistic    ────┼──── Predict-then-Optimize ─────┤
    Forecasting          │                                │
         │               │                                │
    Healthcare      ─────┼──── Digital Health OR ─────────┤
    Supply Chains        │                                │
         │               │                                │
    Hierarchical    ─────┼──── Foundation Models + ───────┤
    Aggregation          │     Stochastic Programming     │
                         │                                │
                    ─────┴────────────┬───────────────────┘
                                     │
                              Sharifi's Sweet Spot:
                         Stochastic Optimisation +
                         Probabilistic Forecasting +
                         Simulation + Healthcare/SC
```

### 6.2 Top 3 Recommended PhD Directions (Ranked)

#### #1: Probabilistic Forecasting-Driven Stochastic Inventory Optimisation for Healthcare Supply Chains
- **Why**: Perfect overlap of all three circles. Rostami-Tabar has the forecasting + healthcare data + track record. Sharifi brings optimisation + simulation + practical SC experience. MIT, Oxford, Cambridge are all working on this. Extremely high impact (10/10).
- **Novel contribution**: Bridge the gap between probabilistic forecast quality and inventory decision quality in pharmaceutical supply chains using end-to-end learning.

#### #2: Hybrid DES-Forecasting Framework for NHS Mental Health Resource Planning
- **Why**: Extends Rostami-Tabar's 2025 paper directly. Sharifi's DES + queueing + MODM interest is exactly what's needed. Unique NHS data access through Rostami-Tabar. Impact 10/10.
- **Novel contribution**: Multi-objective simulation-optimisation with probabilistic patient demand forecasts and equity constraints.

#### #3: Decision-Focused Hierarchical Forecasting for Multi-Echelon Supply Chain Optimisation
- **Why**: Combines Rostami-Tabar's hierarchical forecasting expertise with the cutting-edge SPO+ framework. Sharifi's stochastic optimisation interest fills the gap. Impact 9/10.
- **Novel contribution**: Train hierarchical forecasting models to minimise supply chain cost rather than forecast error, using distributionally robust optimisation across aggregation levels.

### 6.3 Interview Talking Points

When speaking with Professor Rostami-Tabar, emphasise:

1. **Your practical SC experience is rare** — most PhD candidates come with only theoretical backgrounds. You've built EOQ systems, modelled cost functions in GAMS, and managed real supply chains.

2. **The predict-then-optimise gap in his work** — his 2025 Ethiopia paper demonstrates excellent forecasting but stops before the inventory decision. You want to close that loop with stochastic optimisation.

3. **Your simulation skills complement his** — he used stock-flow simulation; you bring DES and queue theory, which can model operational dynamics more granularly.

4. **Shared commitment to practical, reproducible, impactful research** — he values transparent methods that work in low-resource settings. Your industrial background means you understand constraints that pure academics often miss.

5. **Your MODM/MADM background adds a dimension** — healthcare decisions inherently involve multiple objectives (cost, equity, quality, access). Multi-objective frameworks are natural extensions of his single-objective work.

6. **His social good mission resonates with you** — mention healthcare analytics at Sina Hospital and your interest in systems that improve real outcomes.

---

## Appendix A: Key References for Further Reading

### Must-Read Before the Interview (Rostami-Tabar's Core Papers)
1. Rostami-Tabar et al., *"Forecasting: Theory and Practice"*, IJF, 2022
2. Rostami-Tabar et al., *"Demand Forecasting in Supply Chains: Aggregation and Hierarchical Approaches"*, 2022
3. Rostami-Tabar et al., *"The Missing Puzzle Piece"*, 2025
4. Rostami-Tabar et al., *"Hybrid Predictive-Prescriptive Framework for Mental Health Workforce Planning"*, 2025

### Foundational Papers for Your PhD Direction
5. Bertsimas & Kallus, *"From Predictive to Prescriptive Analytics"*, Management Science, 2020
6. Elmachtoub & Grigas, *"Smart Predict-then-Optimize"*, Management Science, 2022
7. Simchi-Levi et al., *"Data-Driven Inventory Management"*, Operations Research, 2023
8. Athanasopoulos et al., *"Forecast Reconciliation: A Review"*, IJF, 2024
9. Ansari et al., *"Chronos: Learning the Language of Time Series"*, 2024

### Broader Context
10. Lo, *"Adaptive Markets"*, 2017
11. Bertsimas et al., *"COVID-19 Vaccine Allocation"*, 2022
12. Deb, *"Multi-Objective Optimization Using Evolutionary Algorithms"*, 2001
13. Emrouznejad & Yang, *"A Survey and Analysis of DEA"*, Socio-Economic Planning Sciences, 2018

---

## Appendix B: Quick Comparison of Research Methods Evolution

| Method | 5 Years Ago | Now | Next 3 Years |
|---|---|---|---|
| **Stochastic Optimisation** | Two-stage SP, SAA | DRO, data-driven | End-to-end with ML |
| **Probabilistic Forecasting** | ARIMA PI, quantile regression | Foundation models, conformal | Decision-focused, causal |
| **Queue Theory** | M/M/c extensions | Fluid models, data-driven | Digital twins, RL-augmented |
| **MADM** | Fuzzy AHP/TOPSIS | Neutrosophic, hesitant fuzzy | LLM-augmented, automated |
| **MODM** | NSGA-II, MOEA/D | Many-objective, MO-RL | Human-in-loop, fairness |
| **DEA** | Network, dynamic | Bootstrap, ML hybrid | Real-time, inverse DEA |
| **Portfolio Optimisation** | Robust MV, CVaR | Deep RL, factor ML | Quantum, ESG-integrated |
| **Healthcare OR** | Scheduling, staffing | Predict+prescribe, COVID | Digital twins, AI-clinical |
| **Supply Chain** | (s,S), EOQ extensions | Data-driven, resilience | Autonomous, foundation models |

---

*This document was prepared for Navid Sharifi's PhD interview preparation at Cardiff University with Professor Bahman Rostami-Tabar. April 2026.*
