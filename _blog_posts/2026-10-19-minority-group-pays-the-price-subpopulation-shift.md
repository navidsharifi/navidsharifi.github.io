---
layout: post
title: "When the Minority Group Pays the Price: Robust Regression Under Subpopulation Shift"
author: Navid Sharifi
date: 2026-10-19
image: assets/images/blog/minority-group-pays-the-price-subpopulation-shift/cover.svg
featured: true
hidden: false
comments: true
anim: true
categories: Distributionally-Robust-Optimisation Machine-Learning Fairness Optora
excerpt: "A model trained on a population that is 90 percent one group and 10 percent another will serve the majority well and the minority badly. This post trains a regression on a Kullback-Leibler ball instead of the empirical distribution, measures exactly when the robust model wins as the minority share grows, and shows what the adversary does and does not find."
---

## The Average Hides the Minority

Empirical risk minimisation (ERM) minimises the average loss over the training set. If the training set is 90 percent group A and 10 percent group B, then the average is 90 percent about A. A model that serves A perfectly and B poorly can have a lower average loss than one that serves both moderately well. ERM will choose the first. This is not a bug in the optimiser. It is what the average asks for.

The problem surfaces whenever the population at deployment has a different mix of groups than the population at training. Hashimoto, Srivastava, Namkoong and Liang called this fairness without demographics and showed that ERM can make the minority worse year after year as its members leave a service that does not work for them <cite data-key="hashimoto_2018"></cite>. Sagawa, Koh, Hashimoto and Liang made group distributionally robust optimisation (DRO) a standard tool for the case where group labels are available at training time <cite data-key="sagawa_2020"></cite>. Duchi and Namkoong gave the theory for the harder case where they are not: a DRO problem over a divergence ball around the empirical distribution is a uniform guarantee over every subpopulation of sufficient size <cite data-key="duchi_namkoong_2021"></cite>. The WILDS benchmark collected real datasets in which exactly this kind of shift occurs <cite data-key="koh_2021"></cite>. Hu, Niu, Sato and Sugiyama warned that DRO can also simply chase noise <cite data-key="hu_2018"></cite>.

This post takes the Duchi and Namkoong setting, where group labels are unavailable, and asks a precise question. If I train a regression on a Kullback-Leibler (KL) ball around the empirical distribution, at what minority share does it start to beat ERM, by how much, and what does the adversary inside the ball actually do? The setting follows the subpopulation-shift example in the Optora documentation <cite data-key="optora_2026"></cite>, with my own implementation and extra diagnostics.

## A Setting Where Everything Can Be Computed Exactly

The inputs are $x \sim \mathcal{N}(0, I_2)$ in both groups, so the group cannot be read from $x$. The groups differ in the conditional law of the label, $y = a_g^\top x + 0.3\,\varepsilon$, with slope $a_A = (1, 0)$ for the majority and $a_B = (1, 1.5)$ for the minority. The training set has 400 points, 360 from A and 40 from B. The model is linear with an intercept, $\hat y = w^\top x + b$, and it is well specified for the training mixture. Nothing is misspecified. What changes at test time is the share $\pi$ of group B.

Because $x$ has the same distribution in both groups, the squared-error risk of a model on group $g$ is available in closed form,

<div class="academic-equation" id="eq-risk">

$$R_g(w, b) \;=\; \lVert w - a_g \rVert_2^2 + b^2 + \sigma^2$$

</div>

and the test risk at minority share $\pi$ is the straight line $R(\pi) = (1 - \pi) R_A + \pi R_B$. The slope of that line, $R_B - R_A$, is how fast a model degrades as the population moves toward the minority. No Monte Carlo is needed for evaluation, which removes one source of noise from the comparison.

The robust objective is the worst-case expected loss over a KL ball of radius $\rho$ around the uniform distribution on the 400 training points:

<div class="academic-equation" id="eq-kl-dro">

$$\min_{w, b} \; \sup_{q :\, D_{\mathrm{KL}}(q \,\|\, \hat p) \le \rho} \; \sum_{i=1}^{400} q_i \left( y_i - w^\top x_i - b \right)^2$$

</div>

The adversary reweights individual training points. It never sees the group labels. It can raise the weight on group B only by raising the weight on points with large loss, and only if those points happen to be in group B. The ball of radius $\rho$ allows the minority mass to rise from 0.10 to at most $m(\rho)$, where $m$ solves the binary divergence equation $m \log(m / 0.1) + (1 - m) \log((1 - m) / 0.9) = \rho$. For $\rho$ of 0.05, 0.2 and 0.5 that bound is 0.207, 0.332 and 0.495. These radii were fixed before any test result was examined.

