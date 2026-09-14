import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Verify the actual article renderer, including placement, translations, and worksheet coexistence.
const server = await createServer({ configFile: false, plugins: [react()], server: { middlewareMode: true }, appType: 'custom' })
try {
  const { articleFigures } = await server.ssrLoadModule('/src/article-figure-catalog.ts')
  const { ArticleFigure } = await server.ssrLoadModule('/src/article-figures.tsx')
  const { MarkdownReading } = await server.ssrLoadModule('/src/markdown-reading.tsx')
  for (const [article, figure] of Object.entries(articleFigures)) for (const language of ['zh-CN', 'en']) {
    const source = fs.readFileSync(`content/original-articles/${article}/${language}.md`, 'utf8')
    const heading = figure.after[language]
    assert.equal(source.split(`## ${heading}\n`).length, 2, `${article}/${language}: section must exist exactly once`)
    const html = renderToStaticMarkup(createElement(MarkdownReading, { source, language,
      afterSection: { number: 2, node: createElement('aside', { 'data-worksheet': 'retained' }, 'worksheet') },
      sectionInserts: { [heading]: createElement(ArticleFigure, { kind: figure.kind, language }) },
    }))
    assert.equal((html.match(/class="article-figure"/g) || []).length, 1, `${article}/${language}: exactly one figure`)
    assert.ok(html.includes('data-worksheet="retained"'), 'Existing contextual worksheet remains')
    const figureStart = html.indexOf('class="article-figure"')
    const sectionEnds = source.split(`## ${heading}\n`)[1].split('\n## ')[0].trim()
    // The figure must follow the prose, rather than appearing immediately below the heading.
    const lastParagraph = sectionEnds.split('\n\n').at(-1)
    const lastText = lastParagraph.replace(/\*\*/g, '').slice(0, 24).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;')
    assert.ok(html.indexOf(lastText) >= 0 && html.indexOf(lastText) < figureStart, `${article}/${language}: figure follows its section`)
    assert.ok(html.includes('aria-live="polite"'), 'Result changes announced')
    if (language === 'en') assert.doesNotMatch(html.slice(figureStart, html.indexOf('</figure>', figureStart)), /[\u4e00-\u9fff]/, 'English diagram contains no Chinese labels')
  }
  const ending = renderToStaticMarkup(createElement(MarkdownReading, { source: '## Last\n\nFinal paragraph.', sectionInserts: { Last: createElement('figure', null, 'At end') } }))
  assert.ok(ending.endsWith('<figure>At end</figure>'), 'Last-section insertion is not lost')
  console.log(`Article figures PASS: ${Object.keys(articleFigures).length} figures × 2 languages, section placement, worksheet coexistence, result announcements, last-section insertion.`)
} finally { await server.close() }
