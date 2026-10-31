---
layout: post
title: "Wasserstein Robustness Is Secretly Regularisation: A Hands-On Proof"
author: Navid Sharifi
date: 2026-05-15
image: images/optora-lipschitz-cover.svg
featured: true
hidden: false
comments: true
categories: Distributionally-Robust-Optimisation Optimal-Transport Machine-Learning Optora
excerpt: "The worst-case loss over a Wasserstein ball equals the empirical loss plus the radius times a Lipschitz constant, at least for small radii. This post measures exactly when that identity holds, when it bends, and when it breaks, using a fixed loss and a trained regression model."
---

## A Claim Worth Checking

The most repeated sentence about Wasserstein distributionally robust optimisation (DRO) is that it is regularisation in disguise. Robustify an expected loss over a type-1 Wasserstein ball of radius $\rho$ and, the claim goes, you get the empirical loss plus $\rho$ times the Lipschitz constant of the loss. Shafieezadeh-Abadeh, Kuhn and Mohajerin Esfahani proved this for a wide class of learning problems and called it regularisation via mass transportation <cite data-key="shafieezadeh_2019"></cite>. Gao, Chen and Kleywegt sharpened it to a statement about variation regularisation that holds to first order in the radius <cite data-key="gao_chen_kleywegt_2024"></cite>. Blanchet, Kang and Murthy used the same structure to calibrate the radius by a limit theorem <cite data-key="blanchet_kang_murthy_2019"></cite>. Chen and Paschalidis showed the identity is exact for absolute-loss regression <cite data-key="chen_paschalidis_2018"></cite>.

The claim is true, but it hides three regimes. For a small radius the identity is exact or nearly so. For a moderate radius the true worst case is concave in the radius and the linear surrogate overstates it. For a large radius on a finite sample the ball saturates, and the surrogate keeps growing while the exact worst case cannot. None of this is news to the authors above. What is rare is a measurement that shows all three regimes on one axis. That is what this post provides, using Optora <cite data-key="optora_2026"></cite>, which solves the exact worst case over a finite-support Wasserstein ball, so there is a ground truth to compare against.

## The Identity and Why It Holds

Take a loss $\ell$ on a sample space with metric $c$, an empirical distribution $\hat P_N$ on $N$ points, and the ball of distributions within Wasserstein distance $\rho$ of $\hat P_N$. The Kantorovich-Rubinstein duality says that for any two distributions $Q$ and $P$ <cite data-key="villani_2009"></cite>

<div class="academic-equation" id="eq-kr">

$$\mathbb{E}_Q[\ell] - \mathbb{E}_P[\ell] \;\le\; \mathrm{Lip}(\ell)\, W_c(Q, P)$$

</div>

where $\mathrm{Lip}(\ell)$ is the Lipschitz constant of $\ell$ with respect to $c$. Taking the supremum over the ball gives the upper bound

<div class="academic-equation" id="eq-surrogate">

$$\sup_{Q :\, W_c(Q, \hat P_N) \le \rho} \mathbb{E}_Q[\ell] \;\le\; \mathbb{E}_{\hat P_N}[\ell] + \rho \,\mathrm{Lip}(\ell)$$

</div>

The bound is attained when the adversary can move mass along the steepest direction of $\ell$ for as far as the budget allows. On a continuous support with a loss whose gradient norm is constant, such as an absolute or hinge loss, that is always possible and the identity is exact. On a finite support the adversary can only move mass between the $N$ observed points. The exact worst case over such a ball is the solution of a small linear programme, and its dual is <cite data-key="esfahani_kuhn_2018"></cite>

<div class="academic-equation" id="eq-dual">

$$\inf_{\gamma \ge 0} \; \gamma \rho + \sum_{i=1}^{N} \hat p_i \max_{j} \left[ \ell_j - \gamma\, c_{ij} \right]$$

</div>

