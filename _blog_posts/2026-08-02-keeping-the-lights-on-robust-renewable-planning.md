---
layout: post
title: "Keeping the Lights On: Distributionally Robust Planning for Renewable Energy"
author: Navid Sharifi
date: 2026-08-02
image: images/optora-energy-cover.svg
featured: true
hidden: false
comments: true
anim: true
categories: Distributionally-Robust-Optimisation Energy-Systems Stochastic-Programming Optora
excerpt: "A grid with a lot of wind and solar has to schedule firm capacity a day ahead against a net load it cannot forecast well. This post schedules that capacity on a year of scenarios, robustifies the decision with KL, Wasserstein and CVaR ambiguity sets, and then tests every schedule in a low-wind, high-demand year it never saw."
---

## A Decision Made Before the Weather Is Known

A system operator has to commit firm generation a day ahead. Firm capacity is gas turbines, hydro, interconnector imports or a battery fleet: anything that can be called on to produce when asked. The quantity it must cover is the net load, which is demand minus wind minus solar. Demand is fairly predictable. Wind and solar are not. The further a grid moves toward renewables, the more the day-ahead decision looks like a bet on the weather.

The bet has an asymmetric payoff. Committing a megawatt that turns out to be unnecessary costs its commitment price. Failing to commit a megawatt that turns out to be necessary costs the value of lost load, which regulators put at ten to a hundred times the commitment price. This is a newsvendor problem in each hour, and the sample-average answer is the critical fractile of the net-load distribution <cite data-key="scarf_1958"></cite>. The trouble is that the distribution is estimated from one or a few years of history. Zhao and Guan made this point for unit commitment with wind and proposed a data-driven robust formulation <cite data-key="zhao_guan_2016"></cite>, and Duan and colleagues extended it with adjustable decisions <cite data-key="duan_2018"></cite>. The general theory of ambiguity sets they build on is laid out by Wiesemann, Kuhn and Sim <cite data-key="wiesemann_kuhn_sim_2014"></cite> and, for divergence balls, by Ben-Tal and colleagues <cite data-key="ben_tal_2013"></cite>.

This post builds the simplest version of that problem that still has the right shape, solves it with Optora <cite data-key="optora_2026"></cite> under four ambiguity sets, and then does what a planner cannot do in practice: it runs every schedule through a bad year and counts the lights that went out.

## The Model

Let $x \in \mathbb{R}^{24}_{+}$ be the firm capacity scheduled in each hour of the day, in megawatts. A scenario $\xi \in \mathbb{R}^{24}$ is one day of hourly net load. The daily cost is

<div class="academic-equation" id="eq-cost">

$$\ell(x, \xi) \;=\; \sum_{t=1}^{24} \Big[ c\, x_t \;+\; p\, (\xi_t - x_t)^{+} \Big]$$

</div>

with commitment cost $c$ of 45 pounds per megawatt-hour and a shortfall penalty $p$ of 450 pounds per megawatt-hour of unserved energy. The ratio gives a critical fractile of $p / (p + c) = 0.909$. The sample-average approximation (SAA) solves $\min_x \mathbb{E}_{\hat P_N}[\ell(x, \xi)]$ over the $N$ observed days <cite data-key="shapiro_2009"></cite>, and its solution is the hourly 90.9 percent quantile of net load. The distributionally robust version replaces the expectation by its supremum over a ball:

<div class="academic-equation" id="eq-dro">

$$\min_{x \ge 0} \; \sup_{Q \in \mathcal{B}_\rho(\hat P_N)} \; \mathbb{E}_Q\!\left[\ell(x, \xi)\right]$$

</div>

I compare three balls, each of which asks a different question about how the next year might differ from the last one.

- **Kullback-Leibler (KL).** Distributions whose KL divergence from $\hat P_N$ is at most $\rho$. The adversary reweights observed days. A day can be made more likely, but no new day can be invented.
- **Wasserstein.** Distributions within transport distance $\rho$ of $\hat P_N$, with ground cost equal to the root-mean-square hourly difference in megawatts between two days. The adversary pays per megawatt it moves. The radius has the units of the problem.
- **Conditional value at risk (CVaR).** Distributions whose likelihood ratio to $\hat P_N$ is at most $1/\alpha$. The worst case is the mean of the worst $\alpha$ fraction of days <cite data-key="rockafellar_uryasev_2000"></cite>. This is the risk measure operators already use, viewed as a DRO problem.

