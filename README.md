# SEO Analyzer - Ranuk IT Solutions

Análizador SEO profesional con Firecrawl-ecom-scraper para microservicios. Herramienta comercializable para análisis de páginas web y generación de reportes SEO optimizados.

## Características

- Análisis completo de SEO On-Page
- Integración con Firecrawl-ecom-scraper
- Generación de reportes en múltiples formatos (JSON, HTML, PDF)
- API RESTful para integración
- Interfaz web intuitiva
- Validación técnica avanzada
- Métricas de rendimiento y SEO

## Instalación

```bash
npm install
cp .env.example .env
# Configurar FIRECRAWL_API_KEY
npm start
```

## Uso

```bash
# Análisis de URL
curl -X POST http://localhost:3000/api/analyze -H "Content-Type: application/json" -d '{"url": "https://example.com"}'

# Obtener reporte
curl http://localhost:3000/api/report/{analysisId}
```

## Servicios Disponibles

- Análisis técnico SEO
- Auditoría de contenido
- Verificación de meta tags
- Análisis de estructura semántica
- Generación de reportes personalizados
- Recomendaciones de optimización

## Precios

- Análisis básico: $15
- Análisis completo: $45
- Auditoría mensual: $120

## Licencia

MIT - Ranuk IT Solutions