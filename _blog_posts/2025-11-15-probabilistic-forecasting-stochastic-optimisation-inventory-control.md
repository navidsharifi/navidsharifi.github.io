---
layout: post
title: "Probabilistic Demand Forecasting and Stochastic Optimisation for Inventory Control"
author: Navid Sharifi
image: assets/images/blog/probabilistic-forecasting-stochastic-optimisation-inventory-control/cover.svg
featured: true
hidden: false
comments: true
anim: true
categories: Supply-Chain Forecasting Stochastic-Optimisation
excerpt: "A forecast is only useful if it changes an order. This post follows one product from a quantile forecast to a weekly replenishment decision, simulates a year of trading under three forecasters, and shows why two models with the same point accuracy can leave very different amounts of money on the shelf."
---

## The Gap Between the Forecast and the Order

In most companies the forecast and the order are made by different people. An analyst fits a model and sends over one number per week. A planner takes that number, adds a safety margin, and orders. Both are doing their job well by the measures they are given. The analyst is judged on accuracy. The planner is judged on stock-outs and inventory value. Nobody is judged on whether the forecast was the right input for the order.

I think this is the most expensive handover in supply chain analytics. A model can have the best mean error in the building and still cause stock-outs every time a promotion runs, because it says nothing about how wide the demand distribution is in a promotion week. The planner's safety margin cannot fix this. It is one number for every week, and the weeks are not alike.

This post follows one product from a demand forecast to a replenishment rule and then through a simulated year of trading. The forecast is a distribution, not a point, scored with proper scoring rules <cite data-key="gneiting_raftery_2007"></cite>. The decision is the newsvendor's critical fractile, which reads the quantile it needs from that distribution <cite data-key="zipkin_2000"></cite>. The test is a Monte Carlo simulation of inventory cost. Along the way I compare three forecasters that share the same point forecast quality and find that their inventory costs are not the same. The idea that a model should be judged by the decision it feeds, rather than by its error alone, has a growing literature under the names decision-focused learning and prescriptive analytics <cite data-key="elmachtoub_grigas_2022, bertsimas_kallus_2020"></cite>. This post is a small, concrete instance of it.

## Why a Point Forecast Is the Wrong Input

Inventory costs are asymmetric. Running out of a product that sells for a good margin costs far more per unit than holding one unit for an extra week. A symmetric error measure such as root mean squared error (RMSE) treats a shortfall of ten units and a surplus of ten units as equal mistakes. The warehouse does not.

A replenishment rule needs a quantile. If a lost sale costs nine times what a week of holding costs, the rule should carry enough stock to cover demand nine times out of ten. That is a statement about the 90th percentile of demand, not about its mean. A point forecast plus one standard deviation can produce a 90th percentile only if demand is roughly normal with the same spread every week. For most retail products neither holds. Demand is skewed to the right, it is more variable when its level is high, and it is far more variable in promotion weeks <cite data-key="kolassa_2016"></cite>.

The fix is to forecast the whole conditional distribution and let the policy read whichever quantile it needs. Writing $D_{t+h}$ for demand $h$ weeks after the forecast origin $t$ and $\mathcal{X}_t$ for everything known at $t$, the object we want is

<div class="academic-equation" id="eq-forecast-dist">

$$D_{t+h} \sim \hat{F}_{t+h}(\cdot \mid \mathcal{X}_t)$$

</div>

The one property this distribution must have is calibration: of all the weeks in which the forecast said demand would stay below its 90th percentile, about 90 percent should actually do so <cite data-key="gneiting_balabdaoui_raftery_2007"></cite>. A distribution can be sharp and still badly calibrated. In inventory control that is the worst combination, because it gives confident safety stocks that are wrong.

## One Product, Three Years

To keep everything checkable I simulate the product rather than borrow a dataset. Weekly demand follows a seasonal pattern around 120 units, with a 60 percent uplift in promotion weeks, which happen about one week in six. The noise is negative binomial, so demand is skewed and its variance rises with its level. This is the standard choice for retail count data <cite data-key="kolassa_2016"></cite>. The first 104 weeks are used for fitting and the last 52 for testing. Promotion dates are known in advance, as they are in practice.

