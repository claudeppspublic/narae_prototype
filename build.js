const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const ROOT = __dirname;
const NS = 'KRDSDesignSystem_416a36';
const OUT = path.join(ROOT, '_ds_bundle.js');

function findJsx(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findJsx(full));
    else if (entry.name.endsWith('.jsx')) results.push(full);
  }
  return results.sort();
}

const jsxFiles = [
  ...findJsx(path.join(ROOT, 'assets', 'icons')),
  ...findJsx(path.join(ROOT, 'components')),
];

console.log(`Found ${jsxFiles.length} JSX files to compile`);

let output = `// KRDS Design System Bundle — auto-generated\n`;
output += `const __ds_ns = (window.${NS} = window.${NS} || {});\n`;
output += `const __ds_errors = (window.__ds_errors = window.__ds_errors || []);\n\n`;

let compiled = 0;
let failed = 0;

for (const file of jsxFiles) {
  const rel = path.relative(ROOT, file);
  const name = path.basename(file, '.jsx');
  let src = fs.readFileSync(file, 'utf8');

  // Strip import statements (React is global in browser)
  src = src.replace(/^import\s+.*?from\s+["'].*?["'];?\s*$/gm, '');
  // Strip export default
  src = src.replace(/^export\s+default\s+\w+;?\s*$/gm, '');
  // Convert named exports to plain declarations
  src = src.replace(/^export\s+(function|const|let|var|class)\s/gm, '$1 ');

  try {
    const result = babel.transformSync(src, {
      filename: file,
      presets: [['@babel/preset-react', { runtime: 'classic' }]],
      sourceMaps: false,
    });

    output += `// ${rel}\n`;
    output += `try { (() => {\n${result.code}\n__ds_ns.${name} = ${name};\n})(); } catch(e) { __ds_errors.push({component:"${name}",file:"${rel}",error:e}); console.warn("KRDS bundle: ${name} failed",e); }\n\n`;
    compiled++;
  } catch (err) {
    console.error(`FAIL: ${rel} — ${err.message}`);
    failed++;
  }
}

output += `// Bundle summary: ${compiled} compiled, ${failed} failed\n`;
output += `console.log("KRDS bundle loaded:", Object.keys(__ds_ns).length, "components");\n`;

fs.writeFileSync(OUT, output, 'utf8');
const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(`\nBundle written: ${OUT} (${kb} KB)`);
console.log(`Compiled: ${compiled}, Failed: ${failed}`);
