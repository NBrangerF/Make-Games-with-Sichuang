import { type FormEvent, useEffect, useState } from 'react'
import { PRODUCTION_LEDGER_STORAGE_KEY } from './storage-keys'
import { brandedDownloadName } from './brand'

type DeliveryRoute = '投出版社' | '免费 PnP' | '小批/POD' | '自出版大货' | '众筹履约' | '其他'
type ProductionEvidenceState = '未知' | '设计者粗估' | '目录/计算器' | '供应商书面报价' | '样品/发票/实测'
type CostScope = '工厂生产范围' | '落地到仓范围' | '项目全成本范围' | '暂未确定'
type ValidationGate = '早期规格' | '文件/印前' | '组件/材料样' | '产前样 PPC' | '量产样 MPC' | '入库/抽检'
type ProductionComponent = {
  id: string
  name: string
  quantity: string
  specification: string
  playerFunction: string
  alternativeAndRetest: string
  evidenceState: ProductionEvidenceState
}
type ProductionLedger = {
  id: string
  version: string
  route: DeliveryRoute
  decision: string
  regionAndQuantity: string
  components: ProductionComponent[]
  currencyAndAmount: string
  costScope: CostScope
  costEvidenceState: ProductionEvidenceState
  costSourceAndDate: string
  included: string
  excluded: string
  packoutTask: string
  packedMeasurement: string
  validationGate: ValidationGate
  validationTask: string
  expectedResult: string
  actualResult: string
  approverAndUncoveredRisk: string
  accessibilityRetest: string
  environmentalAssumption: string
  biggestUnknown: string
  nextEvidence: string
  createdAt: string
}

function ArrowIcon() {
  return <svg aria-hidden="true" className="arrow arrow--right" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
}