Three forecasters share one seasonal regression and differ only in how they describe uncertainty.

- **Forecaster A** uses the promotion-aware regression for the mean and a normal distribution with one residual standard deviation for every week.
- **Forecaster B** uses the same mean, but describes uncertainty with the empirical distribution of the ratio of actual to fitted demand over the training years. Its spread therefore scales with the level, and its shape is whatever the data say it is.
- **Forecaster C** is the same as A but without the promotion feature, which is what a model fed only sales history would see.

A and B produce identical point forecasts. Their RMSE on the test year is the same to the last digit. Anything that separates them is coming from the tails.

<figure class="academic-figure" id="fig-fan">
<img src="{{ '/assets/images/blog/probabilistic-forecasting-stochastic-optimisation-inventory-control/fan-chart.svg' | relative_url }}" alt="Two years of weekly demand followed by a one-year quantile forecast with 10 to 90 and 25 to 75 percent bands and realised demand" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Two years of weekly demand followed by the test year. The bands are forecaster B's 10 to 90 percent and 25 to 75 percent intervals, the blue line is its median and the red line is what actually happened. Shaded columns are promotion weeks. The bands widen in promotion weeks because the forecaster's spread scales with the level of demand."></figcaption>
</figure>

<a href="#fig-fan" class="ref"></a> shows the test year through forecaster B's eyes. Two things are worth noticing. The intervals are wide, because weekly demand for a single product is noisy and the forecaster is honest about it. And they are not equally wide. In promotion weeks the 90th percentile sits far above the median, which is exactly where forecaster A, with its single standard deviation, will be too low.

## Scoring the Distribution Before Using It

A quantile forecast is scored with the pinball loss. For a quantile level $\tau$, a forecast $\hat{q}_\tau$ and an outcome $y$,

<div class="academic-equation" id="eq-pinball">

$$L_\tau(y, \hat{q}_\tau) = \big(\tau - \mathbf{1}\{y < \hat{q}_\tau\}\big)\,(y - \hat{q}_\tau)$$

</div>

The loss is small when the forecast quantile is at the right place and it charges more for being too low than too high when $\tau$ is above one half. Averaged over all quantile levels it becomes the continuous ranked probability score (CRPS), which scores the whole distribution at once <cite data-key="gneiting_raftery_2007"></cite>. Both are proper: a forecaster minimises them in expectation by reporting its true belief, so there is no incentive to hedge. The M5 uncertainty competition used exactly this family of scores to rank distributional forecasts of retail demand <cite data-key="m5_uncertainty_2022"></cite>.

<div class="academic-table" id="tab-scores" data-caption="Forecast scores on the 52 test weeks. Pinball loss is reported at the two quantile levels the inventory policy will consume. Coverage is the share of test weeks in which demand stayed at or below the forecast quantile; the target values are 0.90 and 0.95." markdown="1">

| Forecaster | RMSE | MAE | CRPS | Pinball at 0.90 | Pinball at 0.95 | Coverage at 0.90 | Coverage at 0.95 |
|---|---:|---:|---:|---:|---:|---:|---:|
| A: normal, promotion-aware | 48.7 | 36.9 | 27.2 | 10.7 | 7.0 | 0.85 | 0.90 |
| B: empirical quantiles, promotion-aware | 48.7 | 36.9 | 26.4 | 9.6 | 6.1 | 0.88 | 0.90 |
| C: normal, promotion-blind | 58.0 | 40.5 | 30.6 | 13.4 | 9.7 | 0.88 | 0.90 |

</div>

<a href="#tab-scores" class="ref"></a> says what RMSE cannot. A and B tie on every point measure and separate on the pinball loss at the 90th and 95th percentiles, where B is about ten percent better. Those two levels are the only part of the distribution the ordering rule will ever look at. Forecaster C is worse on everything, which is the honest price of not knowing when promotions happen.

