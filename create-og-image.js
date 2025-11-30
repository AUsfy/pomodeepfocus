#!/usr/bin/env node

// Simple script to create an OG image using Node.js
// This creates a basic text-based image for social media sharing

import fs from 'fs';

// Create a simple SVG that can be converted to PNG
const svgContent = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Main Title -->
  <text x="600" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
        text-anchor="middle" fill="white">🍅 Pomo Timer</text>
  
  <!-- Subtitle -->
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="42" 
        text-anchor="middle" fill="white" opacity="0.9">Stop Procrastinating, Start Achieving</text>
  
  <!-- Features -->
  <text x="600" y="360" font-family="Arial, sans-serif" font-size="32" 
        text-anchor="middle" fill="white" opacity="0.8">✓ Focus Sessions  ✓ Task Tracking  ✓ Progress Analytics</text>
  
  <!-- URL -->
  <text x="600" y="580" font-family="Arial, sans-serif" font-size="28" 
        text-anchor="middle" fill="white" opacity="0.7">pomodeepfocus.online</text>
</svg>`;

// Write the SVG file
fs.writeFileSync('./public/og-image.svg', svgContent);

console.log('✅ Created og-image.svg in public directory');
console.log('📝 To convert to PNG, use online tools like:');
console.log('   - cloudconvert.com');
console.log('   - convertio.co');
console.log('   - Or use ImageMagick: convert og-image.svg og-image.png');