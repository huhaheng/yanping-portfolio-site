import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const source = path.join(repo, 'new-media-portfolio');
const output = path.join(source, 'dist-edgeone');
const githubBase = 'https://yanpingsun.github.io/yanping-portfolio-site/';
const productSite = 'https://yanpingsun.cn/';
const original = await readFile(path.join(source, 'index.html'), 'utf8');
const files = new Map();
const changes = new Map();

// Keep author-managed local assets relative to the new site's root.
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'dist-edgeone') continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (entry.isFile() && !/\.md$/i.test(entry.name) && entry.name !== 'edgeone.json') {
      files.set(path.relative(source, file), file);
    }
  }
}
await collect(source);

// Rehost repository images without changing copy, CSS, scripts or embedded QR art.
for (const match of original.matchAll(/https:\/\/yanpingsun\.github\.io\/yanping-portfolio-site\/[^\s"'<>]*/gu)) {
  const value = match[0];
  const url = new URL(value);
  const relative = decodeURIComponent(url.pathname.slice(new URL(githubBase).pathname.length));
  if (relative === 'preview/v3/' || relative === 'preview/v3/index.html') {
    changes.set(value, productSite + url.search + url.hash);
    continue;
  }
  const file = path.resolve(repo, relative);
  if (!file.startsWith(repo + path.sep) || !(await stat(file)).isFile()) {
    throw new Error(`Referenced repository resource is not a local file: ${relative}`);
  }
  const target = relative.startsWith('new-media-portfolio/')
    ? relative.slice('new-media-portfolio/'.length) : relative;
  files.set(target, file);
  changes.set(value, '/' + target.split('/').map(encodeURIComponent).join('/') + url.search + url.hash);
}

let html = original;
for (const [before, after] of [...changes].sort((a, b) => b[0].length - a[0].length)) {
  html = html.replaceAll(before, after);
}
const slides = [...html.matchAll(/<section\b[^>]*\bid="(s\d+)"/gu)].map(match => match[1]);
if (!slides.length || slides.some((id, index) => id !== `s${index + 1}`)) {
  throw new Error('Expected consecutively numbered new-media portfolio sections beginning with s1.');
}
for (const [target, file] of files) {
  if (target.startsWith('..') || path.isAbsolute(target)) throw new Error(`Invalid output path: ${target}`);
  if ((await stat(file)).size > 25_000_000) throw new Error(`File exceeds EdgeOne 25 MB limit: ${target}`);
}
if (files.size + 1 > 20_000) throw new Error('Output exceeds EdgeOne file limit.');

await rm(output, { recursive: true, force: true });
for (const [target, file] of files) {
  const destination = path.join(output, target);
  await mkdir(path.dirname(destination), { recursive: true });
  if (target === 'index.html') await writeFile(destination, html);
  else await copyFile(file, destination);
}
const metadata = {
  entry: 'new-media-portfolio/index.html',
  sourceIndexSha256: createHash('sha256').update(original).digest('hex'),
  deployedIndexSha256: createHash('sha256').update(html).digest('hex'),
  slides,
  outputFiles: files.size + 1,
  resources: [...files.keys()].filter(file => file !== 'index.html').sort(),
  urlChanges: Object.fromEntries(changes),
};
await writeFile(path.join(output, 'deployment-info.json'), JSON.stringify(metadata, null, 2) + '\n');
console.log(JSON.stringify({
  source: metadata.entry,
  sourceIndexSha256: metadata.sourceIndexSha256,
  slides: slides.length,
  outputFiles: metadata.outputFiles,
  rehostedResources: metadata.resources.length,
  outputDirectory: path.relative(repo, output),
}, null, 2));