<figure class="academic-figure" id="fig-calibration">
<img src="{{ '/assets/images/blog/probabilistic-forecasting-stochastic-optimisation-inventory-control/calibration.svg' | relative_url }}" alt="Calibration curves for the three forecasters: nominal quantile level against empirical coverage" style="max-width: 72%; display: block; margin: 0 auto;">
<figcaption data-caption="Calibration on the test year. For every quantile level on the horizontal axis, the vertical axis shows the share of test weeks in which demand was at or below that forecast quantile. A calibrated forecaster lies on the dotted diagonal. All three run below the diagonal above the 80th percentile, meaning their upper tails are a little too low, and forecaster A is the lowest at the 90th percentile."></figcaption>
</figure>

<a href="#fig-calibration" class="ref"></a> is the diagnostic I would ask for before any forecast is allowed near an order. With 52 test weeks the curves are jagged, and all three forecasters are a little overconfident in the upper tail. The differences are small on this plot. They will not be small in the warehouse.

## The Newsvendor: Where the Forecast Becomes an Order

The simplest model that turns a distribution into an order is the newsvendor. Stock $q$ units before demand $D$ is known. Each unit left over costs $c_o$ and each unit of unmet demand costs $c_u$. The order that minimises expected cost solves

<div class="academic-equation" id="eq-newsvendor">

$$\min_q \; \mathbb{E}\left[c_o\,(q - D)^{+} + c_u\,(D - q)^{+}\right]$$

</div>

and the answer is a quantile of the demand distribution <cite data-key="zipkin_2000"></cite>:

<div class="academic-equation" id="eq-critical-fractile">

$$q^{\star} = F_D^{-1}\!\left(\frac{c_u}{c_u + c_o}\right)$$

</div>

The ratio $c_u / (c_u + c_o)$ is the critical fractile. With a lost sale costing nine times a week of holding, it is 0.9 and the order is the 90th percentile of demand. If a forecaster reports the full distribution, the planner reads that quantile straight off it. There is no safety-stock formula, no assumption of normality, and no separate error model. This is also why the median is almost never the right order. The median is optimal only when $c_u = c_o$.

<figure class="academic-figure" id="fig-newsvendor-interactive">
<div class="dro-anim" data-anim="newsvendor" data-src="{{ '/assets/data/blog/probabilistic-forecasting-stochastic-optimisation-inventory-control/newsvendor.json' | relative_url }}" data-title="Interactive: move the critical fractile">
<noscript>Enable JavaScript to see the interactive figure.</noscript>
</div>
<figcaption data-caption="Interactive view of the newsvendor decision for one promotion week in the test year. The slider sets the critical fractile from 0.5 to 0.99, which fixes the cost ratio. Top: the true demand distribution for the week, with the order quantity read from forecaster B's quantile in green, the units expected to be left over shaded blue and the demand expected to go unmet shaded red. The purple dot is the order a forecaster with perfect knowledge of the distribution would place. Bottom: expected cost against order quantity for the current cost ratio, with the chosen order marked. The readout includes the distribution-free Scarf quantity for comparison."></figcaption>
</figure>

<a href="#fig-newsvendor-interactive" class="ref"></a> lets you move the fractile and watch the order slide up the distribution. At 0.5 the order sits at the median and the red shortfall region is large. As the ratio climbs, the order moves into the right tail, the cost curve becomes steep on the left and shallow on the right, and the penalty for ordering too little grows faster than the penalty for ordering too much. The green order from forecaster B tracks the purple true optimum closely across the range, which is what calibration buys.

<figure class="academic-figure" id="fig-newsvendor-curve">
<img src="{{ '/assets/images/blog/probabilistic-forecasting-stochastic-optimisation-inventory-control/newsvendor-curve.svg' | relative_url }}" alt="Expected newsvendor cost against order quantity for three cost ratios, with optimal orders marked" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Expected cost against order quantity for the same promotion week under three cost ratios. The optimum moves from the median at a ratio of one to well above the mean at a ratio of nine. The curve is asymmetric: ordering 100 units too few at the high ratio costs about five times as much as ordering 100 units too many."></figcaption>
</figure>

