<div align="center">

# YegOS — Interactive Portfolio 💻✨

An **interactive developer portfolio** that looks and feels like a real desktop operating system.  
Built with **React** + **Vite**.
<div align="center">
<img src="../public/PortfolioOS.png" width="50%" />
<!-- Replace the path above with your actual screenshot, e.g. ./screenshots/desktop.png -->
</div>
</div>

---

## ✨ Features

- 💼 **Desktop mode** (≥768px) — draggable, resizable windows with a dock, just like macOS
- 📱 **Mobile mode** (<768px) — lock screen, home screen and full-screen apps, just like iOS
- 🌗 **Dark / Light theme** with per-window color theming
- 🌍 **RU / EN** interface with auto-detection via `navigator.language`
- 🎨 **Wallpaper colors** — 8 color options configurable from Settings
- 🐍 **Snake game** — keyboard (arrows / WASD) + touch D-pad, personal best saved in `localStorage`

---

## 🪟 Windows / Apps

| App        | Description                                  |
|-----------|----------------------------------------------|
| About Me  | Photo slider + short bio                     |
| Projects  | Browser-style project viewer with search     |
| Skills    | Skill cards with particle effects on click   |
| Contacts  | Email, GitHub, Telegram, LinkedIn            |
| Settings  | Theme, language, wallpaper color             |
| Games     | Snake game                                   |
| About YegOS | OS info window                             |

---

## 🛠️ Tech Stack

- ⚛️ [React 19](https://react.dev/)
- ⚡ [Vite](https://vitejs.dev/)
- 🧩 [react-rnd](https://github.com/bokuweb/react-rnd) — drag & resize windows
- 🎨 [react-icons](https://react-icons.github.io/react-icons/)
- 📳 [web-haptics](https://github.com/nicholasgasior/web-haptics) — haptic feedback on mobile

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

The app will start on `http://localhost:5173` (or a similar port, depending on your setup).

---

## 📦 Production Build

```bash
npm run build
```

The production-ready files will be generated in the `dist` folder and can be deployed to any static hosting.

---

## 🙋 About the Author

Created by **Yegor Nazarenko** — frontend developer who loves playful UIs, desktop-style interfaces, and smooth mobile experiences.
