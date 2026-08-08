// Script de prueba simple para SEO Analyzer
import { SEOAnalyzer } from './services/seoAnalyzer.js';

const analyzer = new SEOAnalyzer('test-api-key');

// Prueba básica
console.log('🧪 Iniciando pruebas SEO Analyzer...');

// Validación de URL
const testURL = 'https://example.com';
console.log(`✅ Validando URL: ${testURL}`);
const isValid = analyzer.validateURL(testURL);
console.log(`Resultado: ${isValid ? 'Válida' : 'Inválida'}`);

// Análisis de contenido de prueba
const mockContent = {
  title: 'Test SEO Title',
  description: 'Test SEO description for testing purposes',
  content: `
    <html>
      <head>
        <title>Test SEO Title</title>
        <meta name="description" content="Test SEO description for testing purposes" />
        <meta name="keywords" content="seo, test, analyzer" />
        <link rel="canonical" href="https://example.com/canonical" />
      </head>
      <body>
        <h1>Main Title</h1>
        <h2>Subtitle</h2>
        <p>This is test content with some keywords for SEO analysis.</p>
        <img src="image.jpg" alt="test image" />
        <a href="internal-link">Internal Link</a>
        <a href="https://external.com">External Link</a>
      </body>
    </html>
  `
};

console.log('\n📊 Analizando contenido de prueba...');
const basicInfo = analyzer.analyzeBasicInfo(mockContent);
console.log('Información básica:', basicInfo);

const technicalSEO = analyzer.analyzeTechnicalSEO(mockContent);
console.log('SEO técnico:', technicalSEO);

const onPageSEO = analyzer.analyzeOnPageSEO(mockContent);
console.log('SEO On-Page:', onPageSEO);

console.log('\n✅ Pruebas completadas exitosamente!');