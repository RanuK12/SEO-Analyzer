import { analyzeSEO } from './services/seoAnalyzer.js';

const url = 'https://example.com';

async function run() {
  const report = await analyzeSEO(url);
  const isHttps = url.startsWith('https://') ? 'Yes' : 'No';
  
  console.log(`\nSEO Report for ${url}:
---------------------------\n`);
  console.log(`HTTPS: ${isHttps}`);
  console.log(`Title: ${report.title || 'N/A'}`);
  console.log(`Meta Description: ${report.metaDescription || 'Missing'}`);
  console.log(`Headings: ${report.headings?.join(', ') || 'None'}`);
  console.log(`Links: ${report.links?.join(', ') || 'None'}`);
  console.log(`Word Count: ${report.wordsCount || 0}`);
  
  if (report.screenshots?.length > 0) {
    console.log('\nScreenshots:');
    report.screenshots.forEach((screenshot, index) => {
      console.log(`  ${index + 1}: ${screenshot}`);
    });
  }
});

run();