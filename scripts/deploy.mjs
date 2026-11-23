/**
 * Публикация собранного приложения в ветку gh-pages.
 *
 * Использование:
 *   npm run deploy              — собрать и опубликовать на GitHub Pages
 *   npm run deploy -- --build-only — только собрать (без публикации)
 *
 * Базовый путь берётся из поля "homepage" в package.json, поэтому сборка
 * получает правильные пути к ресурсам и service worker.
 */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import ghpages from 'gh-pages';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const buildOnly = process.argv.includes('--build-only');

const homepage = pkg.homepage;
if (!homepage) {
  console.error('В package.json не задано поле "homepage" (например, https://user.github.io/repo/).');
  process.exit(1);
}

const base = new URL(homepage).pathname.endsWith('/')
  ? new URL(homepage).pathname
  : `${new URL(homepage).pathname}/`;

console.log(`Сборка для ${homepage} (базовый путь ${base})`);
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const build = spawnSync(npm, ['run', 'build'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    VITE_MOCK_MODE: 'true',
    VITE_BASE_PATH: base,
  },
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}
if (buildOnly) {
  console.log('Сборка завершена (ключ --build-only, публикация пропущена).');
  process.exit(0);
}

try {
  await new Promise((resolvePublish, rejectPublish) => {
    ghpages.publish(
      'dist',
      {
        branch: 'gh-pages',
        dotfiles: true,
        nojekyll: true,
        message: `Deploy ${new Date().toISOString()}`,
      },
      (error) => (error ? rejectPublish(error) : resolvePublish()),
    );
  });
  console.log(`Опубликовано: ${homepage}`);
  console.log('Не забудьте указать в настройках Pages ветку gh-pages (каталог /root).');
} catch (error) {
  console.error('Не удалось опубликовать на GitHub Pages:', error?.message ?? error);
  console.error('Проверьте доступ к origin (git credential) и что Pages включён для ветки gh-pages.');
  process.exit(1);
}