## From One Period to a Year

Real replenishment is repeated. Orders placed this week arrive next week, stock carried over affects next week's order, and a lost sale is lost for good. The objective over a horizon of $T$ weeks is

<div class="academic-equation" id="eq-multi-period">

$$\min_{\{Q_t\}} \; \mathbb{E}\left[\sum_{t=1}^{T} h\,(I_t)^{+} + b\,(-I_t)^{+}\right], \qquad I_{t+1} = I_t + Q_{t-L} - D_t$$

</div>

with holding cost $h$ per unit per week, shortage cost $b$ per unit, and lead time $L$. Solving this exactly means dynamic programming over a continuous state, which is not practical for thousands of products. The usual approach is a base-stock policy: at each review, order up to a level $S_t$ chosen so that stock covers demand over the lead time plus the review period with the probability given by the critical fractile <cite data-key="zipkin_2000"></cite>. When the demand distribution is not standard, the level comes from sampled demand paths and a scenario programme, in the manner of stochastic programming <cite data-key="shapiro_2009"></cite>.

Here the lead time is one week, so the policy protects two weeks of demand. Each forecaster supplies its own order-up-to level: the two-week median plus its own estimate of the two-week spread at the target fractile. The rule is identical across forecasters. Only the distribution it reads from differs.

<figure class="academic-figure" id="fig-inventory-interactive">
<div class="dro-anim" data-anim="inventory" data-src="{{ '/assets/data/blog/probabilistic-forecasting-stochastic-optimisation-inventory-control/inventory.json' | relative_url }}" data-title="Interactive: replay the test year">
<noscript>Enable JavaScript to see the interactive figure.</noscript>
</div>
<figcaption data-caption="Replay of the actual test year under forecasters A and B at a critical fractile of 0.9. The slider moves through the 52 weeks. Left: weekly demand as bars, with promotion weeks in orange, the order-up-to level of each policy as a dashed line, the stock on hand after sales as a solid line, and a dot under the axis in every week with lost sales. Right: cumulative cost. The readout tracks stock, lost sales and cost for both policies."></figcaption>
</figure>

<a href="#fig-inventory-interactive" class="ref"></a> replays the test year. Watch the promotion weeks. Forecaster B raises its order-up-to level before each one, because its spread scales with the level. Forecaster A raises it by less and is more often caught short. Over the realised year B finishes with a cost of 7,671 against 8,188 for A, a saving of six percent, while also losing fewer sales. One year is one draw, though. The next section asks whether that holds on average.

## Monte Carlo: What the Policy Costs on Average

I simulate 400 fresh test years from the true demand process and run every policy through each of them. The policies are the three forecasters at nine target fractiles from 0.5 to 0.99, plus a distribution-free policy that uses only the mean and standard deviation. That last one is Scarf's rule <cite data-key="scarf_1958"></cite>, as restated by Gallego and Moon <cite data-key="gallego_moon_1993"></cite>:

<div class="academic-equation" id="eq-scarf">

$$q_{\text{Scarf}} = \mu + \frac{\sigma}{2}\left(\sqrt{\frac{c_u}{c_o}} - \sqrt{\frac{c_o}{c_u}}\right)$$

</div>

It is the order that minimises the worst expected cost over every distribution with that mean and variance, and it needs no assumption about the shape. Natarajan, Sim and Uichanco extend this family to sets that also fix the asymmetry of demand <cite data-key="natarajan_sim_uichanco_2018"></cite>, and Das, Dhara and Natarajan show how heavy the implied worst-case tails are <cite data-key="das_dhara_natarajan_2021"></cite>. I include Scarf's rule because it is a useful yardstick: it is what you can do when you trust the first two moments and nothing else.

<div class="academic-table" id="tab-mc" data-caption="Monte Carlo results over 400 simulated years at a critical fractile of 0.9. Cost is in units of the weekly holding cost of one unit. Fill rate is the share of demand met from stock. The best fractile is the target that gives each forecaster its lowest mean cost." markdown="1">

