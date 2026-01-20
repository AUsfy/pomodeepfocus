# Pomodoro Timer App 🍅

A modern, clean Pomodoro timer application built with Vue.js 3, inspired by Pomofocus.io. Features a 25-minute work timer with customizable breaks, task management, and productivity insights.

## Features

- ⏱️ Pomodoro timer with customizable durations
- 📝 Task management with progress tracking
- 📊 Productivity insights and statistics
- 🎨 Dark/light theme support
- 🔐 Optional user authentication for data sync
- 📱 Responsive design for all devices
- 🔔 Desktop notifications and sound alerts

## Quick Start

### Using Docker (Recommended)

The easiest way to run the application is using Docker:

```bash
# Build and run with Docker Compose
npm run docker:compose:build

# Or use individual commands
npm run docker:build
npm run docker:run
```

The app will be available at `http://localhost:3000`

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Docker Commands

| Command | Description |
|---------|-------------|
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run container on port 3000 |
| `npm run docker:compose` | Start with Docker Compose |
| `npm run docker:compose:build` | Build and start with Docker Compose |
| `npm run docker:stop` | Stop Docker Compose services |
| `npm run docker:logs` | View container logs |

## Docker Architecture

- **Multi-stage build**: Optimized for production with minimal image size
- **Nginx serving**: Fast static file serving with compression
- **Security headers**: XSS protection and security best practices
- **Health checks**: Built-in health monitoring endpoint at `/health`

## Authentication

The app works immediately without login. Optional sign-in provides:
- Cross-device data synchronization
- Cloud backup of tasks and settings
- Personalized productivity insights

Demo account: `demo@pomo.app` / `demo123`

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Styling**: CSS3 with custom properties
- **Storage**: Local Storage + optional cloud sync
- **Containerization**: Docker with Nginx

## Production Deployment

```bash
# Build production image
docker build -t pomodoro-timer .

# Run in production mode
docker run -d -p 80:80 --name pomodoro pomodoro-timer

# Or use Docker Compose for orchestration
docker-compose up -d
```

## Documentation

For detailed documentation, see the [`docs/`](./docs) directory:

- **[Architecture](./docs/ARCHITECTURE.md)** - Technical architecture and design
- **[API Reference](./docs/API.md)** - Component and composable APIs
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - How to contribute
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deployment instructions

## Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details on:

- Development setup and workflow
- Code style guidelines
- Pull request process
- Areas where you can help

Quick start for contributors:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
