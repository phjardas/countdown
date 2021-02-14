const fs = require('fs');
const path = require('path');
const ssri = require('ssri');
const crypto = require('crypto');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

async function fileIntegrity(file) {
  const sri = await ssri.fromStream(fs.createReadStream(file));
  return sri.toString();
}

async function fileRevision(file) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    fs.createReadStream(file)
      .on('data', hash.update.bind(hash))
      .on('end', () => resolve(hash.digest('hex')))
      .on('error', reject);
  });
}

async function handleDir(dirname) {
  const dir = path.resolve(__dirname, 'public', dirname);
  const files = await readdir(dir);
  const result = await Promise.all(
    files.map(async (file) => {
      const full = path.resolve(dir, file);
      const [revision, integrity] = await Promise.all([fileRevision(full), fileIntegrity(full)]);
      return { url: `/${dirname}/${file}`, revision, integrity };
    })
  );
  return result.reduce((a, b) => ({ ...a, [b.url]: { integrity: b.integrity, revision: b.revision } }), {});
}

async function main() {
  const results = await handleDir('i/h');
  const js = `module.exports = ${JSON.stringify(results, null, 2)}`;
  await writeFile(path.resolve(__dirname, 'functions', 'render', 'assets.js'), js, 'utf-8');
}

main().catch((error) => {
  process.exitCode = error.exitCode || 1;
  console.error(error);
});