| Policy | Mean annual cost | 95th percentile of cost | Fill rate | Units short per year | Weeks with lost sales | Best fractile | Cost at best fractile |
|---|---:|---:|---:|---:|---:|---:|---:|
| A: normal, promotion-aware | 8,118 | 10,705 | 93.8% | 442 | 7.7 | 0.90 | 8,118 |
| B: empirical quantiles, promotion-aware | 7,961 | 10,054 | 94.8% | 367 | 7.0 | 0.90 | 7,961 |
| C: normal, promotion-blind | 9,079 | 11,960 | 92.6% | 523 | 8.3 | 0.95 | 9,052 |
| Scarf, mean and variance only | 8,108 | 10,655 | 94.0% | 426 | 7.3 | | |

</div>

<a href="#tab-mc" class="ref"></a> is the result the whole post is built around. Forecasters A and B have identical point accuracy. Over 400 simulated years B costs two percent less, loses 17 percent fewer sales, and has a 95th percentile of annual cost six percent lower. The whole difference comes from the upper tail of the forecast in promotion weeks. Forecaster C costs twelve percent more than B, which is roughly what it costs to not know the promotion calendar. Scarf's rule, which knows nothing about shape, lands on top of forecaster A. That is no accident. A normal distribution with a fixed standard deviation carries exactly the information Scarf's rule uses, and no more.

<figure class="academic-figure" id="fig-frontier">
<img src="{{ '/assets/images/blog/probabilistic-forecasting-stochastic-optimisation-inventory-control/frontier.svg' | relative_url }}" alt="Mean annual cost against fill rate for each forecaster across target fractiles, with the Scarf policy marked" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Mean annual cost against fill rate as the target fractile rises from 0.5 to 0.99 for each forecaster. Every curve is U-shaped in cost. The minimum is at the critical fractile of 0.9 for A and B and at 0.95 for C, which needs to over-target to make up for what it does not know. B's curve lies below A's everywhere above a fill rate of 90 percent. The purple diamond is Scarf's rule."></figcaption>
</figure>

<a href="#fig-frontier" class="ref"></a> shows the same thing across all targets. Each forecaster traces a curve as the target fractile rises: cost falls, reaches a minimum near the critical fractile, and climbs again as holding cost takes over. Two things stand out. B's curve sits below A's throughout the region any retailer would operate in. And the minimum of each curve lands where the theory says it should, at 0.9, except for C, whose best target is 0.95. A forecaster that does not know about promotions has to carry extra stock all year to survive them.

<figure class="academic-figure" id="fig-kpi">
<img src="{{ '/assets/images/blog/probabilistic-forecasting-stochastic-optimisation-inventory-control/kpi.svg' | relative_url }}" alt="Violin plots of annual cost, fill rate and units short across 400 simulated years for the four policies" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Distribution of annual cost, fill rate and units short over 400 simulated years at a critical fractile of 0.9. Forecaster B has the lowest median cost and the tightest cost distribution. Forecaster C has the widest. The Scarf policy is almost indistinguishable from forecaster A."></figcaption>
</figure>

<a href="#fig-kpi" class="ref"></a> shows the spread, which matters as much as the mean. A policy that is cheap on average and ruinous one year in twenty is not a good policy. B's cost distribution is the tightest of the four. Its upper tail is where the gain is, because the bad years are the ones with several large promotion weeks in a row, and those are the weeks in which B carries more stock.

## Why Two Models With the Same RMSE Cost Different Amounts

The mechanism is simple once the numbers are on the table. Forecaster A uses one standard deviation, about 44 units, for every week. In an ordinary week the true standard deviation is close to that. In a promotion week, with mean demand near 200, it is closer to 75. A's 90th percentile in those weeks is therefore too low by around 40 units, and at nine units of penalty per lost sale that is where the extra cost comes from. Forecaster B learned the spread as a proportion of the level, so its 90th percentile moves with the mean.

