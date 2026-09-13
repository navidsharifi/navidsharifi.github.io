---
layout: post
title: "Optora: A GPU-First PyTorch Library for Distributionally Robust Optimization"
author: Navid Sharifi
permalink: /optora/
categories: [optimization, machine learning, pytorch]
tags: [distributionally-robust-optimization, pytorch, optimization, ambiguity-sets, python-library]
comments: false
date: 2026-04-01
excerpt: Optora is a GPU-first PyTorch library for distributionally robust optimization -- ambiguity sets, divergences, and minimax solvers behind one small, composable API.
---

## Foreword
<b><a target="_blank" href="https://github.com/navidsharifi/optora">Optora</a></b> is a pre-alpha optimization library built around a small, GPU-first PyTorch core for distributionally robust optimization (DRO), designed to grow toward stochastic methods, differentiable backends, optimal transport, and reinforcement learning under model uncertainty.

<div>
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/navidsharifi/optora?style=social">
<img alt="PyPI - Downloads" src="https://img.shields.io/pypi/dm/optora">
<img src="https://img.shields.io/pypi/v/optora.svg" alt="latest release" />
<img alt="license" src="https://img.shields.io/pypi/l/optora.svg">
</div>

## Introduction
If you minimize the average loss over your training data (empirical risk minimization), you're implicitly trusting that your training data is a faithful picture of the distribution you actually care about. That assumption is often shaky -- you might have too few samples, the world might have shifted since you collected the data, or someone might be actively trying to fool your model.

Distributionally robust optimization's answer to this is refreshingly blunt: instead of optimizing against your best guess at the distribution, optimize against the *worst* distribution within some plausible neighbourhood of it.

$$\min_{x} \; \sup_{q \, \in \, \text{ambiguity\_set}(\text{nominal},\, \text{radius})} \; \mathbb{E}_q[\ell(x, \xi)]$$

That neighbourhood -- the **ambiguity set** -- is defined by capping some statistical divergence $$D$$ between a candidate distribution $$q$$ and a nominal (reference) distribution at a radius you choose:

$$\text{ambiguity\_set}(\text{nominal}, \text{radius}) = \{\, q : D(q \,\Vert\, \text{nominal}) \le \text{radius} \,\}$$

Optora's whole architecture is basically this formula, typed out as code: a `Divergence` is $$D$$, an `AmbiguitySet` bundles a `Divergence` with a `nominal` distribution and a `radius`, and a `Solver` does the actual numerical work of finding the worst case (or, one level up, solving the full minimax problem over both the decision and the distribution).

## Why Optora

- **Robust by construction** -- optimize against the worst case over an ambiguity set instead of trusting a single empirical distribution.
- **Five ambiguity sets** -- Kullback-Leibler, $$\phi$$-divergence, $$\chi^2$$, total variation, and Wasserstein, all behind one `AmbiguitySet` contract.
- **GPU-first** -- vectorized PyTorch throughout, with tensor state that moves to an accelerator through a single `.to(device)` call.
- **Verified numerics** -- every formulation is checked against closed forms, independent grid searches, and convergence limits under mypy's strict mode.

## Core Abstractions

| Component | Module | Role |
|---|---|---|
| `Divergence` | `optora.core.divergence_base` | Callable `forward(p, q) -> Tensor` computing a nonnegative discrepancy between two distributions, zero exactly when `p == q`. |
| `AmbiguitySet` | `optora.core.dro_base` | Holds a nominal distribution, a `Divergence`, and a radius; requires `worst_case_expectation(loss) -> Tensor` from subclasses. |
| `Solver[ProblemT, ResultT]` | `optora.core.solver_base` | Generic numerical method with a single `solve(problem) -> result` method, so each algorithm defines its own problem/result dataclasses instead of a one-size-fits-all signature. |

## Formulations Implemented Today
Every ambiguity set below reduces its inner `sup` over candidate distributions $$q$$ to a tractable convex dual or an exact closed form, so none of them needs to search over the full space of candidate distributions directly.

### `KLAmbiguitySet`
The KL-ball. The inner supremum has a classic one-dimensional convex dual (Hu and Hong, 2013; Ben-Tal et al., 2013):

