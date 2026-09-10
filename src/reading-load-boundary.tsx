import { Component, type ReactNode } from 'react'
import { readingHref, type ReadingLanguage } from './reading-navigation'

type Props = { language: ReadingLanguage; children: ReactNode }

export class ReadingLoadBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    const language = this.props.language
    const t = (zh: string, en: string) => language === 'en' ? en : zh
    return <main id="main-content" tabIndex={-1} className="original-reading">
      <section role="alert">
        <h1>{t('这一页暂时没有打开', 'This page could not be opened')}</h1>
        <p>{t('请重新打开当前链接，或从其他阅读目录继续。', 'Try opening the current link again, or continue from another reading collection.')}</p>
        <button type="button" onClick={() => window.location.reload()}>{t('重新打开', 'Try again')}</button>
      </section>
      <nav className="original-reading__end" aria-label={t('其他阅读入口', 'Other reading collections')}>
        <a href={readingHref('course', undefined, language)}>{t('系统学习', 'Course contents')}</a>
        <a href={readingHref('library', undefined, language)}>{t('机制与主题', 'Mechanisms and themes')}</a>
        <a href={readingHref('cases', undefined, language)}>{t('游戏案例', 'Game cases')}</a>
      </nav>
    </main>
  }
}
