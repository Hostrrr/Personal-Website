# YegOS — Interactive Portfolio

An interactive developer portfolio styled as a desktop operating system.  
Built with React + Vite.

## Features

- **Desktop mode** (≥768px) — draggable, resizable windows with a dock, just like macOS
- **Mobile mode** (<768px) — lock screen, home screen and full-screen apps, just like iOS
- **Dark / Light theme** with per-window color theming
- **RU / EN** interface with auto-detection via `navigator.language`
- **Wallpaper colors** — 8 color options configurable from Settings
- **Snake game** — keyboard (arrows / WASD) + touch D-pad, personal best saved in `localStorage`

## Windows / Apps

| App | Description |
|---|---|
| About Me | Photo slider + short bio |
| Projects | Browser-style project viewer with search |
| Skills | Skill cards with particle effects on click |
| Contacts | Email, GitHub, Telegram, LinkedIn |
| Settings | Theme, language, wallpaper color |
| Games | Snake game |
| About YegOS | OS info window |

## Stack

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [react-rnd](https://github.com/bokuweb/react-rnd) — drag & resize windows
- [react-icons](https://react-icons.github.io/react-icons/)
- [web-haptics](https://github.com/nicholasgasior/web-haptics) — haptic feedback on mobile

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
