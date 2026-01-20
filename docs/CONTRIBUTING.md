# Contributing to Pomodoro Timer

Thank you for your interest in contributing to the Pomodoro Timer project! This document provides guidelines for contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/pomodeepfocus.git
   cd pomodeepfocus
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Making Changes

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes following our code style guidelines
3. Test your changes locally
4. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of feature"
   ```

### Code Style

- Use **Vue 3 Composition API** with `<script setup>` syntax
- Follow **Vue.js naming conventions** (kebab-case for components)
- Write **semantic HTML** with accessibility in mind
- Use **CSS custom properties** for theming
- Keep components **small and focused** on single responsibilities
- Add comments for complex logic

### Testing Your Changes

Before submitting a pull request:

1. **Run the development server** and test manually
2. **Build the project** to ensure no build errors:
   ```bash
   npm run build
   ```
3. **Test with Docker** if making deployment changes:
   ```bash
   npm run docker:compose:build
   ```

## Submitting Changes

1. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. **Open a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Screenshots for UI changes
   - Reference any related issues

## Pull Request Guidelines

- **Keep PRs focused** - one feature or fix per PR
- **Write clear descriptions** - explain what and why, not just how
- **Include screenshots** for UI changes
- **Update documentation** if needed
- **Be responsive** to feedback and review comments

## Code Review Process

- All PRs require review before merging
- Address reviewer feedback promptly
- Maintain a respectful and constructive dialogue

## Areas for Contribution

We welcome contributions in these areas:

- 🐛 **Bug fixes** - Fix issues and improve stability
- ✨ **New features** - Add functionality that aligns with project goals
- 📝 **Documentation** - Improve guides, code comments, and examples
- 🎨 **UI/UX improvements** - Enhance the user interface and experience
- ♿ **Accessibility** - Improve accessibility features
- 🌍 **Internationalization** - Add translations for different languages
- ⚡ **Performance** - Optimize code and reduce load times

## Questions?

If you have questions about contributing, feel free to:
- Open an issue on GitHub
- Check existing documentation in the `/docs` folder
- Review the project README

Thank you for contributing! 🍅
