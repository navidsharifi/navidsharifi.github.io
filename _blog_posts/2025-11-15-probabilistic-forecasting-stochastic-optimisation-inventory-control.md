---
layout: post
title: "Probabilistic Demand Forecasting + Stochastic Optimisation for Inventory Control"
author: Navid Sharifi
image: assets/images/figure2-blog1.jpg
featured: true
hidden: false
comments: true
categories: Supply-Chain Forecasting Stochastic-Optimisation
excerpt: "A complete route from uncertainty-aware demand forecasting to inventory decisions using stochastic optimisation, robust policies, and KPI-based evaluation."
---

## The Forecast-Decision Gap

Forecasting and inventory control are often treated as separate tasks. A demand analyst builds the best possible model, hands over point predictions, and a planner plugs them into a replenishment rule. In practice, this separation is costly. A model with excellent RMSE can still produce poor replenishment decisions if it underestimates tail risk. The right question is not only "How accurate is my forecast?" but also "How much operational cost does my forecast induce?"

The goal of this post is to trace an end-to-end route from **probabilistic demand forecasting** to **stochastic inventory optimisation**. Along the way, I will cover the core ideas that make this connection possible.

We begin with the problem of forecasting demand as a full probability distribution, not a single number <cite data-key="deepar_2019"></cite>. We then examine how that distribution feeds into classical and modern inventory decisions through the lens of the **newsvendor model** and its multi-period, scenario-based extensions. We will see how **distributionally robust optimisation** <cite data-key="dro_newsvendor_2020"></cite> protects against model misspecification. We will look at proper scoring rules <cite data-key="gneiting_raftery_2007"></cite> that ensure our forecasts are honest before we optimise over them. And we will connect forecast quality to operational KPIs, showing why a model that wins on RMSE can lose on total inventory cost.

Throughout, I will try to connect these developments. The recurring theme is that *a forecast is only as good as the decisions it enables*, and different modelling choices make different tradeoffs in this conversion.



## Why Point Forecasts Fail Inventory Systems

Suppose two models have similar MAE on a holdout set. If one underestimates upper-tail demand, stockouts surge whenever a promotion or a seasonality shock occurs. Inventory policies are fundamentally asymmetric: under-forecasting and over-forecasting do not carry equal costs. A shortage penalty of <span>$</span>50 per unit and a holding cost of <span>$</span>2 per unit create a 25:1 asymmetry. A symmetric loss function like MSE is blind to this.

The problem deepens when we consider that most replenishment rules consume a single number. A base-stock policy sets the order-up-to level at the forecast plus some multiple of forecast error. But the "forecast error" is typically a symmetric standard deviation. If the true demand distribution is skewed, heavy-tailed, or multimodal, the symmetric safety-stock formula breaks down.

The fix is conceptually simple. Instead of predicting a point $\hat{d}$, predict the entire conditional distribution of demand. Then let the inventory policy read whichever quantile it needs from that distribution.

## Demand as a Distribution

Consider one SKU first, then extend to many. Let $D_{t+h}$ be random demand at forecast origin $t$ and horizon $h$. Let $\mathcal{X}_t$ denote all available information at time $t$: sales history, price, promotions, calendar effects, and macro context. We seek a predictive distribution:

<div class="academic-equation" id="eq-forecast-dist">

$$D_{t+h} \sim \hat{F}_{t+h}(\cdot \mid \mathcal{X}_t)$$

</div>

where $\hat{F}_{t+h}$ may come from parametric models (Gaussian, negative binomial), non-parametric quantile regressors, or deep generative models. The critical requirement is that this distribution is **calibrated**: the predicted $\tau$-quantile should be exceeded with probability $1 - \tau$ in realised demand.

The inventory position evolves according to the standard balance equation:

<div class="academic-equation" id="eq-inventory-dynamics">

$$I_{t+1} = I_t + Q_t - D_t$$

</div>