For a small enough radius the minimiser is $\gamma = L_N$, the Lipschitz constant of $\ell$ restricted to the sample, $L_N = \max_{i \ne j} \lvert \ell_i - \ell_j \rvert / c_{ij}$. The dual value is then exactly $\mathbb{E}_{\hat P_N}[\ell] + \rho L_N$. So on a finite sample the surrogate in <a href="#eq-surrogate" class="eqref"></a> is right in form and wrong in constant, by the amount $\mathrm{Lip}(\ell) - L_N$. As the sample grows, $L_N \to \mathrm{Lip}(\ell)$ and the deficiency vanishes. This is the first regime.

Optora's `WassersteinAmbiguitySet` solves <a href="#eq-dual" class="eqref"></a> by bisection on $\gamma$. Every number below labelled "exact" comes from that solve.

## Part One: A Fixed Loss

I use the construction from Optora's own example on this topic. The support is a deterministic discretisation of the standard normal at midpoint quantiles, so refining the sample means increasing $n$ rather than drawing new points. The ground metric is the Euclidean distance between support points. The loss is the softplus function $\ell(z) = \log(1 + e^{z})$, whose derivative is the logistic function. Its Lipschitz constant is exactly 1, but 1 is only approached as $z \to \infty$, so the sample constant $L_n$ is strictly below 1 for every finite $n$. That makes the deficiency $1 - L_n$ a clean target.

```python
import torch
from optora import WassersteinAmbiguitySet

def discretised_normal(n):
    quantiles = (torch.arange(n, dtype=torch.float64) + 0.5) / n
    z = torch.special.ndtri(quantiles)                # midpoint quantiles of N(0, 1)
    loss = torch.nn.functional.softplus(z)             # Lipschitz constant exactly 1
    cost = (z[:, None] - z[None, :]).abs()            # Euclidean ground metric
    nominal = torch.full((n,), 1.0 / n, dtype=torch.float64)
    return nominal, loss, cost

radii = torch.logspace(-4, 0.5, 14, dtype=torch.float64)
nominal, loss, cost = discretised_normal(64)
ball = WassersteinAmbiguitySet(nominal=nominal, cost=cost, radius=radii)
exact = ball.worst_case_expectation(loss.expand(len(radii), 64))   # one batched solve
surrogate = (nominal * loss).sum() + radii * 1.0
normalised_gap = (surrogate - exact) / radii
```

<figure class="academic-figure" id="fig-gap">
<img src="{{ '/images/optora-lipschitz-gap.svg' | relative_url }}" alt="Left: normalised gap between surrogate and exact worst case against the radius for three sample sizes. Right: exact worst case and two surrogates against the radius for n equals 64." style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Left: the normalised gap between the Lipschitz surrogate and the exact worst case, (surrogate minus exact) divided by the radius, for three sample sizes. The dotted lines are the predicted small-radius limits 1 minus L_n. Right: for n equals 64, the exact worst case against the population surrogate and the sample surrogate. The three curves coincide up to a radius of about 0.1 and separate beyond it. The exact curve flattens at the largest loss on the support."></figcaption>
</figure>

The left panel of <a href="#fig-gap" class="ref"></a> shows the normalised gap, (surrogate minus exact) divided by $\rho$. Dividing by the radius removes the trivial part of the story, since any gap shrinks with $\rho$. What remains is the deficiency. For $n = 16$ the gap flattens at 0.1705 and the predicted value $1 - L_{16}$ is 0.1705. For $n = 64$ both are 0.1001. For $n = 256$ both are 0.0631. The agreement is to four decimal places, which is as good as the bisection tolerance. The identity in the first regime is exact, with the sample constant in place of the population one.

<div class="academic-table" id="tab-deficiency" data-caption="Measured normalised gap at radius 0.001 against the predicted deficiency 1 minus L_n, as the discretisation refines." markdown="1">

| n | 8 | 16 | 32 | 64 | 128 | 256 | 512 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Measured gap / ρ | 0.2312 | 0.1705 | 0.1292 | 0.1001 | 0.0789 | 0.0631 | 0.0526 |
| Predicted 1 − L_n | 0.2312 | 0.1705 | 0.1292 | 0.1001 | 0.0789 | 0.0631 | 0.0511 |

