# PhD Interview Preparation: Navid Sharifi × Professor Bahman Rostami-Tabar

> **Date**: April 19, 2026 | **Institution**: Cardiff University

---

## Part 1 — Bahman Rostami-Tabar: Chronological Research Narrative

### Early Work: Temporal Aggregation & Demand Forecasting

Rostami-Tabar's research begins with a precise methodological question: **does aggregating demand into coarser time buckets improve forecast accuracy?** His paper *"Demand Forecasting by Temporal Aggregation"* proved that under MA(1) and AR(1) demand processes, temporal aggregation combined with Single Exponential Smoothing yields MSE improvements — but only as a function of the aggregation level, smoothing constant, and underlying process parameters. This was rigorous, parametric, classical OR — establishing his identity as a forecasting methodologist grounded in theory.

### 2022: Hierarchical Forecasting & The Encyclopedic Review

Two pivotal publications mark 2022:

1. **"Demand Forecasting in Supply Chains: A Review of Aggregation and Hierarchical Approaches"** — a systematic review showing that the most accurate forecasts often don't come from the "natural" level of aggregation. He mapped the full landscape of temporal aggregation, cross-sectional aggregation, and hierarchical reconciliation, arguing that combining forecasts across hierarchy levels is superior to pure top-down or bottom-up methods. This directly serves inventory replenishment (SKU-level) and strategic supply chain decisions (aggregate-level).

2. **"Forecasting: Theory and Practice"** — the encyclopedic, multi-author review (2,410 citations, h-index 19). This paper spans everything from ARIMA to neural networks, Bayesian methods to judgmental forecasting, and probability forecasts to forecast combination. **Three positions define his worldview here:**
   - Probabilistic forecasts (full prediction distributions, not just point estimates) are essential for decision-making under uncertainty
   - Forecast combination consistently outperforms single methods
   - Simple, transparent methods have durable value — especially within diverse ensembles

### 2025: The Predict-Then-Prescribe Turn

Two 2025 papers mark a decisive shift from **pure forecasting** to **forecasting integrated with decision-making**:

1. **"The Missing Puzzle Piece: Contextual Insights for Enhanced Pharmaceutical Supply Chain Forecasting"** — Collaborated with the Ethiopian Pharmaceutical Supply Service. Showed that incorporating contextual factors (stock replenishment cycles, fiscal inventory counts, seasonal disease outbreaks) into models dramatically improves probabilistic forecast accuracy for 33 essential medicines. He evaluated statistical, ML, and foundational models, concluding that **transparent, low-complexity methods** outperform black-box approaches in sustained practice. All data and code released as an open Quarto project.

2. **"A Hybrid Predictive and Prescriptive Modelling Framework for Long-Term Mental Healthcare Workforce Planning"** — His most methodologically integrated work. Combines **long-term probabilistic forecasting** with an **analytical stock-flow simulation** to project NHS mental health nursing shortfalls. Uses 8 national data sources. Key finding: blanket national staffing policies are ineffective; region-specific strategies are necessary. **This is the predict-then-prescribe paradigm in action** — forecasts feeding directly into a prescriptive simulation model for policy analysis.

### 2026: Resilience & Systems Thinking

1. **"The Role of Technology in Developing Resilient Supply Chains"** — Systematic review of how Industry 4.0 technologies (blockchain, AI, IoT, digital twins) helped supply chains recover from COVID-19 and economic sanctions. Identifies a persistent gap between **technological promise and practical performance**, especially in humanitarian contexts where data, infrastructure, and skills are limited.

2. **"What Makes the Contribution of Science Towards a Sustainable Future So Difficult?"** — A philosophical, transdisciplinary paper examining why science fails to deliver on the SDGs. Identifies four controversies: technology optimism vs. societal advancement, disciplinary vs. interdisciplinary approaches, global vs. local knowledge, and the evolving role of scientists.

### The Research Arc

