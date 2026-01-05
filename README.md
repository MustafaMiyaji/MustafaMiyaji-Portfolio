
# 🌐 The Neural Grid | Mustafa Miyaji

![License](https://img.shields.io/badge/license-MIT-cyan.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)
![Vercel](https://img.shields.io/badge/deploy-vercel-black.svg)

> A high-fidelity, cinematic developer portfolio engineered with React, Framer Motion, and fluid canvas physics.

**[Live Demo](https://your-vercel-url.vercel.app)**

## ⚡ Overview

The **Neural Grid** is a conceptual portfolio designed to bridge the gap between functional information and immersive digital art. It treats the user interface as a secure digital vault, utilizing cyber-intelligence aesthetics, glitch effects, and magnetic physics to create a tactile experience.

### Key Features

*   **🧠 Neural Particle Engine**: Custom HTML5 Canvas simulation (`Background.tsx`) featuring mouse repulsion, node networking, and fluid dynamics.
*   **🧲 Magnetic UI**: Interactive elements (`CustomCursor.tsx`, `MagneticButton`) that physically react to cursor proximity using spring physics.
*   **🔊 Sonic Architecture**: Web Audio API integration generating real-time UI sounds (clicks, hovers, ambient).
*   **🔐 Cyber-Security Aesthetic**: Glitch text decoding, terminal-style chat interfaces, and biometric scanning animations.
*   **📂 Holographic Cert Vault**: A 3D stacked card interface (`CertStack.tsx`) with parallax depth and neon glow effects.
*   **🚀 Performance First**: GPU-accelerated animations, Vite-powered build tooling, and optimized React rendering.

## 🛠️ Tech Stack

*   **Core**: React 18, TypeScript
*   **Animation**: Framer Motion
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Build**: Vite

## 🚀 Local Development

To clone and run this application locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/MustafaMiyaji/neural-grid.git
    cd neural-grid
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the dev server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 📦 Deployment

### Vercel (Recommended)

This project is configured for zero-config deployment on Vercel.

1.  Push your code to a GitHub repository.
2.  Go to [Vercel](https://vercel.com) and import the project.
3.  Vercel will detect the `Vite` framework preset.
4.  Click **Deploy**.

**Note on Versions**: The `package.json` utilizes wildcard `*` versions for dependencies to ensure compatibility with the latest packages during the build process, preventing legacy peer-dependency errors.

**Note on TypeScript**: The `tsconfig.json` is configured with `"noUnusedLocals": false` to prevent build failures during rapid iteration or when unused variables are present.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Architected by Mustafa Miyaji © 2026*
