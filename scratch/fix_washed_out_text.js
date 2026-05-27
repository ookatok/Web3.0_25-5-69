const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../src/app/(public)');
const componentsDir = path.resolve(__dirname, '../src/presentation/components');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix card text colors
  content = content.replace(/bg-theme-card-bg text-white/g, 'bg-theme-card-bg text-theme-card-text');
  content = content.replace(/bg-theme-card-bg text-slate-300/g, 'bg-theme-card-bg text-theme-card-subtext');
  content = content.replace(/bg-theme-card-bg text-slate-400/g, 'bg-theme-card-bg text-theme-card-subtext');
  
  // In contact info card
  content = content.replace(/text-white shrink-0/g, 'text-theme-card-text shrink-0');
  content = content.replace(/text-white text-xs/g, 'text-theme-card-text text-xs');
  
  // Specific page titles
  content = content.replace(/leading-none text-white/g, 'leading-none text-theme-card-text');
  content = content.replace(/text-white mt-8 mb-4/g, 'text-theme-card-text mt-8 mb-4');

  // Hardcoded card container bg flip
  content = content.replace(/bg-\[\#1d1f22\] text-white/g, 'bg-theme-bg text-theme-card-text');
  content = content.replace(/bg-\[\#1d1f22\] text-theme-card-subtext/g, 'bg-theme-bg text-theme-card-subtext');
  content = content.replace(/bg-\[\#1d1f22\]/g, 'bg-theme-bg');
  content = content.replace(/bg-\[\#333\]/g, 'bg-theme-card-border');
  content = content.replace(/border-\[\#444\]/g, 'border-theme-card-border');
  content = content.replace(/border-\[\#333\]/g, 'border-theme-card-border');

  // Link hovers and groups
  content = content.replace(/group-hover:text-white/g, 'group-hover:text-theme-card-text');
  content = content.replace(/group-hover:border-white/g, 'group-hover:border-theme-card-text');
  content = content.replace(/hover:text-white/g, 'hover:text-theme-card-text');
  content = content.replace(/hover:border-white/g, 'hover:border-theme-card-text');

  // Other text white replacements in titles
  content = content.replace(/text-white group-hover:text-slate-300/g, 'text-theme-card-text group-hover:text-theme-card-subtext');
  content = content.replace(/text-white font-mono/g, 'text-theme-card-text font-mono');
  content = content.replace(/text-white font-bold/g, 'text-theme-card-text font-bold');
  content = content.replace(/text-white uppercase/g, 'text-theme-card-text uppercase');

  // Pagination
  content = content.replace(/bg-black border-black text-white/g, 'bg-theme-button-primary-bg border-theme-button-primary-bg text-theme-button-primary-text');

  // Button white overlays
  content = content.replace(/bg-white text-black hover:bg-slate-200/g, 'bg-theme-button-primary-bg text-theme-button-primary-text hover:bg-theme-button-primary-bg/85');
  content = content.replace(/border-white rounded-full/g, 'border-theme-card-text rounded-full');
  content = content.replace(/text-white hover:bg-white hover:text-black/g, 'text-theme-card-text hover:bg-theme-card-text hover:text-theme-bg');

  if (content !== original) {
    console.log(`Fixed washed text in: ${filePath}`);
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
console.log('Fixed washed out text styling completed successfully!');
