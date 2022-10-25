import chokidar from 'chokidar';
import { copySync, unlinkSync } from 'fs-extra';

const watcher = chokidar.watch('/pages/**/*.{mdx,md}', {
  persistent: true
});

const copyFile = (path) => {
  console.log(path);
  copySync(path, `/opt/app-root/src${path[0] === '/' ? '' : '/'}${path.replace(/md$/, 'mdx')}`);
};

watcher
  .on('add',  copyFile)
  .on('change',  copyFile)
  .on('unlink',  (path) => {
    unlinkSync(`/opt/app-root/src${path[0] === '/' ? '' : '/'}${path.replace(/md$/, 'mdx')}`)
  });
