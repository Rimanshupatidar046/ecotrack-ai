const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  const lucideImports = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
  if (lucideImports) {
    const icons = lucideImports[1].split(',').map(i => i.trim());
    icons.forEach(icon => {
      if (!icon) return;
      const regex = new RegExp('<' + icon + '\\s+((?:(?!aria-hidden)[^>])*)>', 'g');
      content = content.replace(regex, (match, p1) => {
        if (p1.endsWith('/')) {
           return '<' + icon + ' ' + p1.slice(0, -1) + ' aria-hidden="true" />';
        }
        return match;
      });
    });
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', path.basename(file));
  }
});
