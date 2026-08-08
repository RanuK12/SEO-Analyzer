import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { SEOAnalyzer } from './services/seoAnalyzer.js';
import logger from './utils/logger.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Inicializar analizador SEO
const seoAnalyzer = new SEOAnalyzer(firecrawlApiKey);

// Rutas de la API
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'SEO Analyzer',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        error: 'URL es requerida',
        message: 'Por favor proporciona una URL para analizar'
      });
    }
    
    logger.info(`Solicitud de análisis para: ${url}`);
    
    const analysis = await seoAnalyzer.analyzeURL(url);
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`Error en análisis: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/report/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;
    const analysis = seoAnalyzer.results[analysisId];
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Análisis no encontrado',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`Error al obtener reporte: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/recommendations/:url', async (req, res) => {
  try {
    const { url } = req.params;
    const analysis = await seoAnalyzer.analyzeURL(url);
    
    res.json({
      success: true,
      data: {
        url: url,
        recommendations: analysis.recommendations,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    logger.error(`Error al obtener recomendaciones: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`SEO Analyzer iniciado en puerto ${PORT}`);
  console.log(`🚀 SEO Analyzer - Ranuk IT Solutions`);
  console.log(`📊 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`🔍 Endpoints disponibles:`);
  console.log(`   - GET /health - Estado del servicio`);
  console.log(`   - POST /api/analyze - Analizar URL`);
  console.log(`   - GET /api/report/:analysisId - Obtener reporte`);
  console.log(`   - GET /api/recommendations/:url - Obtener recomendaciones`);
});

export default app;