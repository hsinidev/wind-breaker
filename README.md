<div align="center">
# 🚀 Wind Breaker
### *High-Performance Interactive Web Experience & Canvas Engine*

<p align="center">
  [![Architect](https://img.shields.io/badge/Architect-Hsini%20Mohamed-0055ff?style=for-the-badge&logo=github&logoColor=white)](https://hsini.dev)
  [![Portfolio](https://img.shields.io/badge/Portfolio-hsini.dev-00c853?style=for-the-badge&logo=google-chrome&logoColor=white)](https://hsini.dev)
  [![Language](https://img.shields.io/badge/Language-HTML-f59e0b?style=for-the-badge)](https://github.com/hsinidev)
  [![Framework](https://img.shields.io/badge/Framework-WebGL%20/%20HTML5%20Canvas-6366f1?style=for-the-badge)](https://github.com/hsinidev)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</p>

</div>

---
## 🌟 Executive Overview

**Wind Breaker** delivers a fast, responsive, and cross-platform browser experience built with **HTML** and hardware-accelerated canvas rendering.

## ⚡ Key Highlights & Capabilities

- **60 FPS Smooth Rendering**: Hardware-accelerated graphics pipeline for seamless interaction.
- **Zero Dependency Footprint**: Pure, optimized codebase with instantaneous asset loading.
- **Cross-Platform Responsive**: Fully adaptable across desktop, tablet, and mobile browsers.
- **Local Storage State**: Automatic session persistence and state restoration.

---
## 🏗️ Architecture & Technology Stack

- **Primary Language**: `HTML`
- **Framework / Runtime**: `WebGL / HTML5 Canvas`
- **Design Pattern**: Modular Clean Architecture / Domain-Driven Design
- **License**: MIT Open Source Attribution

## 📖 Deep-Dive Technical Documentation

# Bofurin Urban street-art Portal

> **Vibe Focus:** Urban Street-Art / Bofurin Ledger Style  
> **Tech Stack:** Vite + Vanilla JS // Python Generators

Welcome to the **Bofurin Urban street-art Portal** web portal. This is a high-performance, immersive manga reader site designed specifically for fans of the series. The project leverages modern web optimization techniques to deliver a fast, localized, and beautiful experience.

---

## 🌟 Key Features

- Urban graffiti aesthetic with spray-paint splatters and high-contrast street art fonts.
- Offline reader service worker script.
- Flexible settings to adjust reader brightness and scroll speeds.
- High performance image rendering.

---

## 🛠️ Getting Started

### 📋 Prerequisites
- **For Web Server:** Python 3.10+ (to serve static files or run generators) or Node.js 18+ (if package dependencies are needed).
- **GitHub CLI (`gh`)**: Recommended for pushing updates.

### 🔑 API Key Configuration
This project includes automated content generation and SEO optimization scripts that use the **Zhipu AI / BigModel API**. 

To utilize these scripts:
1. Copy the `.env.example` file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your API key:
   ```env
   BIGMODEL_API_KEY=your_actual_api_key_here
   ```
   *Note: If you have multiple keys, you can specify them as a comma-separated list.*

---

## 🚀 Local Development

Install dependencies and launch the Vite development server:
```bash
npm install
npm run dev
```

Then open your browser and navigate to the local server URL (usually `http://localhost:8000` or `http://localhost:5173`).

---

## 🤖 Content Generation & Automation
The project is equipped with local AI-powered generation scripts to build and update the site content dynamically.

You can run these scripts to regenerate and optimize the portal content:

- **`python scratch/seo_gen.py`**: Generates localized SEO description content.


---

## 📦 Production Deployment

Build static assets to `dist/` directory:
```bash
npm run build
```
Deploy the `dist/` directory directly.

- **Ignored Assets:** Large `manga/` chapter image directories and local archives are excluded from this repository (configured in `.gitignore`) for performance and size constraints. Ensure image files are uploaded directly to your hosting server's path structure.
- **SEO Ready:** Sitemap (`sitemap.xml`) and `.htaccess` file rules are fully configured to rewrite paths and provide Google-friendly crawler access.

---
## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/hsinidev/wind-breaker.git
cd wind-breaker
```

### 3. Launch the Application
```bash
Open index.html in any modern browser
```


---

## 👨‍💻 System Architect & Author

<table align="center" style="border: none; background: transparent; width: 100%;">
  <tr>
    <td align="center" width="160" style="border: none; padding: 12px;">
      <img src="https://avatars.githubusercontent.com/u/232697467?v=4" width="120" height="120" style="border-radius: 50%; box-shadow: 0 8px 24px rgba(99,102,241,0.3); border: 2.5px solid #6366f1;" alt="Hsini Mohamed" />
      <br /><br />
      <b>Hsini Mohamed</b><br />
      <sub>Morocco 🇲🇦</sub>
    </td>
    <td style="border: none; padding: 12px; vertical-align: middle;">
      <h3 style="margin-top: 0;">🚀 System Architect & Full-Stack Engineer</h3>
      <p style="font-size: 0.95rem; line-height: 1.6; color: #475569;">
        Specializing in high-performance autonomous AI systems, deterministic multi-agent swarms, enterprise cloud architecture, and modern full-stack engineering.
      </p>
      <p>
        <a href="https://hsini.dev"><img src="https://img.shields.io/badge/Portfolio-hsini.dev-2563eb?style=flat-square&logo=google-chrome&logoColor=white" alt="Portfolio" /></a>
        <a href="mailto:contact@hsini.dev"><img src="https://img.shields.io/badge/Email-contact@hsini.dev-ea4335?style=flat-square&logo=gmail&logoColor=white" alt="Email" /></a>
        <a href="https://github.com/hsinidev"><img src="https://img.shields.io/badge/GitHub-@hsinidev-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub" /></a>
        <a href="https://linkedin.com/in/hsinidev/"><img src="https://img.shields.io/badge/LinkedIn-hsinidev-0077b5?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
      </p>
    </td>
  </tr>
</table>

---

## 📄 License & Attribution

This project is distributed under the **MIT License**. See [`LICENSE`](LICENSE) for complete terms.

<div align="center">
  <sub>⚡ Designed, architected, and maintained with engineering precision by <b><a href="https://hsini.dev">Hsini Mohamed</a></b>.</sub>
</div>
