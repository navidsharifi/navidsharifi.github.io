---
layout: post
title: "Robust Portfolios Without the Crystal Ball: Wasserstein DRO for Asset Allocation"
author: Navid Sharifi
date: 2026-02-28
image: assets/images/blog/robust-portfolios-wasserstein-dro/cover.svg
featured: true
hidden: false
comments: true
anim: true
categories: Distributionally-Robust-Optimisation Portfolio-Optimisation Optora
excerpt: "A ten-year sample is a poor crystal ball. This post builds a long-only portfolio on a Wasserstein ball around the empirical return distribution, shows how the radius turns a single bet into a diversified book, and tests the result in a stress regime the optimiser never saw."
---

## The Problem With Optimising on a Sample

Every portfolio optimiser starts from the same quiet assumption. The returns we have seen are a fair picture of the returns we will see. Markowitz-style mean-variance optimisation takes that picture literally. It feeds sample means and covariances into a quadratic programme and returns a set of weights that is optimal for the sample and often absurd for the future. Michaud called this the Markowitz optimisation enigma: the optimiser is an error maximiser, because it rewards exactly the assets whose sample statistics are most flattering <cite data-key="michaud_1989"></cite>. DeMiguel, Garlappi and Uppal later showed that a naive equal-weight rule beats a long list of optimised strategies out of sample, mainly because estimation error in the means swamps whatever the optimiser gains <cite data-key="demiguel_2009"></cite>.

Distributionally robust optimisation (DRO) offers a cleaner way to express this doubt. Instead of trusting the empirical distribution $\hat P$, we optimise against the worst distribution inside a ball around it. The ball has a radius. The radius is a statement about how far reality may drift from the sample. Wasserstein balls are a natural choice for returns, because the Wasserstein distance measures how much probability mass must move, and how far, to turn one return distribution into another. Mohajerin Esfahani and Kuhn gave the tractable reformulation that made Wasserstein DRO practical <cite data-key="esfahani_kuhn_2018"></cite>, and Blanchet, Chen and Zhou worked out the mean-variance portfolio case in detail <cite data-key="blanchet_chen_zhou_2022"></cite>. A survey of the wider landscape is in Rahimian and Mehrotra <cite data-key="rahimian_mehrotra_2022"></cite>.

This post runs the idea end to end with Optora, my PyTorch library for DRO <cite data-key="optora_2026"></cite>. The goal is not a new theorem. The goal is to see, in numbers and pictures, what the radius does to a portfolio and what that costs.

## The Decision Problem

Let $r \in \mathbb{R}^6$ be a vector of monthly simple returns on six assets and let $w$ be a long-only weight vector on the simplex. The loss of the portfolio in a month is the negative return $\ell(w, r) = -\,w^\top r$. With $N$ observed months and empirical distribution $\hat P_N$, the robust problem is

<div class="academic-equation" id="eq-dro-portfolio">

$$\min_{w \in \Delta} \; \sup_{Q :\, W_c(Q, \hat P_N) \le \rho} \; \mathbb{E}_Q\!\left[-\,w^\top r\right]$$

</div>