export function ProductionLedgerTool() {
  const [saved, setSaved] = useState<ProductionLedger[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(PRODUCTION_LEDGER_STORAGE_KEY) || '{"schemaVersion":1,"ledgers":[]}')
      return Array.isArray(stored) ? stored : stored.ledgers ?? []
    } catch { return [] }
  })
  const [version, setVersion] = useState('v0.8')
  const [route, setRoute] = useState<DeliveryRoute>('自出版大货')
  const [decision, setDecision] = useState('只决定四种异形木件是否改成标准圆片后再向同一批供应商询价。')
  const [regionAndQuantity, setRegionAndQuantity] = useState('1500 份；目标首发中国大陆与新加坡；不把第二次印刷算入本场景。')
  const [components, setComponents] = useState<ProductionComponent[]>(() => [
    { id: crypto.randomUUID(), name: '航线卡', quantity: '96 张/盒', specification: '63×88mm；300gsm；双面四色；圆角；暂定光油。', playerFunction: '承载私人路线与公开交货信息，反复洗牌；文字需在手牌距离读取。', alternativeAndRetest: '若改小卡，复测手牌扇形、字号、图标和洗牌；不只比较单价。', evidenceState: '目录/计算器' },
    { id: crypto.randomUUID(), name: '阵营圆片', quantity: '24 枚/盒', specification: '20×4mm 木圆片；四色；单面丝印；每色 6 枚。', playerFunction: '盲抽后用颜色与图标识别阵营，并在版图上抓取移动。', alternativeAndRetest: '备选 2mm 冲切圆片保留图标；复测盲抽触感、抓取和磨损。', evidenceState: '设计者粗估' },
    { id: crypto.randomUUID(), name: '折叠版图', quantity: '1 张/盒', specification: '展开 480×480mm；四折；2mm 灰板；哑膜。', playerFunction: '承载公共航线、需求与资源位置，四人需从不同方向读取。', alternativeAndRetest: '备选两片拼接板；复测接缝遮挡、设置时间、桌面空间和盒型。', evidenceState: '未知' },
  ])
  const [currencyAndAmount, setCurrencyAndAmount] = useState('USD；金额尚未取得，不用旧项目单价代填。')
  const [costScope, setCostScope] = useState<CostScope>('工厂生产范围')
  const [costEvidenceState, setCostEvidenceState] = useState<ProductionEvidenceState>('未知')
  const [costSourceAndDate, setCostSourceAndDate] = useState('待把 v0.8 BOM 发给至少两家生产方；记录各自回复日期与版本。')
  const [included, setIncluded] = useState('计划要求报价包含纸品、木件、表面处理、装配、单盒包装和运输外箱。')
  const [excluded, setExcluded] = useState('暂不假定包含模具修改、样品快递、国际货运、税费、入仓、末端履约、替换件和售后。')
  const [packoutTask, setPackoutTask] = useState('戴套卡、全部圆片、折叠板与规则装盒；玩家开盒后取出、四人设置、桌上取用并在结束后复原。')
  const [packedMeasurement, setPackedMeasurement] = useState('尚未实测。需记录盒内长宽高、装满后重量、戴套卡堆高度与运输外箱假设。')
  const [validationGate, setValidationGate] = useState<ValidationGate>('早期规格')
  const [validationTask, setValidationTask] = useState('确认三项核心组件的尺寸、玩家功能、备选和未决工艺足以取得可比报价。')
  const [expectedResult, setExpectedResult] = useState('两家生产方都能按同一 v0.8 规格分别报价木圆片与纸板圆片方案，并指出无法生产或需澄清的字段。')
  const [actualResult, setActualResult] = useState('尚未执行；保留未验证状态，不把预期写成结果。')
  const [approverAndUncoveredRisk, setApproverAndUncoveredRisk] = useState('设计者批准进入报价；尚未覆盖实物色差、抓取、盒内 fit、整批一致性和国际运输。')
  const [accessibilityRetest, setAccessibilityRetest] = useState('任何圆片或版图尺寸替代后，用相同盲抽、抓取、跨桌读取和四人设置任务，与相关玩家复测。')
  const [environmentalAssumption, setEnvironmentalAssumption] = useState('先记录整盒重量、纸板面积和耐用差异；不因“纸板替代木件”自动宣称更环保。')
  const [biggestUnknown, setBiggestUnknown] = useState('圆片方案对工装、装配、盒重与盲抽识别的合并影响。')
  const [nextEvidence, setNextEvidence] = useState('只把圆片未知升级：保持 1500 份与其他规格不变，取得木/纸板两版书面差价，并用替代原型复测盲抽与抓取。')
  const [status, setStatus] = useState('')
  useEffect(() => { localStorage.setItem(PRODUCTION_LEDGER_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, ledgers: saved })) }, [saved])

  const updateComponent = (id: string, field: keyof Omit<ProductionComponent, 'id'>, value: string) => {
    setComponents(current => current.map(component => component.id === id ? { ...component, [field]: value } : component))
  }
  const addComponent = () => setComponents(current => [...current, {
    id: crypto.randomUUID(), name: '', quantity: '', specification: '', playerFunction: '', alternativeAndRetest: '', evidenceState: '未知',
  }])
  const removeComponent = (id: string) => setComponents(current => current.length > 1 ? current.filter(component => component.id !== id) : current)
  const saveLedger = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const required = [version, decision, regionAndQuantity, currencyAndAmount, costSourceAndDate, included, excluded, packoutTask, packedMeasurement, validationTask, expectedResult, actualResult, approverAndUncoveredRisk, accessibilityRetest, environmentalAssumption, biggestUnknown, nextEvidence]
    const componentsComplete = components.length > 0 && components.every(component => [component.name, component.quantity, component.specification, component.playerFunction, component.alternativeAndRetest].every(value => value.trim()))
    if (!required.every(value => value.trim()) || !componentsComplete) return setStatus('请先写完版本、路线场景、每项组件的数量/规格/功能/替代、价格范围、包装任务、验证门、未覆盖风险和下一条证据。')
    const record: ProductionLedger = {
      id: crypto.randomUUID(), version: version.trim(), route, decision: decision.trim(), regionAndQuantity: regionAndQuantity.trim(),
      components: components.map(component => ({ ...component, name: component.name.trim(), quantity: component.quantity.trim(), specification: component.specification.trim(), playerFunction: component.playerFunction.trim(), alternativeAndRetest: component.alternativeAndRetest.trim() })),
      currencyAndAmount: currencyAndAmount.trim(), costScope, costEvidenceState, costSourceAndDate: costSourceAndDate.trim(), included: included.trim(), excluded: excluded.trim(),
      packoutTask: packoutTask.trim(), packedMeasurement: packedMeasurement.trim(), validationGate, validationTask: validationTask.trim(), expectedResult: expectedResult.trim(),
      actualResult: actualResult.trim(), approverAndUncoveredRisk: approverAndUncoveredRisk.trim(), accessibilityRetest: accessibilityRetest.trim(), environmentalAssumption: environmentalAssumption.trim(),
      biggestUnknown: biggestUnknown.trim(), nextEvidence: nextEvidence.trim(), createdAt: new Date().toISOString(),
    }
    setSaved(current => [record, ...current])
    setStatus('生产假设已保存。它不是报价、价格预测、合规意见或可持续认证。')
  }
  const exportLedgers = () => {
    const payload = { schema_version: 1, method: 'production-assumption-ledger', no_price_prediction: true, not_a_manufacturing_quote: true, not_compliance_advice: true, ledgers: saved }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('生产假设账本'); anchor.click(); URL.revokeObjectURL(url)
  }
  const unknownComponents = components.filter(component => component.evidenceState === '未知').length
  return <section className="tool-surface production-ledger-tool"><h2>生产假设账本</h2><p className="tool-intro">不预测一盒多少钱。把组件功能、可制造规格、报价范围、包装任务、样品门和下一条证据锁在同一个版本里。</p>
    <aside className="decision-trace-principle production-ledger-principle"><strong>记录原则</strong><p>未知可以保留，脱离范围的精确数字不可以。任何为了成本、重量或供应做的替代，都要回到相同玩家任务复测。</p></aside>
    <div className="decision-trace-layout production-ledger-layout"><form className="decision-trace-form production-ledger-form" onSubmit={saveLedger}>
      <div className="form-pair"><label><span>01 · 版本</span><input value={version} onChange={event => setVersion(event.target.value)} /></label><label><span>02 · 交付路线</span><select value={route} onChange={event => setRoute(event.target.value as DeliveryRoute)}><option>投出版社</option><option>免费 PnP</option><option>小批/POD</option><option>自出版大货</option><option>众筹履约</option><option>其他</option></select></label></div>
      <label><span>03 · 这轮只作什么决定</span><textarea value={decision} onChange={event => setDecision(event.target.value)} /></label>
      <label><span>04 · 目标地区与数量场景</span><textarea value={regionAndQuantity} onChange={event => setRegionAndQuantity(event.target.value)} placeholder="数量不是销量预测；写这次用来询价或比较的固定场景。" /></label>
      <fieldset className="production-components"><legend>05 · 带玩家功能的组件规格</legend>
        <div className="production-component-list">{components.map((component, index) => <section className="production-component-row" key={component.id} aria-label={`组件 ${index + 1}`}>
          <div className="production-row-head"><strong>组件 {String(index + 1).padStart(2, '0')}</strong><button className="text-action" type="button" disabled={components.length === 1} onClick={() => removeComponent(component.id)}>移除</button></div>
          <div className="form-pair"><label><span>名称</span><input value={component.name} onChange={event => updateComponent(component.id, 'name', event.target.value)} /></label><label><span>每盒数量</span><input value={component.quantity} onChange={event => updateComponent(component.id, 'quantity', event.target.value)} /></label></div>
          <label><span>尺寸 / 材料 / 印刷或加工</span><textarea value={component.specification} onChange={event => updateComponent(component.id, 'specification', event.target.value)} /></label>
          <label><span>玩家或系统功能</span><textarea value={component.playerFunction} onChange={event => updateComponent(component.id, 'playerFunction', event.target.value)} /></label>
          <label><span>备选方案与同任务复测</span><textarea value={component.alternativeAndRetest} onChange={event => updateComponent(component.id, 'alternativeAndRetest', event.target.value)} /></label>
          <label><span>规格证据状态</span><select value={component.evidenceState} onChange={event => updateComponent(component.id, 'evidenceState', event.target.value)}><option>未知</option><option>设计者粗估</option><option>目录/计算器</option><option>供应商书面报价</option><option>样品/发票/实测</option></select></label>
        </section>)}</div>
        <button className="text-action production-add-component" type="button" onClick={addComponent}>增加一个组件 <ArrowIcon /></button>
      </fieldset>
      <div className="form-pair"><label><span>06 · 币种与当前金额/范围</span><textarea value={currencyAndAmount} onChange={event => setCurrencyAndAmount(event.target.value)} /></label><label><span>07 · 成本范围</span><select value={costScope} onChange={event => setCostScope(event.target.value as CostScope)}><option>工厂生产范围</option><option>落地到仓范围</option><option>项目全成本范围</option><option>暂未确定</option></select></label></div>
      <label><span>08 · 价格证据状态</span><select value={costEvidenceState} onChange={event => setCostEvidenceState(event.target.value as ProductionEvidenceState)}><option>未知</option><option>设计者粗估</option><option>目录/计算器</option><option>供应商书面报价</option><option>样品/发票/实测</option></select></label>
      <label><span>09 · 价格来源、日期与对应版本</span><textarea value={costSourceAndDate} onChange={event => setCostSourceAndDate(event.target.value)} /></label>
      <label><span>10 · 明确包含</span><textarea value={included} onChange={event => setIncluded(event.target.value)} /></label>
      <label><span>11 · 明确排除或仍未知</span><textarea value={excluded} onChange={event => setExcluded(event.target.value)} /></label>
      <label><span>12 · 完整装盒与玩家取用任务</span><textarea value={packoutTask} onChange={event => setPackoutTask(event.target.value)} /></label>
      <label><span>13 · 盒内/外尺寸、重量、牌套与实测状态</span><textarea value={packedMeasurement} onChange={event => setPackedMeasurement(event.target.value)} /></label>
      <label><span>14 · 当前验证门</span><select value={validationGate} onChange={event => setValidationGate(event.target.value as ValidationGate)}><option>早期规格</option><option>文件/印前</option><option>组件/材料样</option><option>产前样 PPC</option><option>量产样 MPC</option><option>入库/抽检</option></select></label>
      <label><span>15 · 本门验证任务</span><textarea value={validationTask} onChange={event => setValidationTask(event.target.value)} /></label>
      <label><span>16 · 通过前预期看见什么</span><textarea value={expectedResult} onChange={event => setExpectedResult(event.target.value)} /></label>
      <label><span>17 · 实际结果或明确未执行</span><textarea value={actualResult} onChange={event => setActualResult(event.target.value)} /></label>
      <label><span>18 · 谁能批准，以及仍未覆盖什么</span><textarea value={approverAndUncoveredRisk} onChange={event => setApproverAndUncoveredRisk(event.target.value)} /></label>
      <label><span>19 · 最终规格的可访问性/桌面任务复测</span><textarea value={accessibilityRetest} onChange={event => setAccessibilityRetest(event.target.value)} /></label>
      <label><span>20 · 材料、重量、耐用与环境假设</span><textarea value={environmentalAssumption} onChange={event => setEnvironmentalAssumption(event.target.value)} /></label>
      <label><span>21 · 当前最大未知</span><textarea value={biggestUnknown} onChange={event => setBiggestUnknown(event.target.value)} /></label>
      <label><span>22 · 下一步只升级一条证据</span><textarea value={nextEvidence} onChange={event => setNextEvidence(event.target.value)} /></label>
      <button className="primary-button" type="submit">保存生产假设</button><div className="form-status" aria-live="polite">{status}</div>
    </form>
    <aside className="decision-trace-sheet production-ledger-sheet" aria-label="生产假设摘要"><header><span>不是报价或价格预测</span><h2>{decision || '先冻结一个生产决定'}</h2><p>{version || '未写版本'} · {route}<br />{regionAndQuantity || '未写地区与数量场景'}</p></header>
      <dl><div><dt>组件规格</dt><dd>{components.length} 项；其中 {unknownComponents} 项仍为未知证据。{components.map(component => <span className="production-component-summary" key={component.id}><strong>{component.name || '未命名组件'}</strong>：{component.quantity || '数量未知'} · {component.evidenceState}<br />{component.playerFunction || '未写玩家功能。'}</span>)}</dd></div><div><dt>价格范围</dt><dd>{costScope} · {costEvidenceState}<br />{currencyAndAmount || '未写币种与范围。'}<br />{costSourceAndDate || '未写来源和日期。'}</dd></div><div><dt>包含</dt><dd>{included || '未写明确包含项。'}</dd></div><div><dt>排除/未知</dt><dd>{excluded || '未写排除与未知。'}</dd></div><div><dt>装盒任务</dt><dd>{packoutTask || '未写玩家与装盒任务。'}<br />{packedMeasurement || '未写实测状态。'}</dd></div><div><dt>验证门</dt><dd>{validationGate}：{validationTask || '未写本门任务。'}<br />预期：{expectedResult || '未写。'}<br />实际：{actualResult || '未写。'}</dd></div><div><dt>批准边界</dt><dd>{approverAndUncoveredRisk || '未写批准者与未覆盖风险。'}</dd></div><div><dt>任务复测</dt><dd>{accessibilityRetest || '未写最终规格复测。'}</dd></div><div><dt>环境假设</dt><dd>{environmentalAssumption || '未写材料、重量与边界。'}</dd></div></dl>
      <div className="decision-trace-experiment production-ledger-experiment"><span>先升级最可能改变决定的一项未知</span><p>{biggestUnknown || '找一项真正阻碍决定的未知。'}</p><small>下一条证据：{nextEvidence || '模板、实测、书面报价、样品或发票之一。'}</small></div>
      <p className="decision-trace-boundary production-ledger-boundary">这份账本不预测售价、利润或交付成功，不推荐供应商，也不提供制造、合同、税务、海关、合规或可持续认证意见。时效数字必须回到当前正式文件与专业人员。</p>
      {saved.length > 0 && <div className="decision-trace-actions production-ledger-actions"><span>已保存 {saved.length} 份生产假设</span><button className="text-action" type="button" onClick={exportLedgers}>导出 JSON <ArrowIcon /></button></div>}
    </aside></div>
  </section>
}
