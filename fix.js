const fs = require('fs'), path = require('path');
const dir = path.join(process.cwd(), 'src', 'app', 'dashboard', 'sell');
fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).forEach(f => {
  const p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  c = c[0] === String.fromCharCode(0xFEFF) ? c.slice(1) : c;
  c = c.replace(/^[^s'i"u]*use client[^\n;\"]*[";']*\n*/, '").trimStart();
  c = '"use client";\n\n' + c;
  fs.writeFileSync(p, c, 'utf8');
  console.log(f, JSON.stringify(c.slice(0, 25)));
});
