const fs = require('fs');
const path = require('path');

const base = 'audit_tools';
const files = fs.readdirSync(base).filter(f => f.endsWith('.js'));
const currentConvId = 'ce74cb2a-d480-4432-92ad-0dcbb4134f51';
const targetPath = `C:\\\\Users\\\\Dev Tinker\\\\.gemini\\\\antigravity-ide\\\\brain\\\\${currentConvId}`;

for (const file of files) {
  const filePath = path.join(base, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Match: const ARTIFACTS_DIR = '...';
  const pattern = /const ARTIFACTS_DIR = '.*';/g;
  if (content.match(pattern)) {
    content = content.replace(pattern, `const ARTIFACTS_DIR = '${targetPath}';`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated artifacts path in: ${file}`);
  }
}

console.log('Artifacts paths updated successfully!');
