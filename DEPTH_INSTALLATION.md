# Refrigerator installation-depth verification

Updated: 2026-08-28

## Completion status

The production diagnosis catalog now contains manufacturer-verified depth evidence for all **152 / 152** loaded refrigerator models.

- Manufacturer-verified installation depth: **123 / 152**
- Manufacturer-verified body depth only: **29 / 152**
- Depth unknown: **0 / 152**

Body-depth-only models are intentionally treated as a caution state. They are not declared installation-safe solely from cabinet depth; final clearance remains a store/manufacturer-spec check.

## Manufacturer coverage

- AQUA: 27 / 27 depth verified; 27 / 27 installation depth verified.
- HITACHI: 21 / 21 body depth verified; 3 / 21 installation depth verified.
- MITSUBISHI ELECTRIC: 27 / 27 depth verified; 16 / 27 installation depth verified.
- Panasonic: current loaded models covered through official specification pages in `catalog-depth-verified.js`.
- SHARP: current loaded models covered through official specification pages in `catalog-depth-verified.js`.
- TOSHIBA: 32 / 32 installation depth verified, including the two retained retail sell-through models.

## Implementation

Depth metadata is layered after the production catalog files and before diagnosis logic:

- `catalog-depth-verified.js`
- `catalog-depth-toshiba.js`
- `catalog-depth-hitachi.js`
- `catalog-depth-aqua.js`
- `catalog-depth-mitsubishi-completion.js`
- `v810-depth.js`

Every verified item retains `depthVerifiedAt` and `depthSource` manufacturer evidence.

## CI contract

`test-depth-complete.mjs` loads the full 152-model production catalog plus all depth modules and fails if:

- any production model has neither `depth` nor `installDepth`;
- verified depth lacks a manufacturer source;
- verified depth lacks a verification date;
- the catalog count changes unexpectedly;
- Mitsubishi completion coverage drops below 27 / 27;
- key Mitsubishi installation-depth values regress.

Current completion regression result:

`Depth catalog completion: PASS (verified 152/152, install 123, body-only 29; Mitsubishi 27/27)`

## Safety behavior

When `installDepth` is available, the diagnosis may use it as an installation hard condition against the user's maximum depth. When only body depth is available, the product stays eligible but the UI must show that installation clearance still requires confirmation. Unknown depth must never be guessed.
