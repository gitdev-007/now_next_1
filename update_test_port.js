const fs = require('fs');
const path = require('path');

const base = 'audit_tools';
const files = fs.readdirSync(base).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(base, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  if (content.includes('http://localhost:8000')) {
    content = content.replace(/http:\/\/localhost:8000/g, 'http://localhost:8001');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated test port in: ${file}`);
  }
}

console.log('All test ports updated successfully!');