where $W_c$ is the type-1 Wasserstein distance with Euclidean ground cost $c(r, r') = \lVert r - r' \rVert_2$ on return vectors. At $\rho = 0$ the ball collapses to $\hat P_N$ and the problem is plain sample-average maximisation of expected return. Since the objective is linear in $w$, that problem always puts all the weight on the asset with the best sample mean.

The Wasserstein ball changes this through a well-known identity. For a loss that is linear in the uncertain return, the worst-case expectation over a Wasserstein ball with full support equals the empirical mean plus the radius times the dual norm of the gradient <cite data-key="esfahani_kuhn_2018"></cite>:

<div class="academic-equation" id="eq-norm-penalty">

$$\sup_{Q :\, W_c(Q, \hat P_N) \le \rho} \mathbb{E}_Q\!\left[-\,w^\top r\right] \;=\; -\,w^\top \bar r_N \;+\; \rho \,\lVert w \rVert_2$$

</div>

So Wasserstein DRO for a linear portfolio loss is mean-return maximisation with a Euclidean-norm penalty on the weights. The penalty is smallest at equal weights. The radius therefore interpolates between the sample-optimal corner solution and the 1/N portfolio. I will check this identity numerically below, because Optora's ball lives on the observed months only, and that restriction matters when the radius is large.

## Data

I simulate returns from a two-factor model with heavy tails, so that the truth is known and a stress regime can be switched on. Six assets load on a growth factor and a rates factor. Factor and idiosyncratic shocks are Student-t with four degrees of freedom, scaled to unit variance. Log returns are converted to simple returns, so no asset can lose more than its full value. The training sample is 120 months, a ten-year history. The two test regimes are:

- **Normal regime.** Same parameters as the training distribution, 50,000 months.
- **Stress regime.** Equity means turn negative, factor volatility rises by 80 percent and the loadings of emerging-market equity, commodities and real estate on the growth factor increase, so correlations rise. 50,000 months.

The training sample is, by chance, kind to emerging-market equity. Its annualised sample mean is 16.7 percent against a true value of 12.1 percent. This is exactly the kind of luck an optimiser will exploit.

<div class="academic-table" id="tab-assets" data-caption="Annualised mean returns in percent. The training sample is 120 months drawn from the normal regime. Test figures are population values from 50,000 simulated months." markdown="1">

| Asset | Training sample | Normal regime | Stress regime |
|---|---:|---:|---:|
| US equity | 2.5 | 9.2 | -16.0 |
| EM equity | 16.7 | 12.1 | -24.4 |
| Government bonds | 2.2 | 3.2 | 5.2 |
| Corporate bonds | 1.7 | 4.4 | -1.5 |
| Commodities | 6.7 | 6.2 | -9.2 |
| Real estate | 6.4 | 7.8 | -14.5 |

</div>

## Solving It With Optora

Optora treats the ambiguity set as an object that knows how to compute its own worst case. The outer minimisation over $w$ is ordinary PyTorch. I parameterise the weights with a softmax so the simplex constraint is automatic, and I solve seven radii in one batched call by passing a tensor radius.

```python
import torch
from optora import WassersteinAmbiguitySet

N = R_train.shape[0]                                   # 120 months x 6 assets
nominal = torch.full((N,), 1.0 / N, dtype=torch.float64)
cost = torch.cdist(R_train, R_train)                   # Euclidean ground metric
radii = torch.tensor([0.0, 0.002, 0.005, 0.01, 0.02, 0.04, 0.08])

ball = WassersteinAmbiguitySet(nominal=nominal, cost=cost, radius=radii)

theta = torch.zeros(len(radii), 6, dtype=torch.float64, requires_grad=True)
opt = torch.optim.Adam([theta], lr=0.05)
for _ in range(2000):
    opt.zero_grad()
    w = torch.softmax(theta, dim=-1)                    # (7, 6) long-only weights
    loss = -(R_train @ w.T).T                           # (7, 120) per-month losses
    ball.worst_case_expectation(loss).sum().backward()  # exact inner sup, one call
    opt.step()
```

Two details deserve a comment. First, `worst_case_expectation` takes the per-scenario losses, not their mean. The inner supremum is solved exactly inside the call by bisection on the dual of the finite-support transport problem, and gradients flow through it. Second, the worst-case distribution itself is available for free. By Danskin's theorem the gradient of the worst-case value with respect to the loss vector is the maximising distribution $q^{\star}$, so `loss.grad` after a backward pass is the adversary's choice of weights on the 120 months.

## What the Radius Does to the Weights

<figure class="academic-figure" id="fig-interactive">
<div class="dro-anim" data-anim="portfolio" data-src="{{ '/assets/data/blog/robust-portfolios-wasserstein-dro/portfolio.json' | relative_url }}" data-title="Interactive: sweep the Wasserstein radius">
<noscript>Enable JavaScript to see the interactive figure.</noscript>
</div>
<figcaption data-caption="Interactive view of the trained portfolios. The slider moves the Wasserstein radius from 0 to 0.08 through 25 trained solutions. Left: the weights of the six assets. Right: the 120 training months, each sized and coloured by the weight the worst-case distribution gives it relative to its nominal weight of 1 in 120. The readout shows the annualised in-sample, normal-regime and stress-regime returns of the current portfolio."></figcaption>
</figure>

<a href="#fig-interactive" class="ref"></a> lets you move the radius yourself and watch the weights and the adversary respond together. The static figures that follow pick out the frames worth discussing.

<figure class="academic-figure" id="fig-weights">
<img src="{{ '/assets/images/blog/robust-portfolios-wasserstein-dro/weights.svg' | relative_url }}" alt="Stacked area chart of portfolio weights against the Wasserstein radius" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Portfolio weights as a function of the Wasserstein radius. At small radii the solution is the sample-optimal corner, all in emerging-market equity. Beyond a radius of about 0.01 the book diversifies, and government bonds become the largest holding."></figcaption>
</figure>

<a href="#fig-weights" class="ref"></a> shows the effect. For radii up to 0.005 the optimiser does what sample-average optimisation always does and puts 100 percent in the asset with the best sample mean. At $\rho = 0.01$ real estate and commodities enter. At $\rho = 0.02$ the book holds all six assets, and at $\rho = 0.08$ government bonds are 53 percent of it. Nothing in the objective says "diversify". Diversification is what the norm penalty in <a href="#eq-norm-penalty" class="eqref"></a> buys.

The identity itself can be checked. For each trained portfolio I computed the sample Lipschitz constant of the loss across months, $L_N = \max_{i \ne j} \lvert w^\top (r_i - r_j) \rvert / \lVert r_i - r_j \rVert_2$, which is what the finite-support ball actually charges per unit of transport. It should sit just below $\lVert w \rVert_2$.

<div class="academic-table" id="tab-lipschitz" data-caption="Sample Lipschitz constant of the portfolio loss against the Euclidean norm of the weights, for each trained radius." markdown="1">

| Radius | 0 | 0.005 | 0.01 | 0.02 | 0.04 | 0.08 |
|---|---:|---:|---:|---:|---:|---:|
| Sample Lipschitz constant | 0.987 | 0.987 | 0.839 | 0.480 | 0.464 | 0.552 |
| Euclidean norm of weights | 0.999 | 0.999 | 0.849 | 0.484 | 0.479 | 0.581 |

</div>

The two rows track each other to within a few percent. The gap is the price of a finite support: the worst pair of observed months is never perfectly aligned with the direction $w$, so the sample can only approximate the population penalty from below. The companion post on Wasserstein robustness and Lipschitz regularisation looks at this gap in detail.

## What the Radius Costs and What It Buys

<figure class="academic-figure" id="fig-returns">
<img src="{{ '/assets/images/blog/robust-portfolios-wasserstein-dro/returns.svg' | relative_url }}" alt="Annualised returns against the Wasserstein radius for the training sample, the worst-case value, the normal regime and the stress regime" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Annualised return of the robust portfolios. The in-sample mean falls as the radius grows. The out-of-sample return in the normal regime falls more slowly. The return in the stress regime improves sharply. The dashed line is the worst-case value inside the ball, which turns negative at a radius of 0.02."></figcaption>
</figure>

<a href="#fig-returns" class="ref"></a> is the heart of the matter, and the numbers are in <a href="#tab-results" class="ref"></a>. Read it in three steps.

1. **In the training sample** the robust portfolios look worse and worse. The in-sample annualised return drops from 16.7 percent at $\rho = 0$ to 5.1 percent at $\rho = 0.08$. This is the cost that makes DRO unattractive to anyone who judges a strategy by its backtest.
2. **In the normal regime** the cost shrinks. The sample-optimal portfolio returns 12.0 percent, not 16.7, because the sample overstated emerging-market equity. The robust books lose less relative to their backtests. At $\rho = 0.04$ the gap between in-sample and out-of-sample return has vanished.
3. **In the stress regime** the ordering flips. The sample-optimal portfolio loses 24.4 percent a year. The portfolio at $\rho = 0.08$ loses 4.7 percent. The 5 percent conditional value at risk of monthly return improves from minus 20.7 percent to minus 5.7 percent, and the worst month improves from minus 87 percent to minus 38 percent.

<div class="academic-table" id="tab-results" data-caption="Out-of-sample performance of the trained portfolios. Returns are annualised in percent. CVaR is the mean of the worst 5 percent of monthly returns, in percent per month. KL radius 0.016 is the 95 percent calibrated value from Optora's kl_radius for 120 observations." markdown="1">

| Portfolio | In-sample return | Normal: return | Normal: CVaR 5% | Stress: return | Stress: CVaR 5% | Stress: worst month |
|---|---:|---:|---:|---:|---:|---:|
| Sample average (ρ = 0) | 16.7 | 12.0 | -10.1 | -24.4 | -20.7 | -87 |
| Wasserstein ρ = 0.01 | 15.0 | 11.3 | -9.0 | -22.6 | -19.5 | -86 |
| Wasserstein ρ = 0.02 | 9.0 | 8.2 | -5.2 | -13.2 | -12.5 | -65 |
| Wasserstein ρ = 0.04 | 6.8 | 7.1 | -3.7 | -9.1 | -9.0 | -52 |
| Wasserstein ρ = 0.08 | 5.1 | 5.8 | -2.5 | -4.7 | -5.7 | -38 |
| KL ρ = 0.016 (calibrated) | 16.7 | 12.0 | -10.1 | -24.4 | -20.7 | -87 |
| KL ρ = 0.05 | 7.2 | 6.4 | -3.1 | -6.4 | -6.8 | -40 |
| KL ρ = 0.2 | 4.8 | 5.4 | -2.2 | -2.9 | -4.7 | -31 |
| CVaR α = 0.25 | 3.4 | 5.0 | -2.1 | -1.7 | -3.9 | -28 |
| Equal weight | 6.0 | 7.2 | -4.2 | -10.1 | -10.7 | -63 |

</div>

The equal-weight portfolio is a useful yardstick. In the normal regime it returns 7.2 percent, close to the Wasserstein book at $\rho = 0.04$. In the stress regime it loses 10.1 percent, close to that same book. The robust optimiser has, in effect, discovered a 1/N-like portfolio from the data, but it has also tilted it toward the assets that hurt least when the adversary moves the mass. That tilt is visible in the bond weight.

<figure class="academic-figure" id="fig-stress-hist">
<img src="{{ '/assets/images/blog/robust-portfolios-wasserstein-dro/stress-hist.svg' | relative_url }}" alt="Histograms of monthly returns in the stress regime for the sample-average, robust and equal-weight portfolios" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Distribution of monthly portfolio returns in the stress regime. The sample-average portfolio has a wide, left-skewed distribution. The robust book at radius 0.04 is narrower and its left tail is shorter than that of the equal-weight portfolio."></figcaption>
</figure>

## Where the Adversary Puts the Mass

The worst-case distribution is not an abstraction. It is a reweighting of the 120 training months, and it can be plotted. <a href="#fig-adversary" class="ref"></a> shows each month by the return of its equity basket and its bond basket. The colour and size of a point show how much weight the adversary gives it relative to its nominal weight of 1/120.

<figure class="academic-figure" id="fig-adversary">
<img src="{{ '/assets/images/blog/robust-portfolios-wasserstein-dro/adversary.svg' | relative_url }}" alt="Scatter plots of training months weighted by the worst-case distribution at two radii" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="The worst-case distribution over the training months at two radii. Each point is a month, placed by the mean return of the two equity assets and of the two bond assets. Larger, redder points carry more worst-case weight. At radius 0.005 the adversary concentrates on four months. At radius 0.04 it spreads over seventeen months in the lower-left corner, where equities and bonds fall together."></figcaption>
</figure>

At a small radius the adversary can only afford to move a little mass, and it moves it to the handful of months that hurt the concentrated portfolio most. At a larger radius it builds an entire bad regime out of the lower-left corner of the scatter: months in which equities and bonds fell together. This is a cheap and honest stress test. The optimiser is not told what a crisis looks like. It constructs one from the months it has seen.

## Choosing the Radius Is a Judgement, Not a Tuning Step

It is tempting to pick $\rho$ by cross-validation. I tried it. Five-fold cross-validation on the training months, scoring each radius by mean held-out return, picks $\rho = 0$. The held-out return falls monotonically from 16.7 percent at $\rho = 0$ to 4.4 percent at $\rho = 0.08$. The reason is simple. Every fold shares the same lucky decade for emerging-market equity. Validation cannot see a regime that is absent from the data, which is the regime the radius is supposed to guard against.

The calibrated Kullback-Leibler radius tells the same story from the other side. Optora's `kl_radius(120, 0.95)` returns 0.016, the radius at which a KL ball is a 95 percent confidence set for the mean under standard asymptotics. That ball is too small to move a corner solution at all. Its portfolio is identical to the sample-average one. Statistical calibration protects against sampling error, not against a change of regime.

Two practical rules fall out of <a href="#fig-returns" class="ref"></a>. The first is the sign of the worst-case value. At $\rho = 0.02$ the worst-case annualised return inside the ball turns negative. This is the smallest ball that contains a loss-making distribution, and it is a natural scale for "plausible drift". The second is to state the radius in the units of the problem. A Euclidean radius of 0.02 on monthly return vectors means that the adversary may shift each month's six-asset return vector by about two percentage points on average. An investment committee can argue about whether that is enough. It cannot argue about a cross-validation score.

## Limitations

The study is deliberately small. Six assets, one ten-year sample, and a stress regime I designed. Real return series have time dependence, which a reweighting of independent months ignores. Optora's Wasserstein set is supported on the observed months, so it cannot invent a return that was never seen. Its worst case is therefore a lower bound on the worst case over a ball with full support, and the two diverge once the radius is large relative to the spacing between months. Finally, the loss here is linear. A mean-variance or utility-based loss would change the norm in <a href="#eq-norm-penalty" class="eqref"></a> and the shape of the trade-off, although not its direction.

## Takeaways

- Sample-average portfolio optimisation with a linear objective is a bet on the luckiest asset in the sample. In this experiment that bet lost 24 percent a year in a stress regime.
- A Wasserstein ball turns that bet into a diversified, bond-tilted book. The mechanism is a Euclidean-norm penalty on the weights, which the finite-sample Lipschitz constant reproduces to within a few percent.
- The price in the normal regime was moderate. At radius 0.04 the robust book gave up 5 points of annual return relative to the sample-optimal book and gained 15 points in the stress regime.
- Cross-validation and asymptotic calibration both pick a radius that is too small to help, because neither can see a regime that is not in the data. The radius is a judgement about drift, and the worst-case value and the worst-case distribution are the tools for making that judgement visible.

The code for the experiment, including the figures, runs in under two minutes on a laptop CPU with Optora 0.1.0.

<div class="bibliography-data" style="display:none;">
@article{michaud_1989,
  author    = {Michaud, Richard O.},
  title     = {The Markowitz Optimization Enigma: Is `Optimized' Optimal?},
  journal   = {Financial Analysts Journal},
  volume    = {45},
  number    = {1},
  pages     = {31--42},
  year      = {1989},
  doi       = {10.2469/faj.v45.n1.31}
}
@article{demiguel_2009,
  author    = {DeMiguel, Victor and Garlappi, Lorenzo and Uppal, Raman},
  title     = {Optimal Versus Naive Diversification: How Inefficient is the 1/N Portfolio Strategy?},
  journal   = {Review of Financial Studies},
  volume    = {22},
  number    = {5},
  pages     = {1915--1953},
  year      = {2009},
  doi       = {10.1093/rfs/hhm075}
}
@article{esfahani_kuhn_2018,
  author    = {Mohajerin Esfahani, Peyman and Kuhn, Daniel},
  title     = {Data-driven Distributionally Robust Optimization Using the Wasserstein Metric: Performance Guarantees and Tractable Reformulations},
  journal   = {Mathematical Programming},
  volume    = {171},
  pages     = {115--166},
  year      = {2018},
  doi       = {10.1007/s10107-017-1172-1}
}
@article{blanchet_chen_zhou_2022,
  author    = {Blanchet, Jose and Chen, Lin and Zhou, Xun Yu},
  title     = {Distributionally Robust Mean-Variance Portfolio Selection with Wasserstein Distances},
  journal   = {Management Science},
  volume    = {68},
  number    = {9},
  pages     = {6382--6410},
  year      = {2022},
  doi       = {10.1287/mnsc.2021.4155}
}
@article{rahimian_mehrotra_2022,
  author    = {Rahimian, Hamed and Mehrotra, Sanjay},
  title     = {Frameworks and Results in Distributionally Robust Optimization},
  journal   = {Open Journal of Mathematical Optimization},
  volume    = {3},
  pages     = {1--85},
  year      = {2022},
  doi       = {10.5802/ojmo.15}
}
@misc{optora_2026,
  author    = {Sharifi, Navid},
  title     = {Optora: A PyTorch-native Library for Distributionally Robust Optimization},
  year      = {2026},
  howpublished = {https://github.com/navidsharifi/optora},
  note      = {Version 0.1.0. Documentation at https://navidsharifi.github.io/optora/}
}
</div>