Nothing in RMSE can see this. RMSE averages squared errors of the mean forecast, and the two mean forecasts are the same. The pinball loss at the 90th percentile sees it immediately, because that is the quantity being scored. This is the practical content of decision-focused evaluation: score the forecast on the part of the distribution the decision consumes <cite data-key="elmachtoub_grigas_2022"></cite>. Ban and Rudin make the point from the other direction, learning the order quantity directly from features and showing that it can beat forecasting and then optimising when the forecast is misspecified <cite data-key="ban_rudin_2019"></cite>.

## What to Report, and in What Order

A credible study of this pipeline reports two sets of numbers and keeps them in that order.

1. **Forecast scores at the levels the policy uses.** Pinball loss at the critical fractile and at one level above it, CRPS as a summary, and coverage at those same levels. A calibration plot like <a href="#fig-calibration" class="ref"></a>.
2. **Inventory outcomes from a rolling simulation.** Total cost split into holding and shortage, fill rate, weeks with lost sales, average stock on hand, and the spread of cost across simulated years. A frontier like <a href="#fig-frontier" class="ref"></a>, so that the trade-off is visible rather than summarised.

The simulation should use rolling origins, a fixed horizon, and a realistic retraining schedule, and it should be run on perturbed demand as well as on the fitted distribution, because the forecaster will be wrong in ways the training years did not show. A moment-based rule such as <a href="#eq-scarf" class="eqref"></a> is a sensible companion for that stress test.

## Pitfalls I Keep Meeting

- **Censored demand.** Sales are zero when the shelf is empty, but demand is not. A model trained on sales learns to under-forecast exactly the weeks it most needs to get right, and the stock-outs then feed the next training set. Flag stock-out weeks and treat them as censored.
- **Intermittent products.** Most items in a long tail sell nothing in most weeks. Croston's method and its corrections remain the baseline <cite data-key="croston_1972, syntetos_boylan_2005"></cite>, and count distributions such as the negative binomial handle the zeros where a normal model cannot <cite data-key="kolassa_2016"></cite>.
- **Leakage.** A promotion uplift that was only known after the event is not a feature. It is a leak that inflates every score and vanishes at deployment.
- **Scoring the whole distribution when the decision uses one quantile.** CRPS is a fine summary, but two forecasters with the same CRPS can differ badly at the 95th percentile. Look at the levels you use.
- **Picking the target fractile by hand.** The critical fractile is a cost ratio, not a service-level preference. If the business insists on a 98 percent fill rate, it is implicitly stating that a lost sale costs fifty times a week of holding. Say so, and check whether anyone believes it.

## Closing

A forecast is a claim about the future. An order is a bet on it. The only test of a demand forecast that matters to a supply chain is whether the bets it supports pay off. In this study two forecasters made identical claims about the mean and different claims about the tail, and the one with the better tail saved two percent of annual cost and a sixth of lost sales without holding more stock on average. The point accuracy measures could not tell them apart. The pinball loss at the 90th percentile could, and so could the simulated warehouse.

Score the distribution, read the quantile the cost structure asks for, and simulate the policy. Model selection by RMSE alone is choosing a forecaster for a job it was never asked to do.

