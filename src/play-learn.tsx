import { useEffect, useState } from 'react'
import type { ReadingLanguage } from './reading-navigation'
import { brandName } from './brand'

export function PlayLearn({ language }: { language: ReadingLanguage }) {
  const en = language === 'en'
  const [playing, setPlaying] = useState(false)
  const gameUrl = `${import.meta.env.BASE_URL}play/rule-lab/index.html`
  const media = `${import.meta.env.BASE_URL}media/rule-lab/`
  useEffect(() => { document.title = `${en ? 'Play & learn' : '玩着学'} · ${brandName(language)}`; document.getElementById('main-content')?.focus({ preventScroll: true }) }, [language, en])
  useEffect(() => {
    if (playing) document.getElementById('rule-lab-player')?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }, [playing])
  return <main id="main-content" tabIndex={-1} className="play-learn" lang={language}>
    <header className="play-learn__intro"><div><p className="play-feature__eyebrow">{en ? 'Play & learn · Rule Lab' : '玩着学 · 规则试验场'}</p><h1>{en ? 'Start with a hand.\nMake it your game.' : '先出一手，\n再改一条规则。'}</h1><p>{en ? 'You know Rock–Paper–Scissors. Now give rock a new ability, add a hand of cards, or compete for territory. Play your choices and find out how the rules change the game.' : '你已经会石头剪刀布了。现在，给石头一种能力，加入一手卡牌，或让双方争夺据点。亲手玩过，才知道这些规则会怎样改变选择。'}</p>
      {!playing && <button className="play-learn__start" onClick={() => setPlaying(true)}>{en ? 'Play a hand' : '来，先玩一手'} <span aria-hidden="true">→</span></button>}
      <p className="play-learn__note">{en ? 'The game currently uses Chinese. No account needed. Refreshing or leaving this page starts a new game.' : '无需账号。刷新或离开这一页，会回到最初的一手。'}</p></div>
      {!playing && <img className="play-learn__icon" src={`${media}icon.png`} width="280" height="280" alt=""/>}
    </header>
    {playing && <section id="rule-lab-player" className="play-learn__game" aria-label={en ? 'Rule Lab game (Chinese)' : '石头剪刀布游戏'}><div className="play-learn__game-bar"><strong>{en ? 'Your rule experiment' : '你的规则实验'}</strong><a href={gameUrl} target="_blank" rel="noopener noreferrer">{en ? 'New game in a separate tab ↗' : '在新标签页另开一局 ↗'}</a></div><iframe title={en ? 'Rule Lab — Rock–Paper–Scissors (Chinese)' : '规则试验场：石头剪刀布'} src={gameUrl} allow="fullscreen" allowFullScreen /></section>}
    <section className="play-learn__watch"><div><p className="play-feature__eyebrow">{en ? 'Watch it change · 24 seconds' : '24 秒，看看它能变成什么'}</p><h2>{en ? 'Lose the hand.\nWin the territory.' : '输了猜拳，\n也能抢到据点？'}</h2><p>{en ? 'A new rule can change what a win means. This short film follows the game from three familiar gestures to cards, characters, and a fight for position.' : '多一条规则，胜负的意义就可能变了。这段短片从三个熟悉的手势开始，走到功能牌、角色能力和据点争夺。'}</p><p className="play-learn__note">{en ? 'Chinese captions are included in the video. Sound is optional.' : '视频自带中文字幕，关声音也能看。'}</p></div><video controls playsInline preload="none" poster={`${media}poster.png`} aria-label={en ? 'Rule Lab introduction, with Chinese captions' : '石头剪刀布宣传片，含中文字幕'} src={`${media}intro.mp4`}/></section>
    <section className="play-learn__questions"><h2>{en ? 'Take one question into your next game' : '带着一个问题，再玩一次'}</h2><div>{(en ? [
      ['What changed your choice?', 'Compare the first hand with a later one. Which rule made you consider a different move?'],
      ['Which rules work together?', 'Try cards alongside territory. Does a useful combination also create a cost you had not noticed?'],
      ['What would you remove?', 'When rollback becomes available, take one rule out. Does the game become clearer, quicker, or less interesting?']
    ] : [
      ['哪条规则改变了你的出手？', '把第一手和后面的一手放在一起想：你开始考虑什么了？是哪条规则带来的？'],
      ['哪些规则放在一起才有意思？', '把手牌和据点一起试试。一个好用的组合，会不会也带来你没想到的代价？'],
      ['如果去掉一条，会怎样？', '回退功能出现后，撤回一条规则。游戏更清楚了、更快了，还是少了一点值得想的东西？']
    ]).map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div><a href={`#course/reading/race-choices-and-agency/${language}`}>{en ? 'Read next: when does a choice matter? →' : '接着读：什么样的选择值得想？→'}</a></section>
  </main>
}
