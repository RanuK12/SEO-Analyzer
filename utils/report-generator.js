// utils/report-generator.js
const fs = require('fs');
const path = require('path');

function generateHTMLReport(seoData) {
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const recommendations = {
        metaDescription: seoData.metaDescription === 'No meta description' ? `
        <div class="recommendation">
            <h3>Critical Issues</h3>
            <ol>
                <li>
                    <strong>Add a Meta Description:</strong>
                    <p>The page is missing a meta description, which is crucial for SEO. Write a compelling description (50-160 characters) that summarizes the page content and includes relevant keywords.</p>
                </li>
            </ol>
        </div>` : '',
        
        wordCount: seoData.wordsCount < 300 ? `
        <div class="recommendation">
            <p><strong>Recommendation:</strong> For better SEO performance, aim for at least 300 words of high-quality content.</p>
        </div>` : '',
        
        headings: seoData.headings.length <= 1 ? `
        <div class="recommendation">
            <p><strong>Note:</strong> Consider adding subheadings (H2-H6) to improve content structure.</p>
        </div>` : ''
    };

    const linksList = seoData.links.map(link => `
        <tr>
            <td><a href="${link}" target="_blank">${link}</a></td>
            <td>${link.includes(seoData.url.split('/')[2]) ? 'Internal' : 'External'}</td>
        </tr>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Audit Report - ${seoData.url}</title>
    <style>
        body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:1000px;margin:0 auto;padding:20px}
        header{background:#2c3e50;color:#fff;padding:20px;border-radius:5px;margin-bottom:30px}
        h1,h2,h3{color:#2c3e50}
        .section{background:#f9f9f9;padding:20px;border-radius:5px;margin-bottom:20px;box-shadow:0 2px 5px rgba(0,0,0,0.1)}
        .recommendation{background:#fff8e1;border-left:4px solid #ffc107;padding:15px;margin:15px 0}
        .good{color:#27ae60}.critical{color:#e74c3c}
        table{width:100%;border-collapse:collapse;margin:15px 0}
        th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd}
        th{background:#f2f2f2}
    </style>
</head>
<body>
    <header>
        <h1>SEO Audit Report</h1>
        <p>Website: <a href="${seoData.url}" target="_blank">${seoData.url}</a></p>
        <p>Audit Date: ${date}</p>
    </header>

    <div class="section">
        <h2>1. Basic SEO Information</h2>
        <table>
            <tr><th>Metric</th><th>Value</th><th>Status</th></tr>
            <tr>
                <td>Page Title</td>
                <td>"${seoData.title}"</td>
                <td class="${seoData.title.length >= 5 && seoData.title.length <= 70 ? 'good' : 'critical'}">
                    ${seoData.title.length >= 5 && seoData.title.length <= 70 ? '✓ Good' : '✗ Needs improvement'}
                </td>
            </tr>
            <tr>
                <td>Meta Description</td>
                <td>"${seoData.metaDescription}"</td>
                <td class="${seoData.metaDescription === 'No meta description' ? 'critical' : 'good'}">
                    ${seoData.metaDescription === 'No meta description' ? '✗ Missing' : '✓ Present'}
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>2. Content Analysis</h2>
        <h3>Headings Structure</h3>
        <p>The page contains the following headings:</p>
        <ul>
            ${seoData.headings.map(heading => `<li><strong>H1:</strong> ${heading}</li>`).join('')}
        </ul>
        ${recommendations.headings}

        <h3>Word Count</h3>
        <p>The page contains <strong>${seoData.wordsCount} words</strong> in the main content area.</p>
        ${recommendations.wordCount}
    </div>

    <div class="section">
        <h2>3. Link Check</h2>
        <p>The page contains the following links:</p>
        <table>
            <tr><th>URL</th><th>Type</th></tr>
            ${linksList}
        </table>
    </div>

    <div class="section">
        <h2>4. Recommendations</h2>
        ${recommendations.metaDescription}
        <div class="recommendation">
            <h3>Improvement Opportunities</h3>
            <ol>
                <li>Add relevant internal links to improve site navigation.</li>
                <li>Add visual content (images, videos) with descriptive alt text.</li>
            </ol>
        </div>
    </div>

    <div class="section">
        <h2>5. Visual Representation</h2>
        <p>${seoData.screenshots.length > 0 ? 'Screenshots were captured during this audit.' : 'No screenshots were provided with this audit.'}</p>
    </div>

    <footer>
        <p>SEO Audit Report generated automatically.</p>
    </footer>
</body>
</html>`;

    return html;
}

function saveReport(seoData, outputPath) {
    const html = generateHTMLReport(seoData);
    fs.writeFileSync(outputPath, html);
    return outputPath;
}

module.exports = { generateHTMLReport, saveReport };