where $Q_t$ is the order quantity placed at time $t$ and $I_t$ is net inventory before demand. In settings with lead time $L$, the order placed at $t$ arrives at $t + L$. The balance equation still holds with delayed receipt terms.

## Scoring Probabilistic Forecasts

Before optimising inventory against a predictive distribution, we must verify that the distribution itself is trustworthy. This is where **proper scoring rules** enter.

For quantile forecasts, the standard metric is the **pinball loss** (also called the quantile loss or tick loss):

<div class="academic-equation" id="eq-pinball">

$$L_{\tau}(y, \hat{q}_{\tau}) = (\tau - \mathbf{1}\{y < \hat{q}_{\tau}\})(y - \hat{q}_{\tau})$$

</div>

This loss penalises underestimation and overestimation asymmetrically, with the asymmetry controlled by $\tau$. When averaged over multiple quantile levels, the pinball loss approximates the **Continuous Ranked Probability Score (CRPS)**, which is a proper scoring rule for the full cumulative distribution. CRPS measures the integrated squared difference between the predictive CDF and the empirical step function at the observed value.

A proper scoring rule has a key property: it is uniquely minimised when the forecaster reports the true conditional distribution <cite data-key="gneiting_raftery_2007"></cite>. This prevents a common failure mode where a model produces sharp but miscalibrated predictions. Sharpness without calibration is dangerous in inventory control, because it creates false confidence in safety-stock calculations.

<figure class="academic-figure" id="fig-calibration" style="text-align: center; margin: 2rem auto; display: block;">
<img src="{{ '/images/fig3-calibration-curve.svg' | relative_url }}" alt="Calibration curve: predicted quantile level versus empirical coverage" style="max-width: 80%; display: block; margin: 0 auto;">
<figcaption data-caption="Calibration diagnostics. The x-axis is the nominal quantile level and the y-axis is the empirical coverage. A well-calibrated model lies on the diagonal. Deviations above the diagonal indicate underconfidence; below indicates overconfidence."></figcaption>
</figure>

The calibration plot above checks whether nominal quantiles match realised frequencies. For example, the 0.9 quantile should be exceeded about 10% of the time. If we observe systematic offsets, **post-hoc recalibration** (isotonic regression on the PIT histogram, or conformal prediction wrappers) can correct the distribution before it reaches the optimiser.

## Probabilistic Forecasting Methods

A practical hierarchy of methods exists, roughly ordered by complexity and data requirements.

At the simplest level, **Croston-family** methods handle intermittent demand by separately modelling inter-arrival times and demand sizes <cite data-key="croston_1972"></cite>. For smooth or seasonal series, **ETS** and **ARIMA** models with prediction intervals provide calibrated Gaussian or bootstrapped distributions. These classical methods remain competitive baselines.

At the deep learning end, **DeepAR** <cite data-key="deepar_2019"></cite> trains an autoregressive recurrent network on a large collection of related time series. At each timestep, the network outputs the parameters of a chosen distribution family (Gaussian, negative binomial, beta). The key innovation is that training across thousands of related series enables the model to learn shared patterns—seasonality, holiday effects, cross-series correlations—that a per-series statistical model cannot exploit.

For interpretable multi-horizon forecasting, the **Temporal Fusion Transformer (TFT)** <cite data-key="tft_2021"></cite> uses attention mechanisms to learn temporal relationships at multiple scales. It handles the full range of inputs common in demand forecasting: static covariates (store type, product category), known future inputs (promotions, holidays), and historical time-varying features. The attention weights provide interpretability, revealing which past timesteps and which features drive the forecast.

For **intermittent demand**, where the series consists mostly of zeros with occasional positive values, **Deep Renewal Processes** <cite data-key="deep_renewal_2019"></cite> model the demand process as a marked point process. The model jointly predicts when the next non-zero demand will occur and how large it will be. This avoids the pathological behaviour of continuous-distribution models on zero-inflated data.