## Data

The training year is 365 synthetic days with a realistic structure. Demand has a morning and an evening peak around a base of 1,500 megawatts, with day-level and hour-level noise. Wind has 900 megawatts of capacity, a daily capacity factor drawn from a Beta distribution with mean 0.41, and an autocorrelated hourly deviation. Solar has 400 megawatts of capacity, a bell-shaped daily profile and a cloud factor. The mean daily peak of demand is 1,938 megawatts and the mean daily peak of net load is 1,580 megawatts.

The stress year changes three things at once, in the way that a cold, still winter does. The wind capacity factor falls to 0.30, a drop of 27 percent. The cloud factor is heavier, which cuts solar by a quarter. Demand rises by 4 percent overall and by a further 160 megawatts at the evening peak. The mean daily peak of net load rises to 1,914 megawatts. Nothing in the training year says that such a year is possible.

<figure class="academic-figure" id="fig-schedules">
<img src="{{ '/images/optora-energy-schedules.svg' | relative_url }}" alt="Hourly net-load quantile bands for the training year with the SAA, KL and Wasserstein schedules overlaid, plus the stress-year 95 percent quantile" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Hourly net load in the training year, shown as the 5 to 95 percent and 25 to 75 percent bands with the median, and the 95 percent quantile of the stress year. The black line is the sample-average schedule, which is the hourly critical fractile. The green and purple lines are the KL schedule at radius 0.2 and the Wasserstein schedule at radius 30 megawatts. The robust schedules sit above the sample-average one everywhere, and the margin is widest where the net-load band is widest."></figcaption>
</figure>

<a href="#fig-schedules" class="ref"></a> shows the training-year net load as quantile bands over the day. The band is widest in the early morning, when wind matters most and there is no solar, and at the evening peak. The dotted red line is the 95 percent quantile of the stress year. It sits above the entire training band at the evening peak, which is the whole problem in one picture.

## Solving It With Optora

The decision is a 24-vector, the scenarios are 365 days, and the three ambiguity sets expose the same `worst_case_expectation` method. I solve several radii at once by passing a tensor radius, and I scale the cost to thousands of pounds for numerical comfort.

```python
import torch
from optora import KLAmbiguitySet, WassersteinAmbiguitySet, CVaRAmbiguitySet
from optora.dro.calibration import kl_radius

N, T = net_train.shape                                  # 365 days x 24 hours
nominal = torch.full((N,), 1.0 / N, dtype=torch.float64)
cost = torch.cdist(net_train, net_train) / T ** 0.5     # RMS hourly MW difference

def daily_cost(x, net):                                  # x: (k, 24), net: (N, 24)
    short = torch.relu(net[None] - x[:, None])
    return (45.0 * x).sum(-1)[:, None] + 450.0 * short.sum(-1)

sets = {
    "kl":   KLAmbiguitySet(nominal, radius=torch.tensor([kl_radius(N, 0.95), 0.05, 0.2, 0.5])),
    "wass": WassersteinAmbiguitySet(nominal, cost=cost, radius=torch.tensor([10.0, 30.0, 100.0])),
    "cvar": CVaRAmbiguitySet(nominal, alpha=torch.tensor([0.20, 0.10, 0.05])),
}

def schedule(ball, k, steps=5000):
    x = net_train.quantile(0.5, dim=0).expand(k, T).clone().requires_grad_(True)
    opt = torch.optim.Adam([x], lr=4.0)
    for _ in range(steps):
        opt.zero_grad()
        ball.worst_case_expectation(daily_cost(x, net_train) / 1000).sum().backward()
        opt.step()
        with torch.no_grad():
            x.clamp_(min=0.0)
    return x.detach()
```

The SAA solution is the same code with a KL radius of zero. As a check, its objective agrees with the closed-form critical-fractile schedule to within 0.05 percent. The hourly values differ by up to 25 megawatts, because the sample-average objective is piecewise linear and flat between neighbouring order statistics, so any point in that interval is optimal.

