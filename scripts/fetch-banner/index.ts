#!/usr/bin/env node
/**
 * Banner Image Fetch CLI
 *
 * Queries the Wikimedia Commons API for a themed image relevant to a dataset,
 * picks the best freely-licensed candidate, and captures its license +
 * attribution. The LLM/human supplies the search query; the fetch and license
 * capture are scripted.
 *
 * Design:
 *   - Dry-run by default: prints the chosen image (title, URL, license,
 *     attribution) and writes NOTHING. Choosing "the" banner and committing a
 *     binary asset are deliberate decisions for the repo owner - the tool
 *     proposes, a human confirms.
 *   - --download opts in to actually fetching the binary and writing files:
 *     saves to public/img/banners/<id>.jpg and records the path + license +
 *     attribution in the dataset's manifest.json (format-preserving).
 *   - Prefers CC / public-domain images; non-free candidates are flagged.
 *
 * Usage:
 *   npx tsx scripts/fetch-banner/index.ts --dataset <id> --query "..." [options]
 *
 * Options:
 *   --dataset <id>   Dataset directory name (required).
 *   --query <text>   Commons search query (required). Quote multi-word queries.
 *   --download       Actually fetch the image + update the manifest.
 *                    Default: dry-run (report only, no writes).
 *   --limit <n>      Number of Commons candidates to consider. Default: 15.
 *   --quiet          Suppress the alternative-candidates listing.
 *   --json           Emit the chosen candidate as JSON (implies --quiet).
 *   --help, -h       Show this help.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import {
  searchImages,
  pickBest,
  downloadImage,
  type CommonsImage,
} from './commons.js';
import { updateManifestText, type BannerFields } from './manifest.js';

const DATASETS_DIR = 'public/datasets';
const BANNERS_DIR = 'public/img/banners';

interface CLIOptions {
  dataset?: string;
  query?: string;
  download: boolean;
  limit: number;
  quiet: boolean;
  json: boolean;
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    download: false,
    limit: 15,
    quiet: false,
    json: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--dataset':
        options.dataset = args[++i];
        break;
      case '--query':
        options.query = args[++i];
        break;
      case '--download':
        options.download = true;
        break;
      case '--limit': {
        const n = Number(args[++i]);
        if (!Number.isInteger(n) || n <= 0) {
          console.error('--limit must be a positive integer');
          process.exit(1);
        }
        options.limit = n;
        break;
      }
      case '--quiet':
        options.quiet = true;
        break;
      case '--json':
        options.json = true;
        options.quiet = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          showHelp();
          process.exit(1);
        }
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
Banner Image Fetch CLI for Scenius

Queries Wikimedia Commons for a themed banner image, picks the best
freely-licensed candidate, and captures its license + attribution.

Dry-run by default: it reports the chosen image and writes nothing. Pass
--download to actually fetch the binary and update the manifest.

Usage:
  npx tsx scripts/fetch-banner/index.ts --dataset <id> --query "..." [options]

Options:
  --dataset <id>   Dataset directory name (required).
  --query <text>   Commons search query (required). Quote multi-word queries.
  --download       Actually fetch the image + update the manifest.
                   Default: dry-run (report only, no writes).
  --limit <n>      Number of Commons candidates to consider. Default: 15.
  --quiet          Suppress the alternative-candidates listing.
  --json           Emit the chosen candidate as JSON (implies --quiet).
  --help, -h       Show this help.

Examples:
  npm run fetch-banner -- --dataset enlightenment --query "Enlightenment salon painting"
  npm run fetch-banner -- --dataset enlightenment --query "Enlightenment salon painting" --download
`);
}

/** Compose a plain-text attribution for the manifest. */
function buildAttribution(image: CommonsImage): string {
  const author = image.artist.trim();
  const base = author && author.toLowerCase() !== 'unknown author'
    ? author
    : 'Unknown author';
  return `${base}, via Wikimedia Commons`;
}

