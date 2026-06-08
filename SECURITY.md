# Security Policy

> **Cultural Explorer Map** — AI-powered cultural discovery, travel planning, storytelling, and community exploration platform.

This document defines the security model, trust boundaries, vulnerability reporting process, responsible disclosure policy, and security expectations for the Cultural Explorer Map platform. It is intended for contributors, security researchers, administrators, and community members.

---

## Table of Contents

1. [Reporting a Vulnerability](#1-reporting-a-vulnerability)
2. [Trust Model & Security Boundaries](#2-trust-model--security-boundaries)
   - 2.1 [User Boundary](#21-user-boundary)
   - 2.2 [Travel Stories Boundary](#22-travel-stories-boundary)
   - 2.3 [AI Systems Boundary](#23-ai-systems-boundary)
   - 2.4 [Rewards & Gamification Boundary](#24-rewards--gamification-boundary)
   - 2.5 [Administrative Boundary](#25-administrative-boundary)
   - 2.6 [Media Upload Boundary](#26-media-upload-boundary)
   - 2.7 [Infrastructure Boundary](#27-infrastructure-boundary)
3. [Scope](#3-scope)
   - 3.1 [In Scope](#31-in-scope)
   - 3.2 [Out of Scope](#32-out-of-scope)
4. [Severity Classification](#4-severity-classification)
5. [Deployment Hardening](#5-deployment-hardening)
6. [Responsible Disclosure](#6-responsible-disclosure)
7. [Security Philosophy](#7-security-philosophy)

---

## 1. Reporting a Vulnerability

### Do Not Disclose Publicly

**Do not open a public GitHub Issue for any security vulnerability.**

Public disclosure before a fix is available puts all users of the platform at risk. Security reports must always be submitted privately.

### How to Report

Contact the project maintainer directly via private communication with full details of the issue.

### What to Include in Your Report

A well-structured report helps us investigate and resolve issues faster. Please include the following where applicable:

| Field | Description |
|---|---|
| **Summary** | A clear, concise description of the vulnerability |
| **Affected Component** | The specific page, API endpoint, feature, or service affected |
| **Reproduction Steps** | A numbered, step-by-step guide to reproduce the issue |
| **Impact Assessment** | What an attacker could achieve by exploiting this vulnerability |
| **Evidence** | Screenshots, HTTP request/response logs, or supporting artifacts |
| **Environment** | Browser, operating system, device type, and any relevant configuration |
| **Proof of Concept** | PoC code or payloads (if applicable and safe to share) |

Reports that include complete reproduction steps can be triaged and resolved significantly faster.

---

## 2. Trust Model & Security Boundaries

Cultural Explorer Map enforces multiple layered security boundaries that separate users, content, AI systems, administrative functionality, and platform infrastructure. These boundaries are treated as core security controls — not implementation details.

The diagram below summarises the major trust boundaries:

```
┌─────────────────────────────────────────────────────────────┐
│                     Infrastructure Layer                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Administrative Layer                 │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                  AI Systems Layer               │  │  │
│  │  │  ┌──────────────┐  ┌──────────────────────────┐ │  │  │
│  │  │  │  User Layer  │  │  Travel Stories / Media  │ │  │  │
│  │  │  └──────────────┘  └──────────────────────────┘ │  │  │
│  │  │                  Rewards & Gamification         │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

Each boundary is described in detail below.

---

### 2.1 User Boundary

Users interact with the platform through public and authenticated interfaces.

**Authenticated users may access:**

- Personal profiles and account settings
- Travel Stories (owned or publicly shared)
- Saved destinations and trip data
- Reward balances and earned achievements
- Personalized recommendations
- Cultural quizzes and community features

**Security Expectation:**

Users must only be able to access data and functionality that belongs to their own account or has been explicitly made public by its owner. Any mechanism that allows one authenticated user to read, modify, or delete another user's private data — including profiles, preferences, saved content, or reward balances — represents a potential security vulnerability.

---

### 2.2 Travel Stories Boundary

Travel Stories represent one of the platform's most sensitive trust boundaries, as they contain user-generated content including text, images, cultural information, travel recommendations, and personal destination insights.

**Ownership Protection Rules:**

Users must not be able to:

- Edit stories that belong to other users
- Delete stories that belong to other users
- Read unpublished (draft) content belonging to other users
- Modify the moderation or publication status of any story
- Bypass publishing controls or content review workflows

Administrative users may be granted moderation privileges as part of their defined platform responsibilities.

**Security Expectation:**

Any unauthorized read, write, or delete access over another user's Travel Story content is considered a security issue regardless of whether the content is published or unpublished.

---

### 2.3 AI Systems Boundary

Cultural Explorer Map includes several AI-powered services integrated into the user experience.

**Current and planned AI features include:**

- **Bharat Buddy** — AI cultural assistant and travel guide
- **AI Trip Suggestions** — Personalized itinerary and destination recommendations
- **AI Story Generation** — Assisted travel story creation
- **Intelligent Recommendations** — Contextual cultural discovery

**Security Expectation:**

AI systems are user-facing application features and must be subject to the same authorization controls as all other platform functionality. AI-generated responses must never provide access to:

- Administrative functionality or management interfaces
- Private user data belonging to other accounts
- Internal platform configuration or architecture details
- Security credentials, API keys, or secrets
- Infrastructure resources or internal APIs
- Content restricted by moderation controls

**Scope Clarification:**

Prompt engineering demonstrations that do not result in a documented, verifiable security impact (e.g., unauthorized data access, privilege escalation, or security control bypass) are **out of scope**. Only prompt manipulation that produces a real, measurable security impact qualifies as a reportable vulnerability.

---

### 2.4 Rewards & Gamification Boundary

The reward and gamification system manages platform assets that carry measurable real or perceived value.

**Protected components include:**

- Quiz completion rewards and scoring
- Discount vouchers and promotional codes
- Achievement and badge systems
- Leaderboards and user rankings
- User point balances
- Reward redemption and fulfilment workflows

**Security Expectation:**

All rewards must be earned through legitimate, intended platform interactions. The following are considered potential security vulnerabilities:

- Manipulation of reward calculations or point balances
- Unauthorized generation or cloning of discount vouchers
- Leaderboard tampering or rank manipulation
- Unauthorized acquisition of points, badges, or achievements
- Bypassing redemption restrictions or eligibility rules

---

### 2.5 Administrative Boundary

The administrative layer represents the highest-privilege security boundary within the platform.

**Administrative capabilities may include:**

- User account management (creation, suspension, deletion)
- Content moderation and story approval workflows
- Platform-wide configuration and feature flags
- AI system management and prompt configuration
- Reward and voucher administration
- Analytics dashboards and reporting tools

**Security Expectation:**

Administrative privileges must be strictly isolated from standard user functionality. Under no circumstances should a regular user be able to access, invoke, or influence administrative functionality — whether through direct access, API manipulation, privilege escalation, parameter tampering, or any other method.

Unauthorized access to administrative systems is classified as a **Critical** severity vulnerability.

---

### 2.6 Media Upload Boundary

The platform permits users to upload content including story images, profile photos, travel media, and community contributions.

**Security Expectations for Media Systems:**

- Uploaded files must be processed and stored securely
- Users must not be able to access media files uploaded by other users unless explicitly shared
- The platform must prevent execution of malicious or unexpected file types
- Storage systems must enforce user ownership and moderation rules
- File upload functionality must not be abused for storage exhaustion or denial of service

---

### 2.7 Infrastructure Boundary

Platform infrastructure forms the foundation upon which all security boundaries depend.

**In-scope infrastructure components include:**

- Databases and data stores
- Backend APIs and service endpoints
- Authentication and session management systems
- File and media storage services
- Deployment environments and CI/CD pipelines
- Internal administrative and management tooling

**Security Expectation:**

Unauthorized access to any infrastructure component — whether through direct exploitation, credential theft, misconfiguration, or lateral movement — is treated as a **Critical** security event requiring immediate response.

---

## 3. Scope

### 3.1 In Scope

The following categories of issues are considered valid security vulnerabilities for this project:

| Category | Examples |
|---|---|
| **Authentication Bypass** | Logging in as another user, bypassing login entirely |
| **Authorization Bypass** | Accessing resources without proper permissions |
| **Privilege Escalation** | Gaining admin access from a standard user account |
| **Cross-Account Data Access** | Reading or modifying another user's private data |
| **Sensitive Data Exposure** | Leaking PII, credentials, tokens, or internal configuration |
| **Administrative Access Bypass** | Accessing admin functionality without admin privileges |
| **Reward System Exploitation** | Manipulating points, vouchers, or leaderboard entries |
| **Infrastructure Compromise** | Unauthorized access to databases, APIs, or services |
| **API Security Failures** | Insecure direct object references, mass assignment, broken access control |
| **Travel Story Ownership Violations** | Unauthorized read/write/delete on another user's stories |
| **Unauthorized Media Access** | Accessing private media files belonging to other users |
| **Security Control Failures** | Bypassing rate limits, CSRF protections, or input validation in a security-impactful way |

---

### 3.2 Out of Scope

The following are **not** considered security vulnerabilities for this project:

| Category | Examples |
|---|---|
| **Content & UI Issues** | Typos, layout bugs, cosmetic defects, poor UX |
| **Feature Requests** | Missing functionality, desired new features |
| **AI Hallucinations** | Incorrect or confabulated AI responses without security impact |
| **Prompt Engineering Demos** | Jailbreak demonstrations that do not result in unauthorized access |
| **Unsupported Browser Behaviour** | Issues only reproducible in deprecated or unsupported browsers |
| **Third-Party Service Outages** | Downtime or failures in external dependencies not under project control |
| **Vulnerabilities in Unsupported Versions** | Issues only affecting outdated, end-of-life versions of the platform |

---

## 4. Severity Classification

Reported vulnerabilities will be assessed and classified according to the following severity levels:

| Severity | Description | Examples |
|---|---|---|
| 🔴 **Critical** | Direct, exploitable impact on platform integrity or user data at scale | Admin access bypass, database compromise, mass account takeover |
| 🟠 **High** | Significant impact on a specific user or system component | Cross-account data access, reward system manipulation, privilege escalation |
| 🟡 **Medium** | Limited impact or requires significant preconditions to exploit | CSRF in low-risk actions, minor authorization gaps, unvalidated redirects |
| 🔵 **Low** | Minimal real-world impact; informational | Verbose error messages, low-impact information disclosure |

---

## 5. Deployment Hardening

All deployments of Cultural Explorer Map should follow industry-standard security hardening practices.

**Recommended measures:**

- **Transport Security** — Enforce HTTPS across all endpoints; disable HTTP access
- **Environment Variables** — Store secrets and credentials in environment variables, never in source code or version control
- **Principle of Least Privilege** — Grant the minimum permissions necessary to each service, user, and process
- **Dependency Management** — Monitor and update dependencies regularly; use automated vulnerability scanning (e.g., Dependabot, Snyk)
- **Access Logging** — Log authentication events, administrative actions, and API access for audit purposes
- **Database Security** — Use parameterized queries, enforce access controls, encrypt sensitive fields at rest
- **Storage Security** — Enforce per-user access controls on uploaded media; prevent public enumeration of private files
- **Multi-Factor Authentication** — Enable MFA for all administrative accounts and privileged access
- **Regular Security Reviews** — Conduct periodic code reviews and security assessments, particularly when adding new features
- **Incident Response** — Maintain a documented plan for detecting, containing, and remediating security incidents

Security considerations should be integrated throughout the development and deployment lifecycle — not treated as an afterthought.

---

## 6. Responsible Disclosure

Cultural Explorer Map supports responsible disclosure and encourages security researchers to report vulnerabilities privately.

**Our commitments to researchers:**

- All reports will be acknowledged promptly upon receipt
- Reports will be reviewed, validated, and prioritised according to severity and impact
- We will maintain open communication throughout the investigation process
- Fixes will be developed and released before any public disclosure occurs
- Researchers who report valid vulnerabilities may be acknowledged by name (or anonymously upon request)

**Our ask of researchers:**

- Report vulnerabilities privately before any public disclosure
- Allow reasonable time for investigation and remediation
- Do not access, modify, or delete user data beyond what is necessary to demonstrate the issue
- Do not perform testing that degrades platform availability or disrupts other users
- Do not publicly disclose vulnerability details before a fix has been released

We value the work of the security research community and are committed to working collaboratively to protect our users.

---

## 7. Security Philosophy

Security is a shared responsibility across every layer of the platform.

Every contributor, administrator, researcher, and community member plays a role in maintaining the safety and integrity of Cultural Explorer Map. We believe that transparency, collaboration, and continuous improvement are the foundations of a trustworthy platform.

By building security into every feature, reviewing it in every deployment, and responding to reports with care and urgency, we can continue to provide a platform that users trust with their data, their stories, and their explorations of the world's cultures.

---

*This document is maintained by the Cultural Explorer Map project team. For security-related concerns, contact the maintainer directly via private communication — never through public GitHub Issues.*