Two controls make the comparison fair. A ridge model, ERM plus $0.3 \lVert w \rVert_2^2$, checks that DRO is doing more than shrinking the weights. A second scenario in which the minority has the same slope as the majority but three times its noise standard deviation checks what DRO does when there is no shift to find.

## Training With Optora

The code is ordinary PyTorch with one call replaced. Instead of averaging the per-point losses, I hand them to a `KLAmbiguitySet` and ask for the worst-case expectation. The inner problem is solved exactly by bisection at every step, so the outer gradient carries no inner-solver bias. Ten independent training sets are trained at once by batching.

```python
import torch
from optora import KLAmbiguitySet

S, N = 10, 400                                        # seeds, training points
nominal = torch.full((N,), 1.0 / N, dtype=torch.float64)

def fit(x, y, radius, ridge=0.0, steps=400):
    ball = KLAmbiguitySet(nominal=nominal, radius=radius)   # radius 0.0 is ERM
    w = torch.zeros(S, 2, dtype=torch.float64, requires_grad=True)
    b = torch.zeros(S, dtype=torch.float64, requires_grad=True)
    opt = torch.optim.Adam([w, b], lr=0.1)
    for _ in range(steps):
        opt.zero_grad()
        residual = y - torch.einsum("snd,sd->sn", x, w) - b[:, None]
        objective = ball.worst_case_expectation(residual ** 2).sum() + ridge * (w ** 2).sum()
        objective.backward()
        opt.step()
    return w.detach(), b.detach()
```

After training, one more backward pass through `worst_case_expectation` with the loss vector marked as requiring gradients returns the worst-case distribution $q^{\star}$, since by Danskin's theorem the gradient of the worst-case value with respect to the loss is the maximising distribution. That is how the minority mass and the per-point weights below were obtained.

## When Does the Robust Model Win?

<figure class="academic-figure" id="fig-risk-curve">
<img src="{{ '/assets/images/blog/minority-group-pays-the-price-subpopulation-shift/risk-curve.svg' | relative_url }}" alt="Test risk against the minority share for ERM, ridge and three KL radii, with crossing points marked" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Exact test risk as a function of the share of the minority group in the test population, averaged over ten training sets, with one standard deviation shaded. ERM is best at the training share of 0.1 and degrades fastest. The robust models start higher and degrade more slowly. Dots mark the crossing points, where each robust model overtakes ERM. Ridge is worse than ERM everywhere."></figcaption>
</figure>

<a href="#fig-risk-curve" class="ref"></a> is the main result. Every curve is a straight line because of <a href="#eq-risk" class="eqref"></a>. ERM starts lowest, at a risk of 0.294 when the test population matches the training share of 0.1, and rises fastest. The three robust models start higher and rise more slowly. The crossing point $\pi^{\star}$, where the robust model overtakes ERM, is at 0.166, 0.206 and 0.230 for radii of 0.05, 0.2 and 0.5. Across the ten training sets the standard deviation of $\pi^{\star}$ is about 0.02.

<div class="academic-table" id="tab-risk" data-caption="Exact group risks and test risks at three minority shares, averaged over ten training sets. The irreducible noise contributes 0.09 to every risk. The last column is the minority mass that the worst-case distribution placed on group B at the end of training, against the maximum the ball allows." markdown="1">

| Model | R_A | R_B | Risk at π = 0.1 | Risk at π = 0.5 | Risk at π = 0.9 | Crossing π* | Minority mass used / allowed |
|---|---:|---:|---:|---:|---:|---:|---:|
| ERM | 0.110 | 1.959 | 0.294 | 1.034 | 1.774 | | 0.100 / 0.100 |
| Ridge (0.3) | 0.151 | 2.114 | 0.348 | 1.132 | 1.917 | never | 0.100 / 0.100 |
| KL ρ = 0.05 | 0.203 | 1.482 | 0.331 | 0.842 | 1.354 | 0.166 | 0.154 / 0.207 |
| KL ρ = 0.2 | 0.296 | 1.235 | 0.390 | 0.765 | 1.141 | 0.206 | 0.205 / 0.332 |
| KL ρ = 0.5 | 0.355 | 1.120 | 0.431 | 0.737 | 1.043 | 0.230 | 0.262 / 0.495 |

</div>

The numbers in <a href="#tab-risk" class="ref"></a> show the size of the trade. At the training share, radius 0.2 costs 0.10 of risk, a third more than ERM. At a test share of 0.5 it saves 0.27, a quarter of ERM's risk. At a share of 0.9 it saves 0.63. The majority-group risk roughly triples from 0.110 to 0.296, and the minority-group risk falls by more than a third from 1.959 to 1.235. Whether that trade is worth making depends entirely on how likely a shift past $\pi^{\star} \approx 0.2$ is. The experiment cannot answer that. It can only say precisely what is being traded.