<figure class="academic-figure" id="fig-fan-chart" style="text-align: center; margin: 2rem auto; display: block;">
<img src="{{ '/images/fig2-fan-chart.svg' | relative_url }}" alt="Quantile fan chart showing P10, P50, P90 demand trajectories" style="max-width: 85%; display: block; margin: 0 auto;">
<figcaption data-caption="Quantile fan chart showing demand uncertainty widening with forecast horizon. The dark band is the P25–P75 interval; the light band is P10–P90. The black line is realised demand. Where actuals frequently fall outside the P10–P90 band, the model underestimates uncertainty."></figcaption>
</figure>

The fan chart above is the minimum diagnostic for any probabilistic forecast. If actuals frequently fall outside P10–P90, uncertainty is underestimated and stockouts will be worse than expected. If intervals are too wide, safety stock will be inflated and holding costs will rise unnecessarily.

## The Newsvendor: Connecting Forecasts to Orders

The simplest and most important model linking a demand distribution to an ordering decision is the **newsvendor problem**. A retailer must decide how many units to stock before observing demand. Unsold units incur an overage cost $c_o$ (waste, markdowns, holding). Unmet demand incurs an underage cost $c_u$ (lost profit, contractual penalties, customer churn).

The expected cost as a function of order quantity $q$ is:

<div class="academic-equation" id="eq-newsvendor">

$$\min_q \; \mathbb{E}\left[c_o(q - D)^+ + c_u(D - q)^+\right]$$

</div>

The first-order condition yields the celebrated **critical fractile** solution:

<div class="academic-equation" id="eq-critical-fractile">

$$q^* = F_D^{-1}\left(\frac{c_u}{c_u + c_o}\right)$$

</div>

This result is profound in its simplicity. The optimal order quantity is the quantile of the demand distribution whose level equals the critical ratio $c_u / (c_u + c_o)$. When stockout penalty dominates holding cost, the ratio approaches 1 and we order a high quantile. When holding cost dominates, we order conservatively.

The connection to probabilistic forecasting is immediate. If our forecast model outputs the full predictive CDF $\hat{F}$, we simply read off the quantile at the critical ratio. No safety-stock formula, no normality assumption, no separate error distribution. The forecast *is* the decision input, directly.

This equation also reveals why point forecasts are insufficient. A point forecast gives us at best the median or mean of the distribution. But the newsvendor solution demands a *specific quantile* that depends on the cost structure. The median is optimal only when $c_u = c_o$, which almost never holds in practice.

## Multi-Period Stochastic Optimisation

Real inventory systems are not single-period. Orders are placed repeatedly, lead times create delay, and the inventory carried from one period affects the next. The multi-period objective generalises <a href="#eq-newsvendor" class="eqref"></a>:

<div class="academic-equation" id="eq-multi-period-cost">

$$\min_{\{Q_t\}} \; \mathbb{E}\left[\sum_{t=1}^{T} h(I_t)^+ + b(-I_t)^+ + cQ_t\right]$$

</div>

subject to capacity, minimum order quantity, lead-time, and service-level constraints. Here $h$ is the holding-cost coefficient, $b$ is the backorder or lost-sales penalty, and $c$ is the per-unit ordering cost.

Solving this exactly requires dynamic programming over continuous states, which is intractable for realistic problem sizes. The practical approach is **scenario-based stochastic programming**. At each decision point, we sample $S$ demand paths from the predictive distribution $\hat{F}$ and solve the optimisation against these scenarios:

<div class="academic-equation" id="eq-scenario-program">

$$\min_{\{Q_t\}} \; \sum_{s=1}^{S} p_s \sum_{t=1}^{T}\left[h(I_{t,s})^+ + b(-I_{t,s})^+ + cQ_t\right]$$

</div>

subject to inventory transitions $I_{t+1,s} = I_{t,s} + Q_t - D_{t,s}$ per scenario and operational constraints. Each scenario index $s = 1, \dots, S$ carries probability $p_s$ (uniform if scenarios are Monte Carlo draws).