```
Temporal Aggregation → Hierarchical Forecasting → Encyclopedic Synthesis →
→ Healthcare & Pharmaceutical Forecasting (Ethiopia, NHS) →
→ Predict-then-Prescribe Hybrid Models →
→ Supply Chain Resilience → Systems Thinking for SDGs
```

**Core identity**: A probabilistic forecasting methodologist who increasingly applies his methods to **healthcare systems** and **humanitarian supply chains**, with a strong commitment to **practical, reproducible, and transparent** research for social good.

---

## Part 2 — Research Alignment Analysis

### Your Interests vs. His Expertise

| Your Methodology | Alignment with Rostami-Tabar | Strength |
|---|---|:---:|
| **Probabilistic Forecasting** | His core expertise — prediction distributions, hierarchical/temporal aggregation | ★★★★★ |
| **Stochastic Optimisation** | Not his primary method, but his work **needs** it — the "prescribe" half of predict-then-prescribe | ★★★★☆ |
| **Queue Theory** | Not his focus, but directly relevant to healthcare resource planning (patient flows, waiting times) | ★★★☆☆ |
| **MADM / MODM** | Not in his portfolio, but healthcare/SC decisions are inherently multi-objective | ★★☆☆☆ |
| **DEA** | Not in his portfolio | ★☆☆☆☆ |

| Your Applications | Alignment with Rostami-Tabar | Strength |
|---|---|:---:|
| **Healthcare Systems** | His primary application domain — NHS workforce, Ethiopian pharma supply | ★★★★★ |
| **Supply Chain & Inventory Management** | His foundational domain — demand forecasting feeds inventory decisions | ★★★★★ |
| **Fintech / Portfolio Optimisation** | No overlap | ☆☆☆☆☆ |

### Where the Overlap Is Strongest

The highest-value intersection is exactly where **his work has an explicit gap**: he builds excellent probabilistic forecasts but stops short of the downstream **optimisation decision**. His 2025 Ethiopia paper produces probabilistic forecasts for 33 medicines — but does not determine optimal order quantities. His workforce planning paper uses a stock-flow simulation — but not a formal stochastic optimisation model. **You fill that gap.**

```
   Rostami-Tabar's Strength          Your Strength            The Gap
   ┌─────────────────────┐     ┌──────────────────────┐
   │  Probabilistic       │     │  Stochastic           │
   │  Forecasting         │────▶│  Optimisation         │──▶ Optimal Decisions
   │  (distributions)     │     │  (under uncertainty)  │    Under Uncertainty
   └─────────────────────┘     └──────────────────────┘
          ▲                              ▲
          │                              │
   His published work             Your expertise
   stops here                     starts here
```

---

## Part 3 — Potential PhD Research Directions

### Direction 1 (Highest Fit): Probabilistic Forecasting-Driven Stochastic Inventory Optimisation for Healthcare Supply Chains

**The problem**: Pharmaceutical supply chains in low-resource settings face chronic stockouts and wastage. Rostami-Tabar's 2025 work demonstrated that contextual probabilistic forecasting significantly improves demand prediction for essential medicines. But **accurate forecasts alone do not determine how much to order, when to order, or how to allocate limited budgets across 33+ medicines**. Classical inventory theory assumes known demand distributions (Normal, Poisson) — a strong assumption that probabilistic forecasts can replace with empirical predictive distributions.

**What you would do**: Develop a **stochastic inventory optimisation framework** that takes full predictive distributions from probabilistic forecasting models as inputs and computes optimal replenishment policies (order quantities, reorder points, safety stocks) under budget constraints, lead time uncertainty, and service level requirements. Evaluate on the Ethiopian pharmaceutical data.

**Why it works for the interview**:
- Directly extends his most recent empirical work
- Your stochastic optimisation interest fills the exact methodological gap
- Your practical inventory control experience (EOQ systems, GAMS cost modelling) demonstrates you can execute
- Aligns with his social good mission (medicine availability in low-resource settings)
- Reproducible: open data already available from his Quarto project

