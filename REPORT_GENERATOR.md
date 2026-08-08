# Generador de Reportes SEO

Este documento describe el sistema de generación de reportes para el SEO Analyzer.

## Formatos de Reporte Disponibles

### 1. Formato JSON
```json
{
  "url": "https://example.com",
  "timestamp": "2026-08-08T12:00:00Z",
  "basicInfo": {
    "title": "Título de la página",
    "description": "Descripción meta",
    "wordCount": 1500
  },
  "technicalSEO": {
    "hasSSL": true,
    "hasCanonical": true,
    "hasStructuredData": false
  },
  "recommendations": [
    {
      "type": "title",
      "priority": "high",
      "message": "El título debe tener entre 30-60 caracteres"
    }
  ]
}
```

### 2. Formato HTML
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Reporte SEO - https://example.com</title>
    <style>
        /* Estilos del reporte */
    </style>
</head>
<body>
    <h1>Reporte SEO</h1>
    <section class="basic-info">
        <h2>Información Básica</h2>
        <p><strong>Título:</strong> Título de la página</p>
        <p><strong>Descripción:</strong> Descripción meta</p>
    </section>
</body>
</html>
```

### 3. Formato PDF
El reporte PDF se genera usando Puppeteer y contiene:
- Portada con información del análisis
- Resumen ejecutivo
- Detalles técnicos
- Recomendaciones
- Gráficos de rendimiento

## API de Reportes

### Obtener reporte JSON
```bash
curl -X GET http://localhost:3000/api/report/{analysisId}
```

### Generar reporte HTML
```bash
curl -X POST http://localhost:3000/api/report/html \
  -H "Content-Type: application/json" \
  -d '{"analysisId": "id-del-analisis"}'
```

### Generar reporte PDF
```bash
curl -X POST http://localhost:3000/api/report/pdf \
  -H "Content-Type: application/json" \
  -d '{"analysisId": "id-del-analisis"}'
```

## Precios de Reportes

| Tipo de Análisis | Precio | Detalles |
|------------------|--------|----------|
| Básico (JSON) | $15 | Análisis básico de SEO |
| Completo (HTML+PDF) | $45 | Análisis completo con reportes visuales |
| Auditoría Mensual | $120 | Análisis mensual con seguimiento |

## Integración con otros servicios

### Firecrawl-ecom-scraper
El sistema utiliza Firecrawl para obtener el contenido de las páginas web:
- Extracción de contenido HTML
- Análisis de meta tags
- Obtención de imágenes y enlaces
- Medición de tiempos de carga

### APIs Adicionales
- Google PageSpeed Insights para métricas de rendimiento
- Structured Data Testing Tool para datos estructurados
- Google Search Console API para datos de indexación

## Personalización de Reportes

Los reportes pueden ser personalizados con:
- Logo de la empresa
- Colores corporativos
- Métricas específicas
- Formatos personalizados
- Idiomas múltiples