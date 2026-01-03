import { createCanvas } from 'canvas';
import fs from 'fs';

/**
 * Draw tomato icon on a given canvas context
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {number} scale - Scale factor for the tomato
 */
function drawTomato(ctx, centerX, centerY, scale = 1) {
  // Draw tomato body
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + (40 * scale), 90 * scale, 80 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444'; // Tomato red
  ctx.fill();

  // Add tomato highlight
  ctx.beginPath();
  ctx.ellipse(centerX - (28 * scale), centerY + (15 * scale), 20 * scale, 17 * scale, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#f87171'; // Lighter red
  ctx.fill();

  // Draw stem/leaves (green top)
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - (40 * scale), 30 * scale, 15 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#22c55e'; // Green
  ctx.fill();

  // Add small leaf details
  ctx.beginPath();
  ctx.ellipse(centerX - (18 * scale), centerY - (45 * scale), 12 * scale, 7 * scale, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#16a34a'; // Darker green
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(centerX + (18 * scale), centerY - (45 * scale), 12 * scale, 7 * scale, 0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#16a34a';
  ctx.fill();

  // Add stem line
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - (55 * scale));
  ctx.lineTo(centerX, centerY - (25 * scale));
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();
}

// Create OG image (1200x630)
const ogCanvas = createCanvas(1200, 630);
const ogCtx = ogCanvas.getContext('2d');

// White background for OG image
ogCtx.fillStyle = '#ffffff';
ogCtx.fillRect(0, 0, 1200, 630);

// Draw large tomato in center
drawTomato(ogCtx, 600, 315, 2.5);

// Add title text
ogCtx.textAlign = 'center';
ogCtx.textBaseline = 'middle';
ogCtx.fillStyle = '#1f2937';
ogCtx.font = 'bold 48px Arial, sans-serif';
ogCtx.fillText('Pomo Timer', 600, 520);

// Add subtitle
ogCtx.font = '24px Arial, sans-serif';
ogCtx.fillStyle = '#6b7280';
ogCtx.fillText('Stop Procrastinating, Start Achieving', 600, 560);

// Save OG image
const ogBuffer = ogCanvas.toBuffer('image/png');
fs.writeFileSync('./public/og-image.png', ogBuffer);

// Create favicon (512x512)
const faviconCanvas = createCanvas(512, 512);
const faviconCtx = faviconCanvas.getContext('2d');

// Clear background (transparent)
faviconCtx.clearRect(0, 0, 512, 512);

// Draw tomato centered
drawTomato(faviconCtx, 256, 256, 2);

// Save favicon
const faviconBuffer = faviconCanvas.toBuffer('image/png');
fs.writeFileSync('./public/favicon.png', faviconBuffer);

console.log('✅ Created og-image.png and favicon.png successfully!');
console.log('🍅 Both images use the same tomato icon design');
console.log('📏 OG Image: 1200x630px | Favicon: 512x512px');
console.log('📍 Location: ./public/');