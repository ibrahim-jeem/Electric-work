# Electrical Load Calculation & Phase Balancer Web App

An advanced, interactive web application for electrical engineers, interior designers, and MEP consultants to calculate electrical loads, size circuit breakers and wire gauges, balance 3-phase loads (R-Y-B), generate Single-Line Diagrams (SLD), and export reports.

## Features
- **Standards Support:** BNBC, NFPA/NEC, and IEC 60364 compliance presets.
- **System Flexibility:** 1-Phase (220V/230V) and 3-Phase (380V/400V/415V) configurations.
- **Automated Sizing:** Design current ($I_d$), continuous load breaker sizing ($1.25 \times I$), wire gauge selection ($mm^2 / rm$ or AWG), and voltage drop checks.
- **Live Phase Balancer:** Real-time visual phase loading and automated R-Y-B phase balancing.
- **Interactive SLD:** Dynamic SVG single-line diagram generator.
- **Export & Reports:** CSV/Excel export and print-ready report generation.

## Deployment (GitHub Pages)
1. Upload these files to your GitHub repository.
2. Go to repository **Settings** > **Pages**.
3. Under **Build and deployment**, select **Branch: main** (or `master`) and `/ (root)` folder, then click **Save**.
4. Your application will be live at `https://<your-username>.github.io/<repository-name>/`.