$$\sup_{q:\, D_{KL}(q \Vert \text{nominal}) \le \text{radius}} \mathbb{E}_q[\text{loss}] = \inf_{\eta > 0} \; \eta \cdot \text{radius} + \eta \log \mathbb{E}_{\text{nominal}}\!\left[\exp\!\left(\frac{\text{loss}}{\eta}\right)\right]$$

Solved over `log(eta)` rather than `eta` itself, so the unconstrained `GradientDescent` solver can't wander into `eta <= 0`. `radius == 0` returns `E_nominal[loss]` exactly, skipping the numerical solve.

```python
import torch
from optora.core.dro_base import KLAmbiguitySet  # see the API reference for the exact import path

nominal = torch.full((1000,), 1.0 / 1000)  # empirical reference distribution
ambiguity_set = KLAmbiguitySet(nominal=nominal, radius=0.05)

loss = torch.randn(1000)  # per-scenario loss values
worst_case = ambiguity_set.worst_case_expectation(loss)
```

### `PhiAmbiguitySet`, `ChiSquareAmbiguitySet`, `TotalVariationAmbiguitySet`
The general $$\phi$$-divergence-ball case, plus two named instances. `PhiAmbiguitySet` generalizes the KL-DRO dual above to any $$\phi$$-divergence (Ben-Tal et al., 2013; Duchi, Glynn, and Namkoong, 2021; Duchi and Namkoong, 2021), at the cost of a second dual variable `lam`:

$$\sup_{q:\, D_{\phi}(q \Vert \text{nominal}) \le \text{radius}} \mathbb{E}_q[\text{loss}] = \inf_{\eta > 0,\, \lambda} \; \lambda + \eta \cdot \text{radius} + \eta \, \mathbb{E}_{\text{nominal}}\!\left[\phi^{*}\!\left(\frac{\text{loss} - \lambda}{\eta}\right)\right]$$

where $$\phi^{*}$$ is $$\phi$$'s convex conjugate. `ChiSquareAmbiguitySet` plugs in the closed-form chi-square conjugate, smooth everywhere. Total variation's conjugate is not smooth everywhere (it has a hard boundary), so `TotalVariationAmbiguitySet` skips the dual entirely and computes the worst case directly from a closed-form combinatorial solution: sort the scenarios by loss and shift probability mass, from the cheapest ones, onto the single worst-case scenario until the total-variation budget is used up.

### `WassersteinAmbiguitySet`
The Wasserstein-ball case, for candidates sharing the nominal distribution's support with a given pairwise ground cost. This also reduces to a clean one-dimensional dual (Mohajerin Esfahani and Kuhn, 2018; Blanchet and Murthy, 2019; Gao and Kleywegt, 2022):

$$\sup_{q:\, W_c(q, \text{nominal}) \le \text{radius}} \mathbb{E}_q[\text{loss}] = \inf_{\gamma \ge 0} \; \gamma \cdot \text{radius} + \mathbb{E}_{\text{nominal}}\!\left[\max_j \big(\text{loss}_j - \gamma \cdot \text{cost}(\cdot, j)\big)\right]$$

`gamma`'s optimum can sit exactly at the boundary `gamma = 0` (once the radius is generous enough to move all the mass to the worst scenario), so this one is reparameterized with a `clamp` instead of an exponential. It uses a `SinkhornDivergence` internally only as an approximate `contains(...)` membership check; the worst-case expectation itself is solved exactly, not through the entropic approximation.

### `MinimaxSolver`
Wires any of the ambiguity sets above together with an outer solver (`GradientDescent` by default) to solve the full DRO problem, decision variable and all:

$$\min_{x} \; \sup_{q:\, \text{divergence}(q, \text{nominal}) \le \text{radius}} \; \mathbb{E}_q[\text{loss\_fn}(x)]$$

Every ambiguity set above already turns the inner "sup over q" into something differentiable in `x` (a dual objective, or an exact closed form), so `MinimaxSolver` only has to minimize `x -> ambiguity_set.worst_case_expectation(loss_fn(x))` -- an ordinary scalar objective. Gradients still flow correctly through `x` even though each ambiguity set solves its own dual variable "under the hood," which follows from the envelope theorem.

