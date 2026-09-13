import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { TranslateIcon } from '@phosphor-icons/react/dist/csr/Translate'
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check'
import { CaretDownIcon } from '@phosphor-icons/react/dist/csr/CaretDown'
import { BookOpenIcon } from '@phosphor-icons/react/dist/csr/BookOpen'
import { CardsIcon } from '@phosphor-icons/react/dist/csr/Cards'
import { StackIcon } from '@phosphor-icons/react/dist/csr/Stack'
import { PencilRulerIcon } from '@phosphor-icons/react/dist/csr/PencilRuler'
import { animate } from 'motion/mini'
import { useEffect, useRef } from 'react'
import type { ReadingLanguage } from './reading-navigation'

export const navigationIcons = { course: BookOpenIcon, cases: CardsIcon, library: StackIcon, workbench: PencilRulerIcon }

export function ActiveNavigationMark() {
  const mark = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!mark.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const animation = animate(mark.current, { opacity: [0.5, 1], transform: ['scaleX(.65)', 'scaleX(1)'] }, { duration: .18, ease: 'easeOut' })
    return () => animation.stop()
  }, [])
  return <span ref={mark} className="studio-nav-mark" aria-hidden="true" />
}

export function LanguageSwitch({ language, onChange }: { language: ReadingLanguage; onChange: (language: ReadingLanguage) => void }) {
  return <DropdownMenu.Root>
    <DropdownMenu.Trigger className="language-switch" aria-label={language === 'en' ? 'Change language · 中文 / English' : '切换语言 · 中文 / English'}>
      <TranslateIcon size={22} weight="bold" aria-hidden="true" />
      <span lang="zh-CN" className={language === 'zh-CN' ? 'is-current' : ''}>中文</span><span className="language-switch__divider" aria-hidden="true">/</span><span lang="en" className={language === 'en' ? 'is-current' : ''}>EN</span>
      <CaretDownIcon size={12} aria-hidden="true" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="language-menu" align="end" sideOffset={9} collisionPadding={12}>
        <DropdownMenu.Label className="language-menu__label">{language === 'en' ? 'Reading language' : '选择语言'}</DropdownMenu.Label>
        <DropdownMenu.RadioGroup value={language} onValueChange={value => { if (value === 'en' || value === 'zh-CN') onChange(value) }}>
          {(['zh-CN', 'en'] as const).map(value => <DropdownMenu.RadioItem key={value} value={value} className="language-menu__item" lang={value}>
            <span>{value === 'en' ? 'English' : '简体中文'}</span><span className="language-menu__check"><DropdownMenu.ItemIndicator><CheckIcon size={18} weight="bold" aria-hidden="true" /></DropdownMenu.ItemIndicator></span>
          </DropdownMenu.RadioItem>)}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
}
