# Copilot Instructions for Pomodoro Timer Project

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Vue.js Pomodoro timer application inspired by Pomofocus.io. The app helps users manage their time using the Pomodoro Technique with 25-minute work sessions and 5-minute breaks.

## Key Features to Implement
- Timer with customizable work/break durations (default: 25/5 minutes)
- Task management with add/edit/delete functionality
- Visual progress indicators and reports
- Customizable settings (timer durations, sounds, themes)
- Session tracking and statistics
- Modern, clean UI with tomato/red color scheme

## Technical Stack
- Vue.js 3 with Composition API
- Vite for build tooling
- CSS3 for styling (no external UI library initially)
- Local storage for data persistence

## Code Style Guidelines
- Use Vue 3 Composition API with `<script setup>` syntax
- Follow Vue.js naming conventions (kebab-case for components)
- Use semantic HTML and accessible design patterns
- Implement responsive design for mobile and desktop
- Use CSS custom properties for theming
- Keep components small and focused on single responsibilities

## File Structure
- `/src/components/` - Vue components (Timer, TaskList, Settings, etc.)
- `/src/composables/` - Reusable composition functions
- `/src/stores/` - State management (if needed)
- `/src/utils/` - Utility functions
- `/src/assets/` - Static assets (images, sounds)