import type { ReadingLanguage } from './reading-navigation'

export function PlayLearnFeature({ language }: { language: ReadingLanguage }) {
  const en = language === 'en'
  return <a className="play-feature" href={`#play/${language}`}>
    <img src={`${import.meta.env.BASE_URL}media/rule-lab/icon.png`} width="144" height="144" alt="" loading="lazy"/>
    <div><span className="play-feature__eyebrow">{en ? 'A game for learning game design' : '一个学习游戏设计的游戏'}</span><h2>{en ? 'Rock. Paper. Scissors. What would you change?' : '石头剪刀布，还能这样玩？'}</h2><p>{en ? 'Play a hand, add a rule, and see what happens. Give a familiar game a life of its own.' : '先出一手，再改一条规则。加入角色、手牌和据点，看看熟悉的猜拳会变成什么。'}</p><strong>{en ? 'Try Rule Lab' : '去玩石头剪刀布'} <span aria-hidden="true">↗</span></strong></div>
  </a>
}
