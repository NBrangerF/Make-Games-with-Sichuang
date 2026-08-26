type LearningWorkshopMapProps = {
  onBack: () => void
  onNavigate: (destination: string) => void
  onOpenTool: (toolId: 'experience-intent' | 'redesign') => void
}

export function LearningWorkshopMap({ onBack, onNavigate, onOpenTool }: LearningWorkshopMapProps) {
  return <main className="learning-map learning-workshop" id="main-content" tabIndex={-1}>
    <nav className="learning-node-page__top" aria-label="基础设计工作室导航"><button type="button" onClick={onBack}>← 返回学习首页</button><span>先看 · 多做 · 深做</span></nav>
    <header className="learning-workshop__hero">
      <p className="learning-eyebrow">基础设计工作室</p>
      <h1>先学会看，<br />接着做很多小东西。</h1>
      <p>这不是十二节理论课。每一段都把案例、一个名字、受限练习、真实制作和反馈交替放在一起。</p>
    </header>

    <section className="learning-workshop__stage" aria-labelledby="workshop-stage-one">
      <div className="learning-workshop__stage-heading"><span>阶段 01</span><div><p>先看</p><h2 id="workshop-stage-one">从玩家变成设计观察者</h2></div></div>
      <div className="learning-workshop__unit-grid">
        <article><span>01</span><h3>比较三款短游戏</h3><p>比较人数、互动、时长、随机性和结束方式，不急着判断哪款更好。</p><small>产物：三张比较记录</small></article>
        <article><span>02</span><h3>画一页游戏结构图</h3><p>只标目标、行动、状态、信息、互动和结束，让同一套词可以描述不同游戏。</p><small>产物：一页结构图</small></article>
        <article><span>03</span><h3>追踪一个具体时刻</h3><p>从真实行动开始，追到选择、信息、结果和下一次决定。</p><small>产物：行为—选择—结果链</small><button type="button" onClick={() => onNavigate('observe')}>进入观察实验室 →</button></article>
      </div>
    </section>

    <section className="learning-workshop__stage" aria-labelledby="workshop-stage-two">
      <div className="learning-workshop__stage-heading"><span>阶段 02</span><div><p>多做</p><h2 id="workshop-stage-two">用三个受限挑战建立手感</h2></div></div>
      <div className="learning-workshop__challenge-list">
        <article><span>A</span><div><h3>单一 mechanic 挑战</h3><p>只选一个核心动作，做一款 5—10 分钟、能明确结束的微型游戏。</p><small>重点看：行动怎样改变状态，结果怎样回到下一次决定。</small></div><button type="button" onClick={() => onNavigate('first-tabletop')}>开始挑战</button></article>
        <article><span>B</span><div><h3>体验目标挑战</h3><p>先指定紧张、猜疑、照顾或合作压力，再比较哪些行动可能承载这种体验。</p><small>重点看：体验词有没有变成桌面上可观察的行为。</small></div><button type="button" onClick={() => onOpenTool('experience-intent')}>打开体验意图卡</button></article>
        <article><span>C</span><div><h3>一条规则改造挑战</h3><p>修改一个熟悉游戏的一条规则，先预测行为变化，再把新版和原版放到同一条件下比较。</p><small>重点看：规则变化、行为预测与实际结果有没有接起来。</small></div><button type="button" onClick={() => onOpenTool('redesign')}>打开改造实验</button></article>
      </div>
    </section>

    <section className="learning-workshop__stage learning-workshop__stage--project" aria-labelledby="workshop-stage-three">
      <div className="learning-workshop__stage-heading"><span>阶段 03</span><div><p>深做</p><h2 id="workshop-stage-three">选择一个项目反复测试</h2></div></div>
      <ol>
        <li><strong>设计简报</strong><span>为谁、几个人、多久、什么体验、哪些材料边界？</span></li>
        <li><strong>游戏骨架</strong><span>目标、结束、主要行动和回合结构是什么？</span></li>
        <li><strong>第一版原型</strong><span>最少哪些组件可以完整运行三轮或到达一次结束？</span></li>
        <li><strong>自测与外测</strong><span>先修断裂，再用一个问题收集真实玩家行为。</span></li>
        <li><strong>证据与改版</strong><span>分开观察和解释，让每一版改变都有来处。</span></li>
        <li><strong>后期分支</strong><span>规则稳定后再进入教学测试、盲测、交接或发布。</span></li>
      </ol>
      <button className="learning-primary-action" type="button" onClick={() => onNavigate('iteration')}>进入原型迭代主线</button>
    </section>
  </main>
}
