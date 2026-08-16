import { analyzeSEO } from './services/seoAnalyzer.js';

const url = 'https://example.com';

async function run() {
  const report = await analyzeSEO(url);
  console.log('SEO Report:', report);
}

run();