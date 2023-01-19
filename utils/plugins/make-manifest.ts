import * as fs from 'fs';
import * as path from 'path';
import colorLog from '../log';
import { getManifestV2, getManifestV3 } from '../../src/manifest';
import { PluginOption } from 'vite';

const { resolve } = path;

const outDir = resolve(__dirname, '..', '..', 'public');

export default function makeManifest(folders: string[]): PluginOption {
  const manifest = getManifestV2(folders);
  return {
    name: 'make-manifest',
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }

      const manifestPath = resolve(outDir, 'manifest.json');

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

      colorLog(`Manifest file copy complete: ${manifestPath}`, 'success');
    },
  };
}