</div>

<a href="#tab-deficiency" class="ref"></a> refines the sample at a fixed radius of 0.001. The deficiency falls as the sample grows, roughly like the spacing of the largest support points, and the measurement tracks the prediction exactly until $n = 512$. There the measured gap exceeds the prediction by 0.0015. This is the second regime arriving early. With 512 points the spacing near the centre is about 0.0025, so a radius of 0.001 is already large enough for the adversary to move mass across more than one neighbour, and the exact worst case becomes concave in $\rho$. The lesson is that "small radius" means small relative to the spacing of the support, not small in absolute terms.

The right panel shows the three curves for $n = 64$ on the scale of the loss itself. They are indistinguishable up to $\rho \approx 0.1$. Beyond that the exact worst case bends away and flattens at 2.50, which is the softplus of the largest support point. This is the third regime. The adversary has moved all the mass it can to the worst point, and no budget can push the expectation higher. The surrogate has no such ceiling. At $\rho = 3.16$ the population surrogate reports a worst case of 3.97, which no distribution on the support can achieve.

<figure class="academic-figure" id="fig-transport">
<img src="{{ '/images/optora-lipschitz-transport.svg' | relative_url }}" alt="Worst-case weight relative to nominal at each support point for three radii" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="The worst-case distribution for n equals 64, shown as the ratio of worst-case weight to nominal weight at each support point. At radius 0.01 the adversary moves a little mass from the second-largest point to the largest one. At radius 0.1 it drains the upper part of the support into the largest point. At radius 0.5 it empties every point above about 0.4 and the largest point carries 23 times its nominal weight."></figcaption>
</figure>

<a href="#fig-transport" class="ref"></a> makes the mechanism visible. The gradient of the worst-case value with respect to the loss vector is the worst-case distribution, so a single backward pass through `worst_case_expectation` returns it. At a small radius the adversary moves mass only between the two largest support points, because that is where the loss rises fastest per unit of distance. As the radius grows it drains successively more of the right tail into the single largest point. Mass to the left of zero, where the loss is flat, is never touched. This is the picture behind the word "Lipschitz": the adversary pays per unit of transport and is paid per unit of loss increase, so it moves mass where the ratio of the two is highest.

## Part Two: A Trained Model

The fixed-loss experiment holds the loss still. The claim that matters for learning is about the model that minimises the robust objective. I therefore train an absolute-loss linear regression three ways and compare the fitted models.

The data are 200 points with $x \in \mathbb{R}^2$ standard normal, $y = x^\top (1, -0.5) + 0.3\,\varepsilon$ with Laplace noise, and the uncertain object is the pair $\xi = (x, y) \in \mathbb{R}^3$ with Euclidean ground metric. The loss of a model $(w, b)$ at a point is $\lvert y - w^\top x - b \rvert$. Its gradient in $\xi$ is $\pm(-w, 1)$, so its Lipschitz constant is $\lVert (w, -1) \rVert_2$ and the population identity is exact: Wasserstein DRO of absolute-loss regression equals mean absolute error plus $\rho \lVert (w, -1) \rVert_2$ <cite data-key="chen_paschalidis_2018"></cite>. The three objectives are

- **Exact.** The worst case over Optora's finite-support ball, solved exactly at every gradient step.
- **Sample surrogate.** Empirical mean absolute error plus $\rho\, L_N(w)$, with $L_N(w)$ the Lipschitz constant of the loss across the 200 observed pairs. This is what <a href="#eq-dual" class="eqref"></a> reduces to at a small radius.
- **Population surrogate.** Empirical mean absolute error plus $\rho \lVert (w, -1) \rVert_2$. This is the regulariser from the literature.

Each is minimised with Adam for twelve radii from 0.001 to 2 in a single batched run, and the fitted models are compared by their norm, their out-of-sample error on 20,000 fresh points, and their exact robust value.