## Results in the Training Year and in the Stress Year

<div class="academic-table" id="tab-results" data-caption="Performance of each schedule over 3,000 simulated days of the normal year and of the stress year. Cost is mean daily cost in thousands of pounds. Unserved is mean unserved energy in megawatt-hours per day. LOLP is the fraction of hours with a shortfall. P95 is the 95th percentile of daily cost. The KL radius 0.0053 is the 95 percent calibrated value from kl_radius for 365 days." markdown="1">

| Schedule | Committed MWh/day | Normal: cost | Normal: unserved | Normal: LOLP | Normal: P95 | Stress: cost | Stress: unserved | Stress: LOLP | Stress: P95 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| SAA (critical fractile) | 34,993 | 1,702 | 282 | 0.124 | 2,333 | 2,188 | 1,363 | 0.378 | 3,860 |
| KL ρ = 0.0053 | 35,596 | 1,699 | 215 | 0.102 | 2,202 | 2,113 | 1,135 | 0.339 | 3,637 |
| KL ρ = 0.05 | 36,677 | 1,707 | 126 | 0.068 | 1,996 | 2,009 | 797 | 0.271 | 3,267 |
| KL ρ = 0.2 | 38,421 | 1,752 | 51 | 0.033 | 1,854 | 1,927 | 441 | 0.175 | 2,772 |
| KL ρ = 0.5 | 39,685 | 1,795 | 21 | 0.016 | 1,821 | 1,899 | 252 | 0.115 | 2,463 |
| Wasserstein ρ = 10 MW | 35,841 | 1,700 | 194 | 0.094 | 2,152 | 2,089 | 1,057 | 0.323 | 3,566 |
| Wasserstein ρ = 30 MW | 38,203 | 1,751 | 70 | 0.040 | 1,896 | 1,947 | 507 | 0.190 | 2,859 |
| Wasserstein ρ = 100 MW | 40,457 | 1,826 | 12 | 0.009 | 1,827 | 1,904 | 185 | 0.088 | 2,347 |
| CVaR α = 0.20 | 38,356 | 1,747 | 46 | 0.031 | 1,827 | 1,917 | 425 | 0.176 | 2,751 |
| CVaR α = 0.10 | 39,625 | 1,792 | 19 | 0.015 | 1,807 | 1,895 | 248 | 0.114 | 2,458 |
| CVaR α = 0.05 | 40,395 | 1,822 | 10 | 0.009 | 1,821 | 1,894 | 169 | 0.086 | 2,312 |

</div>

Start with the SAA row of <a href="#tab-results" class="ref"></a>. In the normal year it is the cheapest schedule on average, as it must be, since it was optimised for that distribution. It also leaves 282 megawatt-hours a day unserved and has a shortfall in 12 percent of hours. That is what a critical fractile of 0.909 buys: about one hour in eleven is short, by design. In the stress year the same schedule is short in 38 percent of hours and the mean daily cost rises by 29 percent.

Now read down the KL column. The calibrated radius of 0.0053 is the one a statistician would choose. It is interesting for a reason that has nothing to do with the stress year: it lowers the normal-year cost. The sample-average schedule has 24 free parameters and 365 days, and it has overfitted the sample quantiles a little. A small KL ball acts as a shrinkage toward a smoother schedule and costs nothing. At radius 0.2 the schedule commits 10 percent more energy, costs 3 percent more in the normal year, and in the stress year costs 12 percent less than SAA while cutting unserved energy by two thirds. At radius 0.5 the normal-year premium is 5.5 percent and the stress-year saving is 13 percent, with unserved energy down by more than 80 percent.

The Wasserstein and CVaR schedules trace the same frontier. A Wasserstein radius of 30 megawatts lands almost exactly on the KL schedule at radius 0.2, and a CVaR level of 0.10 lands on the KL schedule at radius 0.5. This is not a coincidence. For a loss that is monotone in net load, every one of these adversaries does the same thing: it moves probability toward the days with the highest net load, and the schedule rises to meet them. The geometries differ in how they price that move, but on this problem the price schedules are close enough that the frontiers overlap.