The quality of this solution depends directly on the quality of the sampled scenarios, which depends on the quality of the predictive distribution. Miscalibrated forecasts generate unrealistic scenarios, leading to policies that are optimal for a world that does not exist.

## Distributionally Robust Inventory Policies

Forecast errors and regime shifts make pure stochastic programs fragile. A model trained on 2019 data may produce a distribution that does not account for the demand volatility of a supply-chain crisis. One robust alternative is to optimise worst-case expected cost over an **ambiguity set** $\mathcal{P}$ around the nominal demand law:

<div class="academic-equation" id="eq-dro">

$$\min_{\pi \in \Pi} \; \sup_{\mathbb{P} \in \mathcal{P}} \mathbb{E}_{\mathbb{P}}\big[C(\pi, D)\big]$$

</div>

where $\pi$ is a replenishment policy (for example a base-stock level) and $\mathcal{P}$ is defined by constraints on the demand distribution—matching known moments <cite data-key="dro_newsvendor_2020"></cite>, staying within a Wasserstein ball around the empirical distribution, or satisfying unimodality and symmetry conditions <cite data-key="dro_heavytail_2018"></cite>.

The distributionally robust newsvendor has a clean analytic solution for moment-based ambiguity sets. When only the mean $\mu$ and variance $\sigma^2$ of demand are assumed known:

<div class="academic-equation" id="eq-dro-newsvendor-solution">

$$q^*_{\text{DRO}} = \mu + \sigma \sqrt{\frac{c_u}{c_o}}$$

</div>

This is a **Scarf-type bound** <cite data-key="scarf_1958"></cite>. It provides a distribution-free guarantee: the expected cost under *any* demand distribution with the given mean and variance is bounded. When the true distribution is far from the assumed one (heavy tails, skewness, regime changes), the distributionally robust solution can dramatically outperform the nominal newsvendor.

<figure class="academic-figure" id="fig-frontier" style="text-align: center; margin: 2rem auto; display: block;">
<img src="{{ '/images/fig4-cost-service-frontier.svg' | relative_url }}" alt="Cost-service frontier across policy-model combinations" style="max-width: 85%; display: block; margin: 0 auto;">
<figcaption data-caption="Trade-off frontier between service level and total expected cost. Each point represents a different combination of forecasting model and inventory policy. The Pareto-efficient frontier reveals which combinations dominate. Distributionally robust policies tend to occupy the high-service, moderate-cost region."></figcaption>
</figure>

The figure above visualises the service-cost trade-off from competing policies. Points below and to the right dominate. The key insight is that the best forecast model and the best inventory policy are not independent choices. They must be evaluated as a pair.

## When Better Forecasts Produce Worse Decisions

This is the central paradox motivating the entire post. Suppose Model A has lower RMSE than Model B, but poorer calibration near the upper quantiles. Under a service-level target of 95%, Model A's underestimated P95 quantile triggers frequent shortage penalties. Model B, despite higher point-error, produces a well-calibrated P95 that matches the policy's needs. Total inventory cost under Model B is lower.

The mechanism is straightforward. Point error metrics like RMSE compress the full distributional error into a single number. They weight under-prediction and over-prediction equally. But inventory cost structures are asymmetric. A model that is slightly biased upward may actually produce lower expected cost than an unbiased model with higher variance, depending on the cost ratio.

This disconnect has practical consequences. If you select models by RMSE, you may be choosing the wrong model for your inventory system. **Decision-aware evaluation**—ranking models by the operational cost they induce—preserves the asymmetry that matters.

<figure class="academic-figure" id="fig-kpi-boxplots" style="text-align: center; margin: 2rem auto; display: block;">
<img src="{{ '/images/fig5-kpi-boxplots.svg' | relative_url }}" alt="KPI boxplots from Monte Carlo simulation" style="max-width: 88%; display: block; margin: 0 auto;">
<figcaption data-caption="Distribution of inventory KPIs from Monte Carlo policy simulation. Each boxplot shows stockout rate, holding cost, and total cost across 1,000 demand scenarios. The model with lower RMSE (left group) produces higher total cost due to poor upper-tail calibration."></figcaption>
</figure>