The ridge control is worse than ERM at every share. Shrinkage pulls the slope toward zero, which is away from both $a_A$ and $a_B$, so it hurts both groups. Whatever DRO is doing, it is not shrinkage.

## Along the Trade-Off, Not Off It

<figure class="academic-figure" id="fig-tradeoff">
<img src="{{ '/assets/images/blog/minority-group-pays-the-price-subpopulation-shift/tradeoff.svg' | relative_url }}" alt="Majority-group risk against minority-group risk for each model, with the population-optimal path" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Risk on the majority group against risk on the minority group. Small points are individual training sets and large points are means. The dashed curve is the path of population-optimal models for every minority share, obtained by setting the slope to the mixture of the two group slopes. The robust models move along this path as the radius grows. Ridge moves off it, to a point that is worse on both groups."></figcaption>
</figure>

The population-optimal model for a test share $\pi$ has slope $w^{\star}(\pi) = (1 - \pi) a_A + \pi a_B$, a straight path in weight space between the two group slopes. <a href="#fig-tradeoff" class="ref"></a> draws the risks of that path as a curve in the plane of $(R_A, R_B)$. The three robust models sit on it. Each radius corresponds to a point further along, which is to say to a model that is optimal for some larger minority share. The ridge model sits above the curve, worse on both groups. This is the strongest evidence that sample-level DRO is doing the right kind of thing. Without ever seeing a group label, it has found models that lie on the frontier a label-aware oracle would trace.

## What the Adversary Finds

<figure class="academic-figure" id="fig-interactive">
<div class="dro-anim" data-anim="subpop" data-src="{{ '/assets/data/blog/minority-group-pays-the-price-subpopulation-shift/subpopulation.json' | relative_url }}" data-title="Interactive: sweep the KL radius">
<noscript>Enable JavaScript to see the interactive figure.</noscript>
</div>
<figcaption data-caption="Interactive view of one training set as the KL radius moves from 0 to 0.5 through 21 trained models. Left: the 400 training points, with the minority group in red, plotted by the feature on which the groups differ against the label with the shared feature removed. Each point is sized by its worst-case weight. The green line is the fitted slope on that feature and the dashed line is the ERM fit. Right: the exact test-risk line of the current model against the fixed ERM line, with the crossing point marked. The readout gives the group risks, the minority mass used by the adversary and the crossing share."></figcaption>
</figure>

<a href="#fig-interactive" class="ref"></a> shows the whole mechanism in motion. As the radius grows the minority points swell, the fitted slope rotates toward the minority, and the risk line tilts so that it crosses ERM at a smaller share.

<figure class="academic-figure" id="fig-weights">
<img src="{{ '/assets/images/blog/minority-group-pays-the-price-subpopulation-shift/weights.svg' | relative_url }}" alt="Left: histogram of worst-case weights for majority and minority points. Right: minority mass used by the adversary against the maximum the ball allows." style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Left: the worst-case weight of each training point relative to its nominal weight, for one training set at radius 0.2. Most majority points are weighted near or below 1, and the minority points carry weights up to 16. Right: the probability mass that the worst-case distribution places on the minority group, against the maximum the ball permits, for each radius. The adversary uses about half of its allowance."></figcaption>
</figure>

The left panel of <a href="#fig-weights" class="ref"></a> shows the adversary's weights on one training set. Group A points cluster at or just below their nominal weight. Group B points spread out to the right, with a few carrying ten to sixteen times their nominal weight. The adversary has found the minority. It found it by loss alone, because the ERM-like fit serves A well and B badly, and the ball lets it emphasise the badly served points.

The right panel shows the limit of this. At radius 0.2 the ball permits a minority mass of 0.332. The adversary uses 0.205. At radius 0.5 it permits 0.495 and uses 0.262. The gap is the cost of not having labels. Some minority points happen to have small residuals, and the adversary has no reason to upweight them. Some majority points happen to have large residuals, because of noise, and the adversary upweights those instead. Sample-level DRO is label-free but partial. It is not the oracle, and <a href="#tab-risk" class="ref"></a> should be read with that in mind.

## The Negative Control: DRO Chases Difficulty, Not Shift

<figure class="academic-figure" id="fig-control">
<img src="{{ '/assets/images/blog/minority-group-pays-the-price-subpopulation-shift/control.svg' | relative_url }}" alt="Difference in test risk from ERM against the minority share, when the minority differs only in noise" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="The same pipeline when the minority has the majority's slope and three times its noise. Each curve is the test risk of a model minus the test risk of ERM, as a function of the minority share. Every curve is flat and positive. The robust models are worse than ERM by a constant 0.004, 0.016 and 0.037, at every share, and ridge is worse by 0.052."></figcaption>
</figure>