```python
from optora.solvers import GradientDescent, MinimaxSolver  # see the API reference for the exact import path

solver = MinimaxSolver(
    ambiguity_set=ambiguity_set,
    outer_solver=GradientDescent(),
)
result = solver.solve(problem)
```

Every piece above is covered by pytest tests checked against known closed-form results, independent grid-search cross-checks, convergence limits, and monotonicity properties, and the whole package is type-checked under mypy's strict mode.

## Design Principles

- **Small, component-oriented public API.** No package-level workflow dispatchers (`minimize(...)`, `train(...)`) that hide the method being studied; researchers instantiate the exact algorithm they want.
- **Mathematical objects separated from numerical solvers.** A divergence, an ambiguity set, and a solver are independent, individually reusable components.
- **Every extension point is subclassable.** `Divergence`, `AmbiguitySet`, and `Solver` are ABCs, not a closed enumeration -- Optora ships reference implementations, not the full space of methods.
- **PyTorch-native and accelerator-friendly.** Tensor dtype and device are preserved throughout; the numerical core avoids unnecessary host synchronizations and scalar round-trips so it stays friendly to future GPU-heavy and batched workloads.
- **Tested against known mathematics.** Every solver and divergence is checked against closed-form solutions, convergence limits, or established monotonicity properties, not only smoke tests.

## Complete API Summary

| Category | Components | Purpose |
|---|---|---|
| Core | `Divergence`, `AmbiguitySet`, `Solver` | Base abstractions for divergences, ambiguity sets, and numerical solvers |
| Ambiguity sets (dual) | `KLAmbiguitySet`, `PhiAmbiguitySet`, `ChiSquareAmbiguitySet` | Convex-dual worst-case expectation |
| Ambiguity sets (closed form) | `TotalVariationAmbiguitySet`, `WassersteinAmbiguitySet` | Exact combinatorial / one-dimensional dual solutions |
| Solvers | `GradientDescent`, `MinimaxSolver` | Outer optimization and full minimax decision + distribution solve |
| Divergences | KL, $$\phi$$-divergence, $$\chi^2$$, total variation, Sinkhorn (membership check) | Discrepancy measures underlying each ambiguity set |

## Roadmap and Future Horizon
Optora's scope is deliberately narrow: ambiguity sets, divergences, and the minimax solve that connects them. That core is complete end to end. What's next is a set of extensions that only make sense once they're actually needed, not day-one scope:

- A dedicated risk-functional layer, once more than one risk measure (CVaR, entropic risk, and so on) needs to sit on top of the worst-case objective.
- Jointly-learned, differentiable ambiguity sets, once the current static ones (fixed `nominal`, fixed `radius`) feel limiting.
- Causality-constrained DRO for sequential decision problems.
- Further out: stochastic and differentiable-backend solvers, optimal transport as a first-class object, and reinforcement learning under model uncertainty.

## Getting Started
Install Optora with pip:

```bash
pip install optora
```

For local development, install the project in editable mode with the developer and documentation extras:

```bash
pip install -e ".[dev,docs]"
```

Explore the documentation and further reading at the following links.

- 📖 [Documentation](https://navidsharifi.github.io/optora/)
- 🧮 [Mathematical formulations](https://navidsharifi.github.io/optora/formulations/)
- 💻 [Examples](https://navidsharifi.github.io/optora/examples/)
- 🔬 [API reference](https://navidsharifi.github.io/optora/api/)

## Citation
If Optora contributes to your work, please cite the repository.

Optora is open source under the MIT License. Contributions are welcome!

[GitHub](https://github.com/navidsharifi/optora) &middot; [Documentation](https://navidsharifi.github.io/optora/) &middot; [PyPI](https://pypi.org/project/optora/)

## References
Sharifi, N. (2026). *Optora: A PyTorch Library for Distributionally Robust Optimization*. [https://github.com/navidsharifi/optora](https://github.com/navidsharifi/optora)

## Keywords
Distributionally-Robust-Optimization, Ambiguity-Sets, Wasserstein, KL-Divergence, PyTorch, Optimization