## Evaluation: Forecast KPIs Meet Inventory KPIs

A credible study of this forecast-to-decision pipeline requires dual evaluation. On the forecasting side, report:

- **Pinball loss** at the quantile levels consumed by the inventory policy.
- **CRPS** as a summary of full distributional quality.
- **Coverage error** at P90 and P95, because these quantiles drive safety stock.

On the inventory side, simulate the replenishment policy under realised demand and report:

- **Total cost** (holding + shortage + ordering).
- **Fill rate** and **stockout frequency**.
- **Average on-hand inventory** (capital tied up).
- **Cost volatility** across scenarios (risk exposure).

The backtesting protocol should use **rolling-origin evaluation**: multiple forecast origins, fixed horizon, realistic retraining cadence. At each origin, draw $S$ demand paths from the predictive distribution, solve the scenario program from <a href="#eq-scenario-program" class="eqref"></a>, and simulate forward.

## Implementation Route

The end-to-end pipeline has five stages.

**Data and feature engineering.** Include promotions, holidays, price, and stockout flags. Crucially, separate true zero demand from censored demand caused by stockouts. If a product was out of stock for three days, observed sales are zero but true demand was not. Treating censored zeros as real zeros biases the forecast downward.

**Probabilistic model training.** Train at least one statistical baseline (ETS, Croston) and one deep probabilistic model (DeepAR, TFT). Tune for probabilistic objectives—pinball loss from <a href="#eq-pinball" class="eqref"></a> or CRPS—not only MAE or RMSE.

**Calibration checks.** Produce the fan chart and calibration plot shown earlier. Recalibrate quantiles if systematic bias appears. Conformal prediction provides a model-agnostic wrapper that guarantees finite-sample coverage.

**Optimisation.** Convert calibrated distributions to ordering decisions via the critical fractile from <a href="#eq-critical-fractile" class="eqref"></a> for single-period problems or the scenario program from <a href="#eq-scenario-program" class="eqref"></a> for multi-period ones. Add the distributionally robust variant from <a href="#eq-dro" class="eqref"></a> for stress testing.

**Simulation and decision report.** Simulate policies over historical rolling windows. Plot the cost-service frontier and KPI boxplots. Select the policy by expected cost plus risk tolerance.

## Practical Pitfalls

Several failure modes recur in practice.

**Leakage in feature engineering.** Using information that was not available at forecast origin (for example, actual promotional uplift that was unknown before the event) inflates forecast quality artificially and collapses at deployment.

**Ignoring stockout censorship.** Observed sales understate true demand whenever the product is out of stock. Models trained on censored data systematically underpredict, creating a vicious cycle of understocking.

**Evaluating forecasts without operations.** Reporting CRPS alone is insufficient. The same CRPS can correspond to very different cost outcomes depending on which part of the distribution is miscalibrated.

**Overfitting quantile models.** Deep quantile regressors can overfit to noise in training tails. Cross-validate and check calibration on holdout horizons, not just in-sample.

**No stress testing.** A policy that performs well under normal demand variability may collapse under demand shocks or lead-time disruptions. Always evaluate under perturbed scenarios.

## Conclusion

The central message is simple. Forecast uncertainty is only useful when it changes decisions.

The demand distribution from <a href="#eq-forecast-dist" class="eqref"></a>, scored by the pinball loss in <a href="#eq-pinball" class="eqref"></a>, provides the uncertainty input. The newsvendor from <a href="#eq-newsvendor" class="eqref"></a> and its multi-period extension in <a href="#eq-scenario-program" class="eqref"></a> convert that uncertainty into ordering actions. The distributionally robust formulation in <a href="#eq-dro" class="eqref"></a> protects against distributional misspecification.

