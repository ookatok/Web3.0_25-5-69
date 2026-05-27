const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../src/app/(public)');
const componentsDir = path.resolve(__dirname, '../src/presentation/components');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replacements for background and text colors
  content = content.replace(/bg-\[\#131415\]/g, 'bg-theme-bg');
  content = content.replace(/bg-\[\#212224\]/g, 'bg-theme-card-bg');
  content = content.replace(/border-\[\#2c2d30\]/g, 'border-theme-card-border');
  content = content.replace(/text-\[\#c2c4c6\]/g, 'text-theme-text');
  content = content.replace(/border-\[\#202225\]/g, 'border-theme-card-border');
  content = content.replace(/bg-\[\#2d2e30\]/g, 'bg-theme-card-bg');

  // Text colors
  content = content.replace(/text-slate-400\b(?!.*class.*)/g, 'text-theme-card-subtext');
  content = content.replace(/text-slate-500\b/g, 'text-theme-card-subtext');

  if (content !== original) {
    console.log(`Updated theme colors in: ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath);
    } else {
      let ext = path.extname(f);
      if (['.ts', '.tsx'].includes(ext)) {
        processFile(dirPath);
      }
    }
  });
}

walkDir(publicDir);
walkDir(componentsDir);
console.log('Theme styling replacements completed successfully!');