**Methods**: Probabilistic forecasting (ETS, ML, hierarchical) → Predictive distributions → Stochastic programming / sample average approximation / distributionally robust optimisation → Newsvendor extensions with budget constraints → Multi-item joint optimisation

---

### Direction 2 (Strong Fit): Hybrid Forecasting-Simulation-Optimisation for NHS Healthcare Resource Planning

**The problem**: Rostami-Tabar's 2025 workforce planning paper combines probabilistic forecasting with stock-flow simulation. However, stock-flow is a macro-level aggregate model — it cannot capture **operational queueing dynamics**: patients waiting for appointments, therapists with stochastic service times, referral pathways with blocking and abandonment. Furthermore, the model identifies shortfalls but does not formally optimise staffing decisions across regions under budget constraints.

**What you would do**: Extend the framework with **discrete-event simulation** of mental health service pathways (capturing queue dynamics) and a **multi-objective stochastic optimisation** layer that finds Pareto-optimal staffing allocations balancing cost, waiting time, and regional equity.

**Why it works for the interview**:
- Directly extends his most methodologically ambitious paper
- Your queue theory + DES + MODM interests are precisely what the extension requires
- NHS collaboration already established through his network
- Multi-objective framing adds a dimension his single-objective approach lacks

**Methods**: Probabilistic patient demand forecasting → DES of care pathways (arrivals, triage, treatment, discharge) → Queue-theoretic bottleneck analysis → Multi-objective optimisation (ε-constraint or NSGA-III) under uncertainty

---

### Direction 3 (Novel & Ambitious): Decision-Focused Hierarchical Forecasting for Multi-Echelon Supply Chains

**The problem**: Rostami-Tabar's hierarchical forecasting work optimises forecast accuracy (minimises MSE/CRPS). But the downstream supply chain decision (inventory, allocation) may not be sensitive to the same forecast errors that MSE penalises. The cutting-edge **"Smart Predict-then-Optimize" (SPO+)** framework (Elmachtoub & Grigas, 2022) proposes training forecasting models to minimise **decision regret** rather than forecast error. This has not been applied to hierarchical forecasting in supply chains.

**What you would do**: Develop hierarchical probabilistic forecasting models where the reconciliation weights and model parameters are trained to minimise the cost of downstream stochastic inventory decisions across multiple echelons, rather than minimising forecast accuracy metrics.

**Why it works for the interview**:
- Bridges his hierarchical forecasting expertise with the global frontier of predict-then-optimise
- Methodologically novel — publishable in top journals (Management Science, Operations Research)
- Your stochastic optimisation background is essential for defining the decision cost

**Methods**: Hierarchical forecast reconciliation → SPO+ loss function → Stochastic multi-echelon inventory model → End-to-end differentiable optimisation

---

### Direction 4 (Supplementary): DEA-Enhanced Resource Allocation in Pharmaceutical Distribution Networks

**The problem**: Not all pharmaceutical distribution facilities in Ethiopia are equally efficient. DEA can measure the relative efficiency of distribution centres in converting inputs (budget, staff, storage capacity) into outputs (availability rate, forecast accuracy, service level). Combining DEA efficiency scores with probabilistic forecast quality as a contextual variable creates a **diagnostic tool**: is a facility underperforming because of poor forecasting, poor operations, or resource scarcity?

**Why it works**: Bridges your DEA interest with his Ethiopian data. Lower priority because DEA is distant from his core methods, but could be a secondary paper within the PhD.

---

## Part 4 — What to Tell Bahman in the Interview

### Your Opening Pitch (2 minutes)

> "My background combines industrial engineering methodology — stochastic optimisation, probabilistic modelling, simulation — with hands-on experience in supply chain operations. I've built inventory control systems, modelled cost functions in GAMS, and done healthcare data analytics. What excites me about your work is the gap between **probabilistic forecasting** and **optimal decisions under uncertainty**. Your 2025 paper on Ethiopian pharmaceutical supply chains produces excellent predictive distributions — but the question of *how much to order given that distribution, a budget constraint, and lead time uncertainty* remains open. I want to close that loop using stochastic optimisation. The same logic applies to your NHS workforce planning model — the prescriptive side could be formalised as a stochastic program rather than a deterministic simulation."

