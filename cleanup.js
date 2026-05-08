const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const dirs = [path.join(__dirname, 'app'), path.join(__dirname, 'components')];
const files = dirs.flatMap(dir => walkSync(dir)).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css'));

let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Remove backdrop-blur-*
  content = content.replace(/backdrop-blur-(sm|md|lg|xl|2xl|3xl|none)/g, '');
  content = content.replace(/backdrop-blur\b/g, '');

  // 2. Safely handle specific complex gradients before general wipe
  content = content.replace(/bg-gradient-to-(br|tr|bl|tl|r|l|t|b) from-indigo-[0-9]+(\/[0-9]+)? (via-([a-z]+-[0-9]+(\/[0-9]+)?) )?to-([a-z]+-[0-9]+(\/[0-9]+)?)/g, 'bg-zinc-100 dark:bg-zinc-800');
  content = content.replace(/bg-gradient-to-(t|b) from-(black|zinc-900)(\/[0-9]+)? (via-[a-z0-9/-]+ )?to-(transparent|[a-z0-9/-]+)/g, 'bg-black/50');
  content = content.replace(/bg-gradient-to-[a-z]+ from-[a-z]+-[0-9]+(\/[0-9]+)? to-transparent/g, 'bg-zinc-100 dark:bg-zinc-800/10');
  
  // General gradient wipe
  content = content.replace(/bg-gradient-to-[a-z]+\b/g, '');
  content = content.replace(/from-([a-z]+-[0-9]+(\/[0-9]+)?)\b/g, '');
  content = content.replace(/via-([a-z]+-[0-9]+(\/[0-9]+)?)\b/g, '');
  content = content.replace(/to-([a-z]+-[0-9]+(\/[0-9]+)?)\b/g, '');
  content = content.replace(/from-transparent\b/g, '');
  content = content.replace(/to-transparent\b/g, '');

  // 3. Fix colors globally
  content = content.replace(/purple-/g, 'amber-');
  content = content.replace(/indigo-/g, 'blue-');

  // 4. Cleanup empty spaces
  content = content.replace(/  +/g, ' ');
  content = content.replace(/ \)/g, ')');
  content = content.replace(/ "/g, '"');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log('Updated', file);
  }
});

console.log('Total files changed:', changedFiles);
