import { Fragment, type ReactNode } from 'react'
import { readingSourceHref } from './reading-links'

type MarkdownReadingProps = {
  source: string
  allowSourceLinks?: boolean
  language?: 'zh-CN' | 'en'
  afterSection?: { number: number; node: ReactNode }
  headingIds?: Record<string, string>
}

export type MarkdownOutlineItem = Readonly<{
  id: string
  label: string
  level: number
}>

const blockStart = /^(#{1,4}\s|[-*]\s|\d+\.\s|>\s?|\|)/

function renderInline(source: string, keyPrefix: string, allowSourceLinks = false): ReactNode[] {
  const token = /(!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g
  const nodes: ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = token.exec(source))) {
    if (match.index > cursor) nodes.push(source.slice(cursor, match.index))
    const key = `${keyPrefix}-${match.index}`
    if (match[2] !== undefined && match[3]) {
      nodes.push(<span className="reading-image-reference" role="note" title={`原图地址：${match[3]}`} key={key}>图示：{match[2] || '原文配图'}（本页不加载外部图片）</span>)
    } else if (match[4] && match[5]) {
      const href = readingSourceHref(match[5], import.meta.env.BASE_URL, allowSourceLinks)
      nodes.push(href
        ? <a className="reading-source-reference" href={href} rel="noreferrer" key={key}>{match[4]}</a>
        : <span className="reading-source-reference" title={`原链接：${match[5]}`} key={key}>{match[4]}</span>)
    } else if (match[6]) {
      nodes.push(<strong key={key}>{match[6]}</strong>)
    } else if (match[7]) {
      nodes.push(<em key={key}>{match[7]}</em>)
    } else if (match[8]) {
      nodes.push(<code key={key}>{match[8]}</code>)
    }
    cursor = match.index + match[0].length
  }

  if (cursor < source.length) nodes.push(source.slice(cursor))
  return nodes
}

function stripFrontmatter(source: string) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
}

function plainHeadingLabel(source: string) {
  return source
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .trim()
}

function headingId(lineIndex: number) {
  return `reading-section-${lineIndex}`
}

export function extractMarkdownOutline(source: string): MarkdownOutlineItem[] {
  return stripFrontmatter(source).split(/\r?\n/).flatMap((line, lineIndex) => {
    const heading = /^(#{1,4})\s+(.+)$/.exec(line)
    if (!heading) return []
    return [{ id: headingId(lineIndex), label: plainHeadingLabel(heading[2]), level: heading[1].length }]
  })
}

function isTableDivider(line: string) {
  return /^\|(?:\s*:?-+:?\s*\|)+$/.test(line.trim())
}

function tableCells(line: string) {
  return line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim())
}

export function MarkdownReading({ source, allowSourceLinks = false, language = 'zh-CN', afterSection, headingIds }: MarkdownReadingProps) {
  const inline = (text: string, key: string) => renderInline(text, key, allowSourceLinks)
  const lines = stripFrontmatter(source).split(/\r?\n/)
  const blocks: ReactNode[] = []
  let index = 0
  let section = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
      continue
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line)
    if (heading) {
      const level = heading[1].length
      if (level === 2) {
        if (afterSection?.number === section) blocks.push(<Fragment key="contextual-support">{afterSection.node}</Fragment>)
        section += 1
      }
      const content = inline(heading[2], `heading-${index}`)
      const id = headingIds?.[heading[2]] || headingId(index)
      const tabIndex = headingIds?.[heading[2]] ? -1 : undefined
      if (level === 1) blocks.push(<h1 id={id} key={`heading-${index}`}>{content}</h1>)
      else if (level === 2) blocks.push(<h2 id={id} tabIndex={tabIndex} key={`heading-${index}`}>{content}</h2>)
      else if (level === 3) blocks.push(<h3 id={id} key={`heading-${index}`}>{content}</h3>)
      else blocks.push(<h4 id={id} key={`heading-${index}`}>{content}</h4>)
      index += 1
      continue
    }

    if (line.startsWith('>')) {
      const quote: string[] = []
      while (index < lines.length && lines[index].startsWith('>')) {
        quote.push(lines[index].replace(/^>\s?/, ''))
        index += 1
      }
      blocks.push(<blockquote key={`quote-${index}`}>{inline(quote.join(' '), `quote-${index}`)}</blockquote>)
      continue
    }

    const unordered = /^[-*]\s+/.test(line)
    const ordered = /^\d+\.\s+/.test(line)
    if (unordered || ordered) {
      const items: ReactNode[] = []
      const pattern = unordered ? /^[-*]\s+(.+)$/ : /^\d+\.\s+(.+)$/
      while (index < lines.length) {
        const item = pattern.exec(lines[index])
        if (!item) break
        items.push(<li key={`item-${index}`}>{inline(item[1], `item-${index}`)}</li>)
        index += 1
      }
      blocks.push(ordered ? <ol key={`list-${index}`}>{items}</ol> : <ul key={`list-${index}`}>{items}</ul>)
      continue
    }

    if (line.trim().startsWith('|') && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const header = tableCells(line)
      index += 2
      const rows: string[][] = []
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rows.push(tableCells(lines[index]))
        index += 1
      }
      blocks.push(
        <div className="reading-table-wrap" tabIndex={0} role="region" aria-label={language === 'en' ? 'Data table; scroll horizontally if needed' : '数据表格，可按需左右滚动'} key={`table-${index}`}>
          <table>
            <thead><tr>{header.map((cell, cellIndex) => <th scope="col" key={`head-${cellIndex}`}>{inline(cell, `head-${cellIndex}`)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={`row-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`cell-${rowIndex}-${cellIndex}`}>{inline(cell, `cell-${rowIndex}-${cellIndex}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      )
      continue
    }

    if (/^_{3,}$|^-{3,}$|^\*{3,}$/.test(line.trim())) {
      blocks.push(<hr key={`rule-${index}`} />)
      index += 1
      continue
    }

    const paragraph = [line.trim()]
    index += 1
    while (index < lines.length && lines[index].trim() && !blockStart.test(lines[index]) && !/^_{3,}$|^-{3,}$|^\*{3,}$/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push(<p key={`paragraph-${index}`}>{inline(paragraph.join(' '), `paragraph-${index}`)}</p>)
  }

  if (afterSection?.number === section) blocks.push(<Fragment key="contextual-support">{afterSection.node}</Fragment>)
  return <>{blocks.map((block, blockIndex) => <Fragment key={`block-${blockIndex}`}>{block}</Fragment>)}</>
}