<div class="bibliography-data" style="display:none;">
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
@article{gneiting_balabdaoui_raftery_2007,
  author    = {Gneiting, Tilmann and Balabdaoui, Fadoua and Raftery, Adrian E.},
  title     = {Probabilistic Forecasts, Calibration and Sharpness},
  journal   = {Journal of the Royal Statistical Society: Series B},
  volume    = {69},
  number    = {2},
  pages     = {243--268},
  year      = {2007},
  doi       = {10.1111/j.1467-9868.2007.00587.x}
}
@book{zipkin_2000,
  author    = {Zipkin, Paul H.},
  title     = {Foundations of Inventory Management},
  publisher = {McGraw-Hill},
  year      = {2000}
}
@article{elmachtoub_grigas_2022,
  author    = {Elmachtoub, Adam N. and Grigas, Paul},
  title     = {Smart ``Predict, then Optimize''},
  journal   = {Management Science},
  volume    = {68},
  number    = {1},
  pages     = {9--26},
  year      = {2022},
  doi       = {10.1287/mnsc.2020.3922}
}
@article{bertsimas_kallus_2020,
  author    = {Bertsimas, Dimitris and Kallus, Nathan},
  title     = {From Predictive to Prescriptive Analytics},
  journal   = {Management Science},
  volume    = {66},
  number    = {3},
  pages     = {1025--1044},
  year      = {2020},
  doi       = {10.1287/mnsc.2018.3253}
}
@article{kolassa_2016,
  author    = {Kolassa, Stephan},
  title     = {Evaluating Predictive Count Data Distributions in Retail Sales Forecasting},
  journal   = {International Journal of Forecasting},
  volume    = {32},
  number    = {3},
  pages     = {788--803},
  year      = {2016},
  doi       = {10.1016/j.ijforecast.2015.12.004}
}
@article{m5_uncertainty_2022,
  author    = {Makridakis, Spyros and Spiliotis, Evangelos and Assimakopoulos, Vassilios and Chen, Zhi and Gaba, Anil and Tsetlin, Ilia and Winkler, Robert L.},
  title     = {The M5 Uncertainty Competition: Results, Findings and Conclusions},
  journal   = {International Journal of Forecasting},
  volume    = {38},
  number    = {4},
  pages     = {1365--1385},
  year      = {2022},
  doi       = {10.1016/j.ijforecast.2021.10.009}
}
@book{shapiro_2009,
  author    = {Shapiro, Alexander and Dentcheva, Darinka and Ruszczy{\'n}ski, Andrzej},
  title     = {Lectures on Stochastic Programming: Modeling and Theory},
  publisher = {SIAM},
  year      = {2009},
  doi       = {10.1137/1.9780898718751}
}
@incollection{scarf_1958,
  author    = {Scarf, Herbert},
  title     = {A Min-Max Solution of an Inventory Problem},
  booktitle = {Studies in the Mathematical Theory of Inventory and Production},
  editor    = {Arrow, Kenneth J. and Karlin, Samuel and Scarf, Herbert},
  publisher = {Stanford University Press},
  pages     = {201--209},
  year      = {1958}
}
@article{gallego_moon_1993,
  author    = {Gallego, Guillermo and Moon, Ilkyeong},
  title     = {The Distribution Free Newsboy Problem: Review and Extensions},
  journal   = {Journal of the Operational Research Society},
  volume    = {44},
  number    = {8},
  pages     = {825--834},
  year      = {1993},
  doi       = {10.1057/jors.1993.141}
}
@article{natarajan_sim_uichanco_2018,
  author    = {Natarajan, Karthik and Sim, Melvyn and Uichanco, Joline},
  title     = {Asymmetry and Ambiguity in Newsvendor Models},
  journal   = {Management Science},
  volume    = {64},
  number    = {7},
  pages     = {3146--3167},
  year      = {2018},
  doi       = {10.1287/mnsc.2017.2773}
}
@article{das_dhara_natarajan_2021,
  author    = {Das, Bikramjit and Dhara, Anulekha and Natarajan, Karthik},
  title     = {On the Heavy-Tail Behavior of the Distributionally Robust Newsvendor},
  journal   = {Operations Research},
  volume    = {69},
  number    = {4},
  pages     = {1077--1099},
  year      = {2021},
  doi       = {10.1287/opre.2020.2091}
}
@article{ban_rudin_2019,
  author    = {Ban, Gah-Yi and Rudin, Cynthia},
  title     = {The Big Data Newsvendor: Practical Insights from Machine Learning},
  journal   = {Operations Research},
  volume    = {67},
  number    = {1},
  pages     = {90--108},
  year      = {2019},
  doi       = {10.1287/opre.2018.1757}
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
@article{syntetos_boylan_2005,
  author    = {Syntetos, Aris A. and Boylan, John E.},
  title     = {The Accuracy of Intermittent Demand Estimates},
  journal   = {International Journal of Forecasting},
  volume    = {21},
  number    = {2},
  pages     = {303--314},
  year      = {2005},
  doi       = {10.1016/j.ijforecast.2004.10.001}
}
</div>
