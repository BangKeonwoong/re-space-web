---
name: Figma to Code Interpretation
description: Methodology for converting Figma designs, image references, or loose layout descriptions into clean, maintainable code.
---

# Figma / Design to Code Workflow

Use this skill when the user provides a design reference (image, Figma link, description) and wants it implemented in code.

## 1. Analysis Phase & Breakdown
Before coding, analyze the visual hierarchy:
-   **Layout Structure**: Identify the main grid/flex containers (Header, Hero, Features, Footer).
-   **Component Identifiction**: Spot reusable patterns (Buttons, Cards, Input fields).
-   **Style Extraction**: Estimate fonts, colors, border-radius, and shadows if not explicitly provided.

## 2. Implementation Strategy
1.  **Scaffold**: Build the HTML structure first using semantic tags (`<header>`, `<section>`, `<article>`).
2.  **Variables**: Define the extracted colors and fonts in CSS variables.
3.  **Layout**: Apply global layout styles (Container width, centering).
4.  **Components**: Build individual components in isolation or within the flow.
5.  **Refinement**: precise padding, margins, and "pixel-perfect" adjustments.

## 3. Responsive Adaptation
-   Always assume **Mobile-First** or ensure layouts break down gracefully on smaller screens.
-   Use `media queries` for font-size adjustments and layout shifts (row -> column).

## 4. Verification
-   Compare the result with the reference.
-   Check alignment and spacing.
