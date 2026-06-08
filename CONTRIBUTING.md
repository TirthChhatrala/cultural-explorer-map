# Contributing to Cultural Explorer Map

> **Cultural Explorer Map** — An AI-powered platform for cultural discovery, travel planning, storytelling, and exploration across India's rich heritage.

Thank you for your interest in contributing. Cultural Explorer Map is more than a software project — it is a digital initiative to preserve, promote, and celebrate India's cultural diversity through interactive technology, intelligent travel experiences, educational content, and community-driven storytelling.

Every contribution, regardless of size, helps create a richer experience for explorers, students, travelers, researchers, and culture enthusiasts around the world.

---

## Table of Contents

1. [Our Mission](#1-our-mission)
2. [Before You Contribute](#2-before-you-contribute)
3. [Ways to Contribute](#3-ways-to-contribute)
4. [Development Setup](#4-development-setup)
5. [Development Principles](#5-development-principles)
6. [Commit Message Standards](#6-commit-message-standards)
7. [Pull Request Guidelines](#7-pull-request-guidelines)
8. [Reporting Issues](#8-reporting-issues)
9. [Suggesting New Features](#9-suggesting-new-features)
10. [Security Reporting](#10-security-reporting)
11. [High Priority Contribution Areas](#11-high-priority-contribution-areas)
12. [Recognition](#12-recognition)

---

## 1. Our Mission

Our mission is to make India's culture, heritage, traditions, festivals, destinations, and stories accessible through modern technology.

The platform aims to:

- Promote cultural awareness and education
- Encourage responsible tourism
- Preserve regional heritage digitally
- Support multilingual accessibility
- Deliver intelligent travel experiences powered by AI
- Build a global community of cultural explorers

Every contribution should support these goals.

---

## 2. Before You Contribute

Before starting work on any issue or feature, please take the following steps:

1. **Browse existing Issues and Discussions** — your idea or fix may already be in progress at [Issues](https://github.com/TirthChhatrala/cultural-explorer-map/issues) or [Discussions](https://github.com/TirthChhatrala/cultural-explorer-map/discussions).
2. **Check for duplicate work** — search open and closed PRs to avoid overlap.
3. **Open a discussion for major changes** — large features or architectural changes should be proposed and discussed before implementation begins.
4. **Confirm alignment with the project vision** — contributions should fit the platform's roadmap and cultural mission.
5. **Read the relevant documentation** — review this guide, [SECURITY.md](./SECURITY.md), and the [README](./README.md) before starting.

---

## 3. Ways to Contribute

### 🗺️ Platform Features

Enhance existing functionality or introduce meaningful new capabilities.

- Interactive Map Enhancements
- Cultural Discovery Features
- Travel Story Experiences
- AI-Powered Recommendations
- Smart Trip Planning Tools
- Destination Exploration Features
- Reward and Gamification Systems

---

### 🎨 User Experience & Accessibility

Help create an inclusive, intuitive, and high-performance experience.

- Responsive Design Improvements
- Accessibility Enhancements (WCAG compliance)
- Keyboard Navigation
- Screen Reader Support
- Performance Optimizations
- Mobile Experience Improvements

---

### 📝 Documentation

Improve the resources that help developers and contributors get started quickly.

- README Improvements
- API Documentation
- Setup and Development Guides
- Architecture Documentation
- Inline Code Comments

---

### 🌐 Localization & Internationalization

Support India's remarkable linguistic diversity.

- Translation Contributions
- Regional Content Improvements
- Language Accuracy Reviews
- Localization Testing

---

### 🏛️ Cultural Content

Contribute knowledge that enriches the platform's educational value.

- Festivals and Celebrations
- Historical Information
- State and Regional Profiles
- Heritage Sites
- Traditional Arts and Crafts
- Cultural Stories and Narratives
- Local Experiences and Hidden Gems

> **Important:** All cultural content must be accurate, respectful, and sourced from reliable references. See [Development Principles](#5-development-principles) for guidance.

---

## 4. Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- A GitHub account

### Step-by-Step Setup

**1. Fork the repository**

Click the **Fork** button at the top right of the [repository page](https://github.com/TirthChhatrala/cultural-explorer-map).

**2. Clone your fork**

```bash
git clone https://github.com/YOUR_USERNAME/cultural-explorer-map.git
cd cultural-explorer-map
```

**3. Add the upstream remote**

```bash
git remote add upstream https://github.com/TirthChhatrala/cultural-explorer-map.git
```

**4. Install dependencies**

```bash
npm install
```

**5. Start the development server**

```bash
npm run dev
```

**6. Create a production build (to verify before submitting a PR)**

```bash
npm run build
```

### Keeping Your Fork Up to Date

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## 5. Development Principles

All contributions are expected to follow these principles to maintain quality and consistency across the platform.

### Write Maintainable Code

Code should be readable, reusable, scalable, and well-organized. Avoid unnecessary complexity. If something needs a comment to explain why it exists, add one.

### Follow Existing Architecture

Before introducing new patterns or abstractions, understand the current architecture. Reuse existing utilities and shared components wherever possible. Consistency across the codebase is more valuable than personal preference.

### Prioritize User Experience

Every change should improve at least one of: performance, accessibility, reliability, responsiveness, or usability. User experience is a primary consideration, not an afterthought.

### Preserve Cultural Accuracy

When contributing cultural content or information:

- Verify facts from reliable, authoritative sources
- Avoid assumptions about regional customs or traditions
- Respect and represent India's diversity fairly
- Use culturally sensitive, inclusive language
- Cite sources where appropriate

---

## 6. Commit Message Standards

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Format

```
<type>: <short, imperative description>
```

### Types and Examples

| Type | Purpose | Example |
|---|---|---|
| `feat` | New feature | `feat: add travel stories management` |
| `fix` | Bug fix | `fix: resolve state page loading issue` |
| `docs` | Documentation only | `docs: improve contributor guidelines` |
| `refactor` | Code restructure (no behaviour change) | `refactor: simplify state data service` |
| `perf` | Performance improvement | `perf: optimize map rendering performance` |
| `style` | Formatting, whitespace (no logic change) | `style: format quiz component` |
| `test` | Adding or updating tests | `test: add unit tests for reward service` |
| `chore` | Build process, dependencies, tooling | `chore: update eslint configuration` |

### Tips

- Use the **imperative mood** — "add feature" not "added feature" or "adds feature"
- Keep the subject line under **72 characters**
- Reference related issues in the body: `Closes #42`

---

## 7. Pull Request Guidelines

All Pull Requests should be focused, well-tested, and clearly documented.

### Before Submitting

- [ ] The project builds successfully (`npm run build`)
- [ ] All affected functionality has been tested
- [ ] Unused code and debug statements have been removed
- [ ] Documentation has been updated where necessary
- [ ] Merge conflicts have been resolved
- [ ] Your changes do not break existing functionality
- [ ] The PR targets the correct base branch

### Writing a Good PR Description

Include the following in your PR description:

- **What** — a brief summary of what was changed and why
- **How** — a description of the approach taken
- **Testing** — how the changes were tested
- **Screenshots** — for any UI changes, before/after screenshots are highly encouraged
- **Related Issues** — link any issues this PR addresses (e.g., `Closes #42`)

### PR Size

Keep PRs focused and reasonably scoped. Large, sprawling PRs are harder to review and slower to merge. If your change is large, consider breaking it into smaller, logically independent PRs.

---

## 8. Reporting Issues

High-quality bug reports help maintainers resolve problems efficiently.

When opening an issue at [github.com/TirthChhatrala/cultural-explorer-map/issues](https://github.com/TirthChhatrala/cultural-explorer-map/issues), include:

| Field | Description |
|---|---|
| **Title** | A clear, specific summary of the problem |
| **Description** | What the issue is and why it's a problem |
| **Steps to Reproduce** | A numbered sequence of steps to trigger the issue |
| **Expected Behaviour** | What should happen |
| **Actual Behaviour** | What actually happens |
| **Screenshots / Logs** | Visual evidence or error output where applicable |
| **Environment** | Browser, OS, device type, and screen size |

Well-documented reports are faster to triage, investigate, and resolve.

---

## 9. Suggesting New Features

Feature proposals are welcome and encouraged. When proposing a new feature, please include:

- **Problem Statement** — what user need or gap does this address?
- **Proposed Solution** — a clear description of the feature
- **User Benefits** — who benefits and how?
- **Technical Considerations** — any known complexity, dependencies, or trade-offs
- **Mockups or References** — wireframes, screenshots, or links to similar implementations (optional but helpful)

For large features, open a [Discussion](https://github.com/TirthChhatrala/cultural-explorer-map/discussions) before investing significant time in implementation. This ensures alignment with the project roadmap and avoids wasted effort.

---

## 10. Security Reporting

**Security vulnerabilities must never be reported through public GitHub Issues.**

If you discover a security issue:

1. Contact the project maintainer **privately**
2. Include a clear description, reproduction steps, and impact assessment
3. Allow reasonable time for investigation and remediation before any public disclosure

For full details on the platform's security model, trust boundaries, and responsible disclosure process, please review [SECURITY.md](./SECURITY.md).

---

## 11. High Priority Contribution Areas

The project actively welcomes contributions in the following areas:

### 🗺️ Interactive Map Experience
Improve navigation, usability, performance, and cultural visualization on the core map interface.

### 🤖 AI-Powered Features
Enhance the Bharat Buddy assistant, recommendation systems, AI trip suggestions, and intelligent exploration tools.

### 📖 Travel Stories Ecosystem
Improve storytelling tools, publishing workflows, community engagement features, and moderation systems.

### 🌐 Multilingual Platform Support
Expand language coverage, improve translation quality, and enhance localization across all platform regions.

### ♿ Accessibility Improvements
Improve inclusivity for users with disabilities and ensure compliance with WCAG accessibility best practices.

### 🏛️ Cultural Knowledge Expansion
Expand state profiles, heritage site information, festival data, traditional arts, cuisine, and regional tourism content.

### ⚡ Performance & Scalability
Improve load times, reduce bundle sizes, optimize rendering, and ensure the platform scales gracefully.

---

## 12. Recognition

Every contribution — whether a one-line fix, a new feature, a documentation improvement, or a cultural content addition — contributes to a larger and meaningful mission.

By contributing to Cultural Explorer Map, you help build a platform that:

- Celebrates India's extraordinary cultural heritage
- Empowers cultural discovery for people around the world
- Supports responsible and informed tourism
- Connects communities through shared stories and experiences

**Thank you for being part of this journey.**

---

### Helpful Links

| Resource | Link |
|---|---|
| 🐛 Issues | [github.com/TirthChhatrala/cultural-explorer-map/issues](https://github.com/TirthChhatrala/cultural-explorer-map/issues) |
| 💬 Discussions | [github.com/TirthChhatrala/cultural-explorer-map/discussions](https://github.com/TirthChhatrala/cultural-explorer-map/discussions) |
| 🔀 Pull Requests | [github.com/TirthChhatrala/cultural-explorer-map/pulls](https://github.com/TirthChhatrala/cultural-explorer-map/pulls) |
| 🔒 Security Policy | [SECURITY.md](./SECURITY.md) |
| 📖 Conventional Commits | [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/) |
| ♿ WCAG Guidelines | [w3.org/WAI/standards-guidelines/wcag](https://www.w3.org/WAI/standards-guidelines/wcag/) |

---

*This document is maintained by the Cultural Explorer Map project team. For questions about contributing, open a [Discussion](https://github.com/TirthChhatrala/cultural-explorer-map/discussions) rather than a private message where possible — public discussions help the whole community.*
