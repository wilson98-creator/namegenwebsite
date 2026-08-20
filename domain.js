/* domain.js
   Replace the placeholder domain nameforge.example with the real nameswiftgenerator.com
   across every file in the project.
*/
const fs = require('fs');
const FROM = 'nameforge.example';
const TO = 'nameswiftgenerator.com';

let totalReplacements = 0;
let filesChanged = 0;
const summary = {};

const files = fs.readdirSync('.').filter(f => {
  // Skip the script itself and the git directory
  if (f === 'domain.js' || f === '.git') return false;
  return f.endsWith('.html') || f.endsWith('.md') || f.endsWith('.xml') || f.endsWith('.txt') || f.endsWith('.json');
});

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes(FROM)) continue;
  const count = (content.match(new RegExp(FROM.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  const newContent = content.split(FROM).join(TO);
  fs.writeFileSync(file, newContent);
  filesChanged++;
  totalReplacements += count;
  summary[file] = count;
}

console.log(`Files changed: ${filesChanged}`);
console.log(`Total replacements: ${totalReplacements}\n`);
for (const [f, c] of Object.entries(summary)) {
  console.log(`  ${f}: ${c}`);
}