### Key Points to Hit

1. **"I read your Ethiopia paper — the forecasting stops where my interest begins."** Show you've read his work closely. The 33-medicine dataset with open code is the perfect starting point.

2. **"Your predict-then-prescribe framework is exactly my research vision."** His 2025 workforce paper explicitly calls it a "hybrid predictive and prescriptive framework" — use his own language.

3. **"I bring the optimisation half."** He is a forecasting expert. He supervises students in forecasting, ML, and OR. You're not competing with his forecasting expertise — you're complementing it with the decision science that makes forecasts actionable.

4. **"I have practical supply chain experience."** You built EOQ systems in GAMS, managed fleet logistics, and did healthcare BI. Most PhD candidates come with only theoretical training. This gives you credibility for applied research.

5. **"Your social good mission resonates with me."** He has trained 500+ NHS analysts across 9 countries. His work targets medicine availability in Ethiopia and mental health staffing in the NHS. Frame your interest in healthcare systems as purpose-driven, not just methodological.

6. **"I understand simulation."** His workforce paper used Anylogic (stock-flow). Mention your DES interest and how queue-theoretic models could extend his operational healthcare work.

### What NOT to Emphasise

- **Fintech / Portfolio Optimisation**: Zero overlap. Don't mention it unless asked about breadth of interests.
- **DEA as a standalone methodology**: Too distant from his work. Only mention it briefly as a possible secondary tool for efficiency measurement in his healthcare supply chain context.
- **MADM (AHP, TOPSIS)**: Not in his research vocabulary. Frame it instead as "multi-criteria evaluation of forecasting methods" or "multi-objective healthcare resource allocation" if it comes up.

### Questions to Ask Him

1. "Is the Ethiopian pharmaceutical dataset still available for further research? I'd be interested in building a stochastic inventory optimisation model on top of your probabilistic forecasts."
2. "In your workforce planning framework, have you considered extending the stock-flow model with discrete-event simulation to capture operational queueing dynamics?"
3. "How do you see the field moving on the integration of forecasting and optimisation — are you interested in the SPO+ / decision-focused forecasting direction?"
4. "Would a PhD that bridges probabilistic forecasting with stochastic programming for healthcare supply chains fit within your supervision scope?"
5. "What data access would be available — NHS data, Ethiopian data, or other humanitarian supply chain datasets?"

---

## Part 5 — Summary: Your Research Direction Statement

If he asks "What is your proposed research direction?", say:

> **"Integrating probabilistic forecasting with stochastic optimisation for healthcare supply chain decision-making under uncertainty."**

This is:
- Specific enough to show you've thought deeply
- Broad enough to accommodate multiple papers (inventory, workforce, resilience)
- Directly built on his published work
- Grounded in your methodological strengths
- Applied to his preferred domain (healthcare + supply chains for social good)

### The PhD in One Diagram

```
┌───────────────────────────────────────────────────────────┐
│                    PhD Research Programme                   │
│                                                           │
│  Paper 1: Stochastic inventory optimisation for           │
│           pharmaceutical supply chains using               │
│           probabilistic demand forecasts                   │
│           (extends Ethiopia 2025 paper)                    │
│                                                           │
│  Paper 2: Multi-objective simulation-optimisation for     │
│           NHS mental health resource allocation            │
│           (extends workforce planning 2025 paper)          │
│                                                           │
│  Paper 3: Decision-focused hierarchical forecasting       │
│           for supply chain inventory decisions             │
│           (extends hierarchical forecasting 2022 paper)    │
│                                                           │
│  Overarching theme: Closing the forecast-to-decision gap  │
│  in healthcare and humanitarian supply chains              │
└───────────────────────────────────────────────────────────┘
```

---

*Prepared for Navid Sharifi — PhD interview at Cardiff University with Prof. Bahman Rostami-Tabar, April 2026.*
