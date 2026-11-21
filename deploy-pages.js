import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const tempDir = path.join(os.tmpdir(), `learnx-gh-pages-${Date.now()}`);
fs.mkdirSync(tempDir, { recursive: true });

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying dist to', tempDir);
copyDir(path.resolve('dist'), tempDir);

// Add .nojekyll so GitHub Pages does not ignore _ or assets
fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');

const run = (cmd) => {
  console.log('>', cmd);
  return execSync(cmd, { cwd: tempDir, stdio: 'inherit' });
};

try {
  run('git init');
  run('git config user.name "chaithrachailingaraj-arch"');
  run('git config user.email "chaithrachailingaraj@gmail.com"');
  run('git checkout -b gh-pages');
  run('git add -A');
  run('git commit -m "Deploy LearnX to GitHub Pages"');
  run('git remote add origin https://github.com/chaithrachailingaraj-arch/LearnX.git');
  run('git push origin gh-pages --force');
  console.log('SUCCESSFULLY DEPLOYED TO GH-PAGES!');
} finally {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch {}
}
