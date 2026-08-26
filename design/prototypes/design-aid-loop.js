(() => {
  const prompts = [
    '把一项原本公开的信息改成只能通过询问另一名玩家获得，并写清不回答时会发生什么。',
    '暂时删掉一个玩家每回合都必须做的步骤，观察哪个决定因此变得更清楚。',
    '让一名玩家获得资源时，也改变另一名玩家下一回合的可选行动。',
    '把一个数字状态改成摆放、翻转或移动的实体动作，再检查动作是否真的传达关系。'
  ]

  const stepCopy = [
    ['先决定桌上要多出什么', '不需要先认识任何工具名称。只选这轮结束时要带走的产物。', '选择本轮产出'],
    ['先写不能被覆盖的边界', '玩家、体验、时限和硬约束先于任何随机提示。', '写下边界'],
    ['提示可拒绝，也可自己写', '拒绝不合适的提示是设计判断，不是失败。', '选择临时提示'],
    ['让提示离开灵感层', '只有能被玩家执行、能在桌面产生后果的文字才算规则产物。', '生成规则产物'],
    ['给自己的判断留下反例', '预测只定义要观察什么；它不会自动变成结论。', '写行为预测'],
    ['如实标记证据状态', '准备、自测和外部测试分别保存，不能相互冒充。', '选择测试证据'],
    ['观察、解释与私密反思分开', '只分享你主动确认的项目字段。反思默认私有。', '记录与分享'],
    ['结束这一轮，不宣布胜利', '完成流程不等于验证设计；记录只为下一次测试服务。', '完成记录']
  ]

  const modeFields = {
    generate: {
      lead: '写出一个玩家动作、一项直接后果，以及它为何可能服务目标体验。只有题材或机制名称不能继续。',
      fields: [
        ['playerAction', '玩家实际做什么', '例如：玩家在每轮开始时把一张订单交给另一名玩家处理'],
        ['directConsequence', '桌面上直接发生什么', '例如：接收者本轮只能在这张订单或自己的订单中完成一张'],
        ['experienceLink', '它为何可能服务目标体验', '不要写“更有趣”；写它怎样改变决定或互动']
      ]
    },
    diagnose: {
      lead: '把评价改写成局面与可观察动作。本轮要得到一个诊断问题，不需要证明游戏整体好不好。',
      fields: [
        ['currentSymptom', '当前症状', '例如：玩家说等待时间很长'],
        ['situation', '它发生在什么局面', '例如：四人局中，一名玩家结算连锁效果时'],
        ['observableAction', '下一次要观察什么动作', '例如：等待者何时停止查看公共区域，转而做别的事'],
        ['artifactCounterSignal', '什么现象会反驳当前解释', '例如：动作数量减少后，等待者仍在同一时刻脱离注意']
      ]
    },
    prototype: {
      lead: '把想法缩成能运行的短规则。写清开局、每回合动作、结束和最低组件。',
      fields: [
        ['setup', '怎样开局', '只写本轮问题需要的状态'],
        ['turn', '每回合可以做什么', '写成陌生玩家可以执行的动作'],
        ['end', '何时结束', '例如：目标决定出现三次后立即停止'],
        ['components', '最低组件', '例如：12 张纸牌、8 个方块、1 张记录纸']
      ]
    },
    practice_loop: {
      lead: '写出这次局部测试真正需要的开局、回合、结束与查询规则。',
      fields: [
        ['setup', '开局', '测试开始时桌面上必须有什么'],
        ['turn', '回合', '轮到玩家时可以执行什么'],
        ['end', '结束', '何时停止这段测试'],
        ['lookup', '查询', '遇到疑问时玩家可以查看哪里']
      ]
    }
  }

  const state = {
    step: 0,
    mode: '',
    promptIndex: 0,
    swapCount: 0,
    chosenPrompt: '',
    evidenceStatus: '',
    artifact: {}
  }

  const $ = id => document.getElementById(id)
  const screens = [...document.querySelectorAll('.screen')]
  const error = $('error')
  const value = id => ($(id)?.value || '').trim()
  const escapeHtml = text => String(text).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char])

  function setError(message, focusId) {
    error.textContent = message
    if (focusId) $(focusId)?.focus()
  }

  function clearError() { error.textContent = '' }

  function updateChrome() {
    const [title, text, name] = stepCopy[state.step]
    screens.forEach((screen, index) => { screen.hidden = index !== state.step })
    $('contextTitle').textContent = title
    $('contextText').textContent = text
    $('progressName').textContent = name
    $('progressLabel').textContent = `第 ${state.step + 1} / 8 步`
    $('stepNumber').textContent = `${String(state.step + 1).padStart(2, '0')} / 08`
    $('progressBar').style.width = `${((state.step + 1) / 8) * 100}%`
    $('back').hidden = state.step === 0 || state.step === 7
    $('next').hidden = state.step === 2 || state.step === 7
    $('next').textContent = state.step === 6 ? '完成本轮记录' : '继续'
    const labels = { preparation: '练习准备', self_test: '自测', external_test: '外部测试' }
    $('evidenceChip').textContent = `证据状态：${labels[state.evidenceStatus] || '练习准备'}`
    clearError()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function renderArtifactFields() {
    const config = modeFields[state.mode]
    $('artifactLead').textContent = config.lead
    $('artifactFields').innerHTML = config.fields.map(([id, label, placeholder]) => `
      <label class="field"><span>${label} <em>必填</em></span><textarea id="${id}" data-artifact-field="${id}" placeholder="${placeholder}">${escapeHtml(state.artifact[id] || '')}</textarea></label>
    `).join('')
  }

  function collectArtifact() {
    document.querySelectorAll('[data-artifact-field]').forEach(field => {
      state.artifact[field.dataset.artifactField] = field.value.trim()
    })
  }

  function validateStep() {
    clearError()
    if (state.step === 0) {
      const selected = document.querySelector('input[name="desiredOutput"]:checked')
      if (!selected) { setError('请先选择这轮希望得到的产物。'); return false }
      state.mode = selected.value
      renderArtifactFields()
    }
    if (state.step === 1) {
      const required = [['targetPlayers', '请写下目标玩家。'], ['experienceIntent', '请写下目标体验。'], ['timebox', '请写下本轮时限。']]
      for (const [id, message] of required) {
        if (!value(id)) { setError(message, id); return false }
      }
    }
    if (state.step === 3) {
      collectArtifact()
      const missing = [...document.querySelectorAll('[data-artifact-field]')].find(field => !field.value.trim())
      if (missing) {
        setError('题材或机制名称还不能进入测试。请把每一项写成可执行、可观察的产物。', missing.id)
        return false
      }
    }
    if (state.step === 4) {
      if (!value('supportingSignal')) { setError('请先写一个可观察的支持信号。', 'supportingSignal'); return false }
      if (!value('counterSignal')) { setError('请再写一个可能反驳当前判断的信号。', 'counterSignal'); return false }
    }
    if (state.step === 5) {
      const selected = document.querySelector('input[name="evidenceStatus"]:checked')
      if (!selected) { setError('请如实选择这轮实际拥有的证据状态。'); return false }
      state.evidenceStatus = selected.value
    }
    if (state.step === 6 && !value('nextSingleChange')) {
      setError('请写下下一版只改什么。反思和观察可以跳过。', 'nextSingleChange')
      return false
    }
    return true
  }

  $('next').addEventListener('click', () => {
    if (!validateStep()) return
    state.step += 1
    updateChrome()
  })

  $('back').addEventListener('click', () => {
    if (state.step === 3) collectArtifact()
    state.step = Math.max(0, state.step - 1)
    updateChrome()
  })

  $('keepPrompt').addEventListener('click', () => {
    state.chosenPrompt = prompts[state.promptIndex]
    $('promptStatus').hidden = false
    $('promptStatus').dataset.tone = 'safe'
    $('promptStatus').innerHTML = '<strong>已保留这张提示</strong>下一步要把它写成规则或可观察问题；提示本身不会进入测试结论。'
    setTimeout(() => { state.step = 3; updateChrome() }, 120)
  })

  $('swapPrompt').addEventListener('click', () => {
    state.swapCount += 1
    state.promptIndex = (state.promptIndex + 1) % prompts.length
    $('promptText').textContent = prompts[state.promptIndex]
    if (state.swapCount >= 3) $('swapHelp').hidden = false
    $('promptStatus').hidden = false
    $('promptStatus').dataset.tone = 'warning'
    $('promptStatus').innerHTML = `<strong>已拒绝 ${state.swapCount} 张提示</strong>拒绝不会失分；你也不需要写理由。`
  })

  $('writePrompt').addEventListener('click', () => {
    $('selfPromptBox').hidden = false
    $('selfPrompt').focus()
  })

  $('useSelfPrompt').addEventListener('click', () => {
    if (!value('selfPrompt')) { setError('请先写下你的临时提示。', 'selfPrompt'); return }
    state.chosenPrompt = value('selfPrompt')
    state.step = 3
    updateChrome()
  })

  document.querySelectorAll('input[name="evidenceStatus"]').forEach(input => {
    input.addEventListener('change', () => {
      state.evidenceStatus = input.value
      const copy = {
        preparation: ['本轮是测试准备', '你可以保存未来参与者条件，但这轮没有运行，因此没有玩家行为证据。'],
        self_test: ['本轮是自测', '自测可以发现规则断点和操作问题，但不能验证目标玩家的体验，也不会生成模拟玩家反馈。'],
        external_test: ['本轮是外部测试', '只记录实际观察到的动作与原话；参与者的喜欢或赞成不自动等于设计有效。']
      }[input.value]
      $('evidenceBoundary').hidden = false
      $('evidenceBoundary').innerHTML = `<h3>${copy[0]}</h3><p>${copy[1]}</p>`
      $('evidenceChip').textContent = `证据状态：${{ preparation: '练习准备', self_test: '自测', external_test: '外部测试' }[input.value]}`
    })
  })

  function renderSharePreview() {
    collectArtifact()
    const desired = document.querySelector('input[name="desiredOutput"]:checked')?.closest('.choice')?.querySelector('strong')?.textContent || ''
    const evidence = { preparation: '练习准备', self_test: '自测（不等于玩家体验证据）', external_test: '外部测试' }[state.evidenceStatus] || '未选择'
    const fields = [
      ['本轮产出', desired],
      ['目标玩家', value('targetPlayers')],
      ['目标体验', value('experienceIntent')],
      ['规则产物', Object.values(state.artifact).filter(Boolean).join(' / ')],
      ['支持信号', value('supportingSignal')],
      ['反例信号', value('counterSignal')],
      ['证据状态', evidence],
      ['实际观察', value('observedActions') || '本轮未记录'],
      ['下一改动', value('nextSingleChange') || '尚未填写']
    ]
    $('shareFields').innerHTML = fields.map(([term, description]) => `<div><dt>${term}</dt><dd>${escapeHtml(description)}</dd></div>`).join('')
    $('sharePreview').hidden = false
  }

  $('previewShare').addEventListener('click', renderSharePreview)
  $('deleteReflection').addEventListener('click', () => {
    $('privateReflection').value = ''
    $('reflectionStatus').textContent = '私有反思已删除；规则、预测、证据状态和下一改动仍保留。'
  })
  $('restart').addEventListener('click', () => window.location.reload())

  updateChrome()
})()
