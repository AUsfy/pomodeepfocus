import { createCanvas } from 'canvas';
import fs from 'fs';

// Create canvas
const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
gradient.addColorStop(0, '#ef4444');
gradient.addColorStop(1, '#dc2626');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 1200, 630);

// Add subtle pattern/texture
ctx.globalAlpha = 0.1;
for (let i = 0; i < 50; i++) {
  ctx.beginPath();
  ctx.arc(Math.random() * 1200, Math.random() * 630, Math.random() * 3, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
}
ctx.globalAlpha = 1;

// Title text with better font settings
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Main title
ctx.fillStyle = 'white';
ctx.font = 'bold 72px Arial, sans-serif';
ctx.fillText('🍅 Pomo Timer', 600, 180);

// Subtitle
ctx.font = '42px Arial, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
ctx.fillText('Stop Procrastinating, Start Achieving', 600, 260);

// Features with icons
ctx.font = '28px Arial, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
ctx.fillText('✓ 25min Focus Sessions  ✓ Task Management  ✓ Progress Tracking', 600, 340);

// Call to action
ctx.font = '32px Arial, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
ctx.fillText('Free Online Productivity Timer', 600, 420);

// URL
ctx.font = 'bold 36px Arial, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
ctx.fillText('pomodeepfocus.online', 600, 520);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/og-image.png', buffer);

console.log('✅ Created og-image.png successfully!');
console.log('📏 Dimensions: 1200x630px (optimal for social media)');
console.log('📍 Location: ./public/og-image.png');