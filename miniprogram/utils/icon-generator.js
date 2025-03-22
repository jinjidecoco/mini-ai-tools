// This is a utility script to generate SVG icons for our app
// You can run this script to generate placeholder icons if you don't have actual icon images

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { JSDOM } = require('jsdom');
const { SVGPathData } = require('svg-pathdata');

const ICONS_DIR = path.join(__dirname, '../assets/icons');

// Ensure the icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Function to convert SVG string to PNG buffer
function svgToPng(svgString, size = 32) {
  // For simplicity, we're creating a basic PNG
  // In a real implementation, you would use proper SVG to PNG conversion
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill with transparent background
  ctx.clearRect(0, 0, size, size);

  // Draw a simple representation based on the SVG type
  if (svgString.includes('home')) {
    // Home icon
    ctx.fillStyle = svgString.includes('active') ? '#3B82F6' : '#6B7280';
    ctx.beginPath();
    ctx.moveTo(16, 4);
    ctx.lineTo(28, 14);
    ctx.lineTo(28, 28);
    ctx.lineTo(4, 28);
    ctx.lineTo(4, 14);
    ctx.lineTo(16, 4);
    ctx.closePath();
    ctx.fill();

    // Door
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(12, 18, 8, 10);
  } else if (svgString.includes('category')) {
    // Category icon
    ctx.fillStyle = svgString.includes('active') ? '#3B82F6' : '#6B7280';
    ctx.fillRect(4, 4, 10, 10);
    ctx.fillRect(18, 4, 10, 10);
    ctx.fillRect(4, 18, 10, 10);
    ctx.fillRect(18, 18, 10, 10);
  } else if (svgString.includes('profile')) {
    // Profile icon
    ctx.fillStyle = svgString.includes('active') ? '#3B82F6' : '#6B7280';
    // Head
    ctx.beginPath();
    ctx.arc(16, 10, 6, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.moveTo(6, 28);
    ctx.lineTo(26, 28);
    ctx.lineTo(26, 24);
    ctx.quadraticCurveTo(16, 18, 6, 24);
    ctx.closePath();
    ctx.fill();
  } else {
    // Generic icon for others
    ctx.fillStyle = '#6B7280';
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toBuffer('image/png');
}

// Function to save SVG string as PNG file
function saveSvgAsPng(svgString, filePath) {
  const pngBuffer = svgToPng(svgString);
  fs.writeFileSync(filePath, pngBuffer);
}

// Generate tool icons
for (let i = 1; i <= 4; i++) {
  const color = i === 1 ? '#3B82F6' : i === 2 ? '#10B981' : i === 3 ? '#8B5CF6' : '#E5E7EB';
  const toolIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  ${i === 1 ? '<path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle>' : ''}
  ${i === 2 ? '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>' : ''}
  ${i === 3 ? '<circle cx="12" cy="12" r="10"></circle><path d="M8 15h8M15.5 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8.5 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM12 14.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"></path>' : ''}
  ${i === 4 ? '<path d="M21 12h-4l-3 9L9 3l-3 9H2"></path>' : ''}
</svg>
  `;
  fs.writeFileSync(path.join(ICONS_DIR, `tool-${i}.svg`), toolIcon.trim());
  saveSvgAsPng(toolIcon, path.join(ICONS_DIR, `tool-${i}.png`));
}

// Generate recent icons
for (let i = 1; i <= 4; i++) {
  const color = i === 1 ? '#3B82F6' : i === 2 ? '#10B981' : i === 3 ? '#8B5CF6' : '#F59E0B';
  const recentIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  ${i === 1 ? '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>' : ''}
  ${i === 2 ? '<circle cx="12" cy="12" r="10"></circle><path d="M16 16v1.5a2.5 2.5 0 0 1-5 0V16m2.5-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"></path>' : ''}
  ${i === 3 ? '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path>' : ''}
  ${i === 4 ? '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>' : ''}
</svg>
  `;
  fs.writeFileSync(path.join(ICONS_DIR, `recent-${i}.svg`), recentIcon.trim());
  saveSvgAsPng(recentIcon, path.join(ICONS_DIR, `recent-${i}.png`));
}

// Generate navigation icons
const navigationIcons = {
  'search.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
  'notification.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
  'arrow-right.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
  'home.png': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  'home-active.png': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  'category.png': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
  'category-active.png': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
  'profile.png': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  'profile-active.png': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
};

for (const [filename, content] of Object.entries(navigationIcons)) {
  fs.writeFileSync(path.join(ICONS_DIR, filename), content.trim());

  // Also save as PNG if it's a PNG file
  if (filename.endsWith('.png')) {
    saveSvgAsPng(content, path.join(ICONS_DIR, filename));
  }
}

console.log('Icon files generated successfully!');