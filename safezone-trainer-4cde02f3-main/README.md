# SafeZone Trainer

A 3D interactive training application built with React, TypeScript, and Three.js for safety awareness and simulation training.

## 🚀 Features

- **3D Environment**: Immersive lab environment using Three.js and React Three Fiber
- **Interactive Objects**: Clickable objects with safety information
- **Game HUD**: Real-time feedback and progress tracking
- **Responsive Design**: Built with Tailwind CSS and ShadCN UI components
- **Audio Support**: Integrated audio hooks for enhanced user experience

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **3D Graphics**: Three.js with React Three Fiber and Drei
- **UI Components**: ShadCN UI with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React Query and custom hooks
- **Audio**: Web Audio API integration

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KARNIKA-23/SAFEZONE-TRAINNING-3D.git
   cd SAFEZONE-TRAINNING-3D
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

## 🏗️ Build

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 🎮 Usage

- Navigate through the 3D lab environment
- Interact with objects to learn safety procedures
- Complete training modules and track progress
- Use the dashboard to monitor training status

## 📁 Project Structure

```
src/
├── components/
│   ├── game/
│   │   ├── Dashboard.tsx       # Training dashboard
│   │   ├── GameHUD.tsx         # Heads-up display
│   │   ├── GameScene.tsx       # Main 3D scene
│   │   ├── InteractableObjects.tsx # Clickable 3D objects
│   │   ├── LabEnvironment.tsx  # 3D lab setup
│   │   └── MainMenu.tsx        # Game menu
│   └── ui/                     # Reusable UI components
├── hooks/
│   ├── useAudio.ts            # Audio management
│   └── useGameState.ts        # Game state logic
├── lib/
│   └── utils.ts               # Utility functions
├── pages/                     # Application pages
├── types/                     # TypeScript definitions
└── main.tsx                   # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [ShadCN](https://ui.shadcn.com/)
- 3D graphics powered by [Three.js](https://threejs.org/)
- Icons and styling with [Tailwind CSS](https://tailwindcss.com/)