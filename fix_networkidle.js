const fs = require('fs');
const path = require('path');

const base = 'audit_tools';
const files = fs.readdirSync(base).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(base, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace 'networkidle' with 'load'
  if (content.includes("'networkidle'")) {
    content = content.replace(/'networkidle'/g, "'load'");
    modified = true;
  }
  if (content.includes('"networkidle"')) {
    content = content.replace(/"networkidle"/g, '"load"');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed load states in: ${file}`);
  }
}

console.log('All load states updated successfully!');