If your final model selection is based on expected inventory cost and service reliability rather than only RMSE, you are doing demand forecasting in the way supply chains actually need.

<div class="bibliography-data" style="display:none;">
@article{deepar_2019,
  author    = {Salinas, David and Flunkert, Valentin and Gasthaus, Jan and Januschowski, Tim},
  title     = {DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks},
  journal   = {International Journal of Forecasting},
  volume    = {36},
  number    = {3},
  pages     = {1181--1191},
  year      = {2020},
  doi       = {10.1016/j.ijforecast.2019.07.001},
  note      = {Preprint: arXiv:1704.04110}
}
@article{tft_2021,
  author    = {Lim, Bryan and Arık, Sercan Ö. and Loeff, Nicolas and Pfister, Tomas},
  title     = {Temporal Fusion Transformers for Interpretable Multi-horizon Time Series Forecasting},
  journal   = {International Journal of Forecasting},
  volume    = {37},
  number    = {4},
  pages     = {1748--1764},
  year      = {2021},
  doi       = {10.1016/j.ijforecast.2021.03.012},
  note      = {Preprint: arXiv:1912.09363}
}
@inproceedings{nbeats_2020,
  author    = {Oreshkin, Boris N. and Carpov, Dmitri and Chapados, Nicolas and Bengio, Yoshua},
  title     = {N-BEATS: Neural Basis Expansion Analysis for Interpretable Time Series Forecasting},
  booktitle = {ICLR},
  year      = {2020},
  note      = {Preprint: arXiv:1905.10437}
}
@inproceedings{deep_renewal_2019,
  author    = {Türkmen, Ali Caner and Wang, Yuyang and Smola, Alexander J.},
  title     = {Intermittent Demand Forecasting with Deep Renewal Processes},
  booktitle = {NeurIPS Time Series Workshop},
  year      = {2019},
  note      = {Preprint: arXiv:1911.10416}
}
@article{gneiting_raftery_2007,
  author    = {Gneiting, Tilmann and Raftery, Adrian E.},
  title     = {Strictly Proper Scoring Rules, Prediction, and Estimation},
  journal   = {Journal of the American Statistical Association},
  volume    = {102},
  number    = {477},
  pages     = {359--378},
  year      = {2007},
  doi       = {10.1198/016214506000001437}
}
@article{dro_newsvendor_2020,
  author    = {Zhang, Yifan and Shen, Siqian and Mathieu, Johanna L.},
  title     = {Distributionally Robust Newsvendor with Moment Constraints},
  journal   = {arXiv preprint arXiv:2010.16369},
  year      = {2020},
  note      = {Preprint}
}
@article{dro_heavytail_2018,
  author    = {Natarajan, Karthik and Sim, Melvyn and Uichanco, Joline},
  title     = {On the Heavy-tail Behavior of the Distributionally Robust Newsvendor},
  journal   = {Operations Research},
  year      = {2018},
  doi       = {10.1287/opre.2018.1725},
  note      = {Preprint: arXiv:1806.05379}
}
@article{scarf_1958,
  author    = {Scarf, Herbert},
  title     = {A Min-Max Solution of an Inventory Problem},
  journal   = {Studies in the Mathematical Theory of Inventory and Production},
  pages     = {201--209},
  year      = {1958},
  publisher = {Stanford University Press}
}
@article{croston_1972,
  author    = {Croston, J. D.},
  title     = {Forecasting and Stock Control for Intermittent Demands},
  journal   = {Operational Research Quarterly},
  volume    = {23},
  number    = {3},
  pages     = {289--303},
  year      = {1972},
  doi       = {10.2307/3007885}
}
@article{combining_intermittent_2023,
  author    = {Özer, Melike and Armbruster, Dieter and Levi, Retsef},
  title     = {Combining Probabilistic Forecasts of Intermittent Demand},
  journal   = {arXiv preprint arXiv:2304.03092},
  year      = {2023},
  note      = {Preprint}
}
</div>