<figure class="academic-figure" id="fig-frontier">
<img src="{{ '/images/optora-energy-frontier.svg' | relative_url }}" alt="Mean daily cost against unserved energy in the stress year for all schedules" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Mean daily cost against unserved energy in the stress year. The sample-average schedule is the isolated point at the top right. Every robust schedule, whichever ambiguity set produced it, lies on one curve that runs down and to the left. In the stress year robustness reduces both cost and shortfall at the same time, because the shortfall penalty dominates."></figcaption>
</figure>

<a href="#fig-frontier" class="ref"></a> is the stress-year picture. Each point is a schedule, placed by its mean cost and its unserved energy. There is no trade-off in this year. Every robust schedule is both cheaper and more reliable than SAA, and the three ambiguity sets lie on a single curve. The trade-off exists only in the normal year, and <a href="#fig-costs" class="ref"></a> shows its size.

<figure class="academic-figure" id="fig-costs">
<img src="{{ '/images/optora-energy-costs.svg' | relative_url }}" alt="Paired bars of normal-year and stress-year mean daily cost for six schedules" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Mean daily cost in the normal year and in the stress year for six schedules. The robust schedules pay a premium of 0 to 5.5 percent in the normal year and save 10 to 13 percent in the stress year. The calibrated KL schedule pays no premium at all."></figcaption>
</figure>

## What the Adversary Is Worried About

<figure class="academic-figure" id="fig-interactive">
<div class="dro-anim" data-anim="energy" data-src="{{ '/assets/data/dro-energy.json' | relative_url }}" data-title="Interactive: sweep the KL radius">
<noscript>Enable JavaScript to see the interactive figure.</noscript>
</div>
<figcaption data-caption="Interactive view of the KL-robust schedules. The slider moves the radius from 0 to 0.5 through 21 trained schedules. Left: the training-year net-load bands with the stress-year 95 percent quantile, the current schedule in green, and the training days that the adversary upweights drawn in red with opacity proportional to their worst-case weight. Right: the 365 training days placed by wind capacity factor and peak net load, sized and coloured by worst-case weight. The readout gives the committed energy and the normal-year and stress-year outcomes of the current schedule."></figcaption>
</figure>

Before the static picture, <a href="#fig-interactive" class="ref"></a> lets you move the radius and watch the schedule rise as the adversary singles out the still, high-demand days.

The worst-case distribution is a diagnostic as much as a device. For the KL ball, Optora returns it as the gradient of the worst-case value with respect to the loss vector, and it is a set of weights on the 365 training days. <a href="#fig-adversary" class="ref"></a> plots each day by its mean wind capacity factor and its peak net load, with the worst-case weight as colour and size.

<figure class="academic-figure" id="fig-adversary">
<img src="{{ '/images/optora-energy-adversary.svg' | relative_url }}" alt="Scatter of training days by wind capacity factor and peak net load, coloured by worst-case weight" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="The worst-case distribution of the KL ball at radius 0.2 over the training days. Each day is placed by its mean wind capacity factor and its peak net load. Colour and size give the worst-case weight relative to the nominal weight of 1 in 365. The adversary concentrates on the still, high-demand days in the top-left corner and gives up to three times their nominal weight to about a dozen of them."></figcaption>
</figure>

The adversary has, on its own, identified the dozen stillest high-demand days of the year and tripled their weight. In a real planning setting this is a list that can be handed to an engineer. It says which days the schedule is being hardened against, and it says which days the ball considers irrelevant, which is every windy day. A KL radius of 0.2 is hard to explain to a board. A list of twelve days is not.

There is a further use of this picture. The stress year differs from the training year by a lower wind capacity factor and a higher evening peak. The adversary's chosen days are exactly the training days that look most like stress-year days. The ball cannot invent a bad year, but it can find the bad days in a normal year and plan for a world in which they are common. That is why schedules robustified on a normal year transfer to a bad one.

## Limitations

The model is a sequence of independent daily newsvendors. Real unit commitment has ramping, minimum up and down times, start-up costs and storage, all of which couple hours and days. The scenarios are synthetic, so the result that the three ambiguity sets trace one frontier may not hold for a loss that is not monotone in net load, or for data with regime structure. The stress year was designed by me, and I know how severe it is. A planner does not. The honest reading of <a href="#tab-results" class="ref"></a> is not "radius 0.2 is right" but "the premium for a given radius is small and known, and the payoff is large and unknown". That is the usual shape of insurance.