function printChosen(image: CommonsImage, options: CLIOptions): void {
  console.log('\nChosen Commons image:');
  console.log(`  Title:       ${image.title}`);
  console.log(`  Image URL:   ${image.imageUrl}`);
  console.log(`  File page:   ${image.descriptionUrl}`);
  console.log(`  Dimensions:  ${image.width} x ${image.height} (${image.mime})`);
  console.log(`  License:     ${image.license}${image.isFree ? '' : '  [NON-FREE - review!]'}`);
  console.log(`  Attribution: ${buildAttribution(image)}`);
  console.log(
    `  Attribution required: ${image.attributionRequired ? 'yes' : 'no'}`
  );

  if (!options.quiet && !options.download) {
    console.log('\n  (dry-run: no files written; pass --download to fetch + update manifest)');
  }
}

function printAlternatives(images: CommonsImage[], chosen: CommonsImage): void {
  const others = images.filter((i) => i !== chosen).slice(0, 5);
  if (others.length === 0) return;
  console.log('\nOther candidates:');
  for (const img of others) {
    const flag = img.isFree ? '' : ' [non-free]';
    console.log(`  - ${img.title} (${img.license}${flag})`);
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (!options.dataset || !options.query) {
    console.error('Both --dataset and --query are required.\n');
    showHelp();
    process.exit(1);
  }

  const datasetsPath = resolve(process.cwd(), DATASETS_DIR);
  const manifestPath = join(datasetsPath, options.dataset, 'manifest.json');
  if (!existsSync(manifestPath)) {
    console.error(
      `Dataset "${options.dataset}" not found or missing manifest.json`
    );
    process.exit(1);
  }

  const images = await searchImages(options.query, options.limit);
  if (images.length === 0) {
    console.error(`No Commons images found for query: "${options.query}"`);
    process.exit(1);
  }

  const chosen = pickBest(images);
  if (!chosen) {
    console.error('No usable image candidate found.');
    process.exit(1);
  }

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          dataset: options.dataset,
          title: chosen.title,
          imageUrl: chosen.imageUrl,
          descriptionUrl: chosen.descriptionUrl,
          license: chosen.license,
          licenseCode: chosen.licenseCode,
          attribution: buildAttribution(chosen),
          attributionRequired: chosen.attributionRequired,
          isFree: chosen.isFree,
          mime: chosen.mime,
          width: chosen.width,
          height: chosen.height,
          downloaded: false,
        },
        null,
        2
      )
    );
  } else {
    printChosen(chosen, options);
    if (!options.quiet) printAlternatives(images, chosen);
  }

  if (!options.download) {
    process.exit(0);
  }

  // --- Download mode: fetch the binary and update the manifest. ---
  if (!chosen.isFree) {
    console.error(
      '\nRefusing to download a non-free image. Re-run with a query that ' +
        'surfaces a CC / public-domain image, or choose one manually.'
    );
    process.exit(1);
  }

  const bannersDir = resolve(process.cwd(), BANNERS_DIR);
  await mkdir(bannersDir, { recursive: true });
  const relPath = `img/banners/${options.dataset}.jpg`;
  const outPath = join(bannersDir, `${options.dataset}.jpg`);

  if (chosen.mime !== 'image/jpeg') {
    console.warn(
      `\nNote: source MIME is ${chosen.mime}; saving bytes as ${relPath} ` +
        'to match the repo convention.'
    );
  }

  const bytes = await downloadImage(chosen.imageUrl);
  await writeFile(outPath, bytes);

  const fields: BannerFields = {
    bannerImage: relPath,
    bannerImageLicense: chosen.license,
    bannerImageAttribution: buildAttribution(chosen),
    bannerImageSource: chosen.descriptionUrl || undefined,
  };
  const originalText = await readFile(manifestPath, 'utf-8');
  await writeFile(manifestPath, updateManifestText(originalText, fields), 'utf-8');

  console.log(`\nWrote image:    ${outPath} (${bytes.length} bytes)`);
  console.log(`Updated manifest: ${manifestPath}`);
  console.log(`  bannerImage:            ${fields.bannerImage}`);
  console.log(`  bannerImageLicense:     ${fields.bannerImageLicense}`);
  console.log(`  bannerImageAttribution: ${fields.bannerImageAttribution}`);
  if (fields.bannerImageSource) {
    console.log(`  bannerImageSource:      ${fields.bannerImageSource}`);
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