<figure class="academic-figure" id="fig-regression">
<img src="{{ '/images/optora-lipschitz-regression.svg' | relative_url }}" alt="Left: norm of the fitted model against the radius for the three objectives. Right: test mean absolute error against the radius." style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Models trained with the exact robust objective, the sample surrogate and the population surrogate. Left: the norm of the fitted (w, minus 1) against the radius. The three paths coincide up to a radius of about 0.06. The two surrogates keep shrinking the model, and the exact objective stops. Right: out-of-sample mean absolute error. Up to a radius of 0.25 all three are within 0.006 of each other. At a radius of 2 the surrogates have shrunk the model so far that their test error is double that of the exact solution."></figcaption>
</figure>

<a href="#fig-regression" class="ref"></a> is the regularisation claim as a measurement. For $\rho \le 0.06$ the three objectives produce the same model, to three decimal places in the norm and four in the test error. The robust problem and the penalised problem have the same minimiser, as the theory promises. The fitted norm sits at 1.467 against the true value of 1.5, a small shrinkage that comes from the finite sample, not from the radius.

From $\rho \approx 0.1$ the paths separate. The two surrogates behave like any norm penalty and keep shrinking the model. At $\rho = 2$ the population surrogate has pulled the norm to 1.08 and the test error up to 0.63, three times the error at small radii. The exact objective barely moves. Its norm at $\rho = 2$ is 1.37 and its test error 0.30. The reason is the saturation seen in the fixed-loss study. On 200 points the exact worst case is bounded by the largest loss on the sample, so increasing the radius beyond the point where the adversary has already concentrated on the worst observations does nothing. The surrogate does not know this and continues to charge $\rho$ per unit of norm forever.

<figure class="academic-figure" id="fig-values">
<img src="{{ '/images/optora-lipschitz-values.svg' | relative_url }}" alt="Exact robust value of each trained model against the radius" style="max-width: 100%; display: block; margin: 0 auto;">
<figcaption data-caption="Each trained model scored by the exact robust objective at its own radius. Up to a radius of 0.25 the three models are within 0.004 of each other in robust value, so the surrogates are near-optimal for the exact problem. Beyond that the surrogate models are far from robust-optimal, because they have been shrunk by a penalty that the exact ball no longer charges."></figcaption>
</figure>

<a href="#fig-values" class="ref"></a> scores every trained model by the exact robust objective, which is the only fair judge. Up to $\rho = 0.25$ the models from the two surrogates are within 0.004 of the exact optimum in robust value. In that range the surrogate is not an approximation but a free lunch: it is a convex penalised problem with the same solution as the robust one. Beyond $\rho = 0.5$ the surrogate models are not robust-optimal at all. At $\rho = 2$ their exact robust values are 1.52 and 1.69 against 0.88 for the exact solution.

One more number is worth recording. The sample Lipschitz constant $L_N(w)$ of the fitted models is 1.463 against the population value $\lVert (w, -1) \rVert_2 = 1.467$. For this loss the two nearly coincide, because the gradient of the absolute loss is the same vector at every point with the same residual sign, so some pair of observed points is almost aligned with it. This is why the sample surrogate and the population surrogate are nearly identical throughout. For the softplus loss in Part One the deficiency was ten times larger. The gap between the two constants depends on how often the loss attains its steepest slope, not on the sample size alone.

## What to Take From This

- **Small radius.** Wasserstein DRO is exactly empirical risk plus $\rho$ times a Lipschitz constant. On a finite sample the constant is the sample one, $L_N$, which is below the population one by an amount that shrinks with the sample. The fitted models coincide.
- **Moderate radius.** The exact worst case is concave in $\rho$ and the linear surrogate overstates it. The models still nearly coincide, and the surrogate remains near-optimal for the exact problem.
- **Large radius.** On a finite support the exact worst case saturates at the largest loss in the sample. The surrogate does not. Models trained on the surrogate are over-shrunk and are no longer solutions of the robust problem.