## Takeaways

- Sample-average scheduling against a year of net-load data leaves one hour in eleven short by construction, and one hour in three short in a year with 27 percent less wind.
- A KL ball at the statistically calibrated radius costs nothing in the normal year, because it undoes mild overfitting of the sample quantiles, and already cuts stress-year shortfall by a sixth.
- Larger balls buy stress-year cost reductions of 10 to 13 percent and shortfall reductions of 60 to 85 percent for normal-year premiums of 3 to 5.5 percent. KL, Wasserstein and CVaR sets trace the same frontier on this problem.
- The worst-case distribution is a list of days. It makes the ambiguity set legible to the people who have to approve the schedule.

The full experiment runs in about three minutes on a laptop CPU with Optora 0.1.0.

<div class="bibliography-data" style="display:none;">
@incollection{scarf_1958,
  author    = {Scarf, Herbert},
  title     = {A Min-Max Solution of an Inventory Problem},
  booktitle = {Studies in the Mathematical Theory of Inventory and Production},
  editor    = {Arrow, Kenneth J. and Karlin, Samuel and Scarf, Herbert},
  publisher = {Stanford University Press},
  pages     = {201--209},
  year      = {1958}
}
@article{zhao_guan_2016,
  author    = {Zhao, Chaoyue and Guan, Yongpei},
  title     = {Data-Driven Stochastic Unit Commitment for Integrating Wind Generation},
  journal   = {IEEE Transactions on Power Systems},
  volume    = {31},
  number    = {4},
  pages     = {2587--2596},
  year      = {2016},
  doi       = {10.1109/TPWRS.2015.2477311}
}
@article{duan_2018,
  author    = {Duan, Chao and Jiang, Lin and Fang, Wanliang and Liu, Jun},
  title     = {Data-Driven Affinely Adjustable Distributionally Robust Unit Commitment},
  journal   = {IEEE Transactions on Power Systems},
  volume    = {33},
  number    = {2},
  pages     = {1385--1398},
  year      = {2018},
  doi       = {10.1109/TPWRS.2017.2741506}
}
@article{wiesemann_kuhn_sim_2014,
  author    = {Wiesemann, Wolfram and Kuhn, Daniel and Sim, Melvyn},
  title     = {Distributionally Robust Convex Optimization},
  journal   = {Operations Research},
  volume    = {62},
  number    = {6},
  pages     = {1358--1376},
  year      = {2014},
  doi       = {10.1287/opre.2014.1314}
}
@article{ben_tal_2013,
  author    = {Ben-Tal, Aharon and den Hertog, Dick and De Waegenaere, Anja and Melenberg, Bertrand and Rennen, Gijs},
  title     = {Robust Solutions of Optimization Problems Affected by Uncertain Probabilities},
  journal   = {Management Science},
  volume    = {59},
  number    = {2},
  pages     = {341--357},
  year      = {2013},
  doi       = {10.1287/mnsc.1120.1641}
}
@article{rockafellar_uryasev_2000,
  author    = {Rockafellar, R. Tyrrell and Uryasev, Stanislav},
  title     = {Optimization of Conditional Value-at-Risk},
  journal   = {Journal of Risk},
  volume    = {2},
  number    = {3},
  pages     = {21--41},
  year      = {2000},
  doi       = {10.21314/JOR.2000.038}
}
@book{shapiro_2009,
  author    = {Shapiro, Alexander and Dentcheva, Darinka and Ruszczy{\'n}ski, Andrzej},
  title     = {Lectures on Stochastic Programming: Modeling and Theory},
  publisher = {SIAM},
  year      = {2009},
  doi       = {10.1137/1.9780898718751}
}
@misc{optora_2026,
  author    = {Sharifi, Navid},
  title     = {Optora: A PyTorch-native Library for Distributionally Robust Optimization},
  year      = {2026},
  howpublished = {https://github.com/navidsharifi/optora},
  note      = {Version 0.1.0. Documentation at https://navidsharifi.github.io/optora/}
}
</div>