In the second scenario the minority differs from the majority only in noise. The correct model is the same for both groups, so ERM is optimal at every share and nothing can beat it. <a href="#fig-control" class="ref"></a> shows what DRO does anyway. The adversary still finds the noisy points and still upweights them. In fact it places more mass on the minority than in the shift scenario: 0.224 at radius 0.2 against 0.205. The models it produces are worse than ERM by a constant amount at every share, 0.016 at radius 0.2. This is the warning from Hu and colleagues made concrete <cite data-key="hu_2018"></cite>. Divergence-ball DRO upweights whatever is hard. It cannot tell a hard point that signals a shifted subpopulation from a hard point that is merely noisy. When the shift is real, as in the first scenario, that is what you want. When it is not, you pay a tax for nothing.

## Takeaways

- With a 10 percent minority that has a different conditional law, ERM is optimal at the training share and degrades at a rate of 1.85 risk units per unit of minority share. KL-DRO at radius 0.2 degrades at 0.94, half as fast, and overtakes ERM once the minority share passes 0.21.
- The robust models lie on the same trade-off curve as label-aware population-optimal models. Ridge regression does not. DRO is not shrinkage.
- The adversary finds the minority through its losses alone, but uses only about half the minority mass that the ball allows, because losses are a noisy proxy for group membership.
- When the minority differs only in noise, the same adversary still upweights it and the robust model is worse than ERM everywhere. DRO buys insurance against subpopulation shift and charges a premium whether or not the shift arrives.

Choosing the radius therefore needs a view about which minority shares are plausible at deployment, and about whether the minority's difficulty reflects a different signal or just more noise. Group labels, where they exist, answer the second question and make group DRO the better tool <cite data-key="sagawa_2020"></cite>. Where they do not, the radius is the only lever, and this post has tried to show exactly what it moves.

The experiment trains fifty models in about twenty seconds on a CPU with Optora 0.1.0.

<div class="bibliography-data" style="display:none;">
@inproceedings{hashimoto_2018,
  author    = {Hashimoto, Tatsunori and Srivastava, Megha and Namkoong, Hongseok and Liang, Percy},
  title     = {Fairness Without Demographics in Repeated Loss Minimization},
  booktitle = {Proceedings of the 35th International Conference on Machine Learning (ICML)},
  year      = {2018},
  note      = {Preprint: arXiv:1806.08010}
}
@inproceedings{sagawa_2020,
  author    = {Sagawa, Shiori and Koh, Pang Wei and Hashimoto, Tatsunori B. and Liang, Percy},
  title     = {Distributionally Robust Neural Networks for Group Shifts: On the Importance of Regularization for Worst-Case Generalization},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2020},
  note      = {Preprint: arXiv:1911.08731}
}
@article{duchi_namkoong_2021,
  author    = {Duchi, John C. and Namkoong, Hongseok},
  title     = {Learning Models with Uniform Performance via Distributionally Robust Optimization},
  journal   = {The Annals of Statistics},
  volume    = {49},
  number    = {3},
  pages     = {1378--1406},
  year      = {2021},
  doi       = {10.1214/20-AOS2004}
}
@inproceedings{koh_2021,
  author    = {Koh, Pang Wei and Sagawa, Shiori and Marklund, Henrik and Xie, Sang Michael and Zhang, Marvin and Balsubramani, Akshay and Hu, Weihua and Yasunaga, Michihiro and Phillips, Richard Lanas and Gao, Irena and Lee, Tony and David, Etienne and Stavness, Ian and Guo, Wei and Earnshaw, Berton and Haque, Imran and Beery, Sara M. and Leskovec, Jure and Kundaje, Anshul and Pierson, Emma and Levine, Sergey and Finn, Chelsea and Liang, Percy},
  title     = {WILDS: A Benchmark of in-the-Wild Distribution Shifts},
  booktitle = {Proceedings of the 38th International Conference on Machine Learning (ICML)},
  year      = {2021},
  note      = {Preprint: arXiv:2012.07421}
}
@inproceedings{hu_2018,
  author    = {Hu, Weihua and Niu, Gang and Sato, Issei and Sugiyama, Masashi},
  title     = {Does Distributionally Robust Supervised Learning Give Robust Classifiers?},
  booktitle = {Proceedings of the 35th International Conference on Machine Learning (ICML)},
  year      = {2018},
  note      = {Preprint: arXiv:1611.02041}
}
@misc{optora_2026,
  author    = {Sharifi, Navid},
  title     = {Optora: A PyTorch-native Library for Distributionally Robust Optimization},
  year      = {2026},
  howpublished = {https://github.com/navidsharifi/optora},
  note      = {Version 0.1.0. Documentation at https://navidsharifi.github.io/optora/}
}
</div>