The practical rule is simple. If the radius is small relative to the spacing of the data, use the penalised form. It is convex, cheap, and exact. If the radius is comparable to that spacing, solve the exact ball, or better, ask whether such a radius is a sensible description of the uncertainty at all. A ball that has drained the sample into its worst point is not expressing doubt about the data. It is expressing certainty that the worst observation is the only one that counts.

Recent work on generalisation through Wasserstein DRO, such as Wu, Li and Mao <cite data-key="wu_li_mao_2025"></cite>, studies exactly the boundary between these regimes, and the calibration results of Blanchet, Kang and Murthy <cite data-key="blanchet_kang_murthy_2019"></cite> give radii that scale like $n^{-1/2}$, which keeps a learner inside the first regime by design. Gao and Kleywegt's general treatment of Wasserstein DRO covers the finite-support dual used here <cite data-key="gao_kleywegt_2023"></cite>.

All experiments run in about a minute on a CPU with Optora 0.1.0 and PyTorch, in double precision, with no other dependency.

<div class="bibliography-data" style="display:none;">
@article{shafieezadeh_2019,
  author    = {Shafieezadeh-Abadeh, Soroosh and Kuhn, Daniel and Mohajerin Esfahani, Peyman},
  title     = {Regularization via Mass Transportation},
  journal   = {Journal of Machine Learning Research},
  volume    = {20},
  number    = {103},
  pages     = {1--68},
  year      = {2019}
}
@article{gao_chen_kleywegt_2024,
  author    = {Gao, Rui and Chen, Xi and Kleywegt, Anton J.},
  title     = {Wasserstein Distributionally Robust Optimization and Variation Regularization},
  journal   = {Operations Research},
  volume    = {72},
  number    = {3},
  pages     = {1177--1191},
  year      = {2024},
  doi       = {10.1287/opre.2022.2383}
}
@article{blanchet_kang_murthy_2019,
  author    = {Blanchet, Jose and Kang, Yang and Murthy, Karthyek},
  title     = {Robust Wasserstein Profile Inference and Applications to Machine Learning},
  journal   = {Journal of Applied Probability},
  volume    = {56},
  number    = {3},
  pages     = {830--857},
  year      = {2019},
  doi       = {10.1017/jpr.2019.49}
}
@article{chen_paschalidis_2018,
  author    = {Chen, Ruidi and Paschalidis, Ioannis Ch.},
  title     = {A Robust Learning Approach for Regression Models Based on Distributionally Robust Optimization},
  journal   = {Journal of Machine Learning Research},
  volume    = {19},
  number    = {13},
  pages     = {1--48},
  year      = {2018}
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
@article{gao_kleywegt_2023,
  author    = {Gao, Rui and Kleywegt, Anton J.},
  title     = {Distributionally Robust Stochastic Optimization with Wasserstein Distance},
  journal   = {Mathematics of Operations Research},
  volume    = {48},
  number    = {2},
  pages     = {603--655},
  year      = {2023},
  doi       = {10.1287/moor.2022.1275}
}
@article{wu_li_mao_2025,
  author    = {Wu, Qinyu and Li, Jonathan Yu-Meng and Mao, Tiantian},
  title     = {On Generalization and Regularization via Wasserstein Distributionally Robust Optimization},
  journal   = {Management Science},
  year      = {2025},
  note      = {Preprint: arXiv:2212.05716}
}
@book{villani_2009,
  author    = {Villani, C{\'e}dric},
  title     = {Optimal Transport: Old and New},
  publisher = {Springer},
  year      = {2009},
  doi       = {10.1007/978-3-540-71050-9}
}
@misc{optora_2026,
  author    = {Sharifi, Navid},
  title     = {Optora: A PyTorch-native Library for Distributionally Robust Optimization},
  year      = {2026},
  howpublished = {https://github.com/navidsharifi/optora},
  note      = {Version 0.1.0. Documentation at https://navidsharifi.github.io/optora/}
}
</div>
