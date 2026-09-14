/** Only the APIs used by Rule Lab's plain-data state and UI need local fallbacks. */
export function cloneLocalData<T>(value: T, seen = new Map<object, unknown>()): T {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value) as T;
  const result: unknown[] | Record<string, unknown> = Array.isArray(value) ? [] : {};
  seen.set(value, result);
  Object.keys(value).forEach(key => Object.defineProperty(result, key, {
    value: cloneLocalData((value as Record<string, unknown>)[key], seen),
    enumerable: true, configurable: true, writable: true,
  }));
  return result as T;
}
export function installLocalFallbacks(root: Window & typeof globalThis) {
  const define = (object: object, key: string, value: unknown) => {
    if (!(key in object)) Object.defineProperty(object, key, { value, configurable: true, writable: true });
  };
  define(root, 'globalThis', root);
  define(root, 'structuredClone', cloneLocalData);
  define(root, 'queueMicrotask', (callback: () => void) => Promise.resolve().then(callback));
  define(Object, 'hasOwn', (object: object, key: PropertyKey) => Object.prototype.hasOwnProperty.call(object, key));
  define(Object, 'fromEntries', (entries: Iterable<[PropertyKey, unknown]>) => {
    const result = {};
    for (const [key, value] of entries) Object.defineProperty(result, key, {value, writable:true, configurable:true, enumerable:true});
    return result;
  });
  define(Array.prototype, 'at', function(this: unknown[], index: number) {
    const number = Number(index) || 0, integer = number < 0 ? Math.ceil(number) : Math.floor(number);
    return this[integer < 0 ? this.length + integer : integer];
  });
  define(Array.prototype, 'flatMap', function(this: unknown[], callback: (value: unknown, index: number, array: unknown[]) => unknown, thisArg?: unknown) {
    const result: unknown[] = [];
    this.forEach((value,index) => {
      const mapped = callback.call(thisArg,value,index,this);
      if (Array.isArray(mapped)) mapped.forEach(value => result.push(value)); else result.push(mapped);
    });
    return result;
  });
  define(Promise.prototype, 'finally', function<T>(this: Promise<T>, callback: () => unknown) {
    if (typeof callback !== 'function') return this.then(callback, callback);
    return this.then(value => Promise.resolve(callback()).then(() => value), error => Promise.resolve(callback()).then(() => { throw error; }));
  });
}

export type HasRule = { subject: string; condition: string; className: string };
/** Called before React starts; no networking, UA sniffing, workers or persistent loops. */
export function installLayoutFallbacks(hasRules: HasRule[]) {
  const html = document.documentElement;
  const height = () => {
    html.style.setProperty('--app-height', `${window.visualViewport?.height ?? window.innerHeight}px`);
    schedule();
  };
  const flex = document.createElement('div');
  flex.style.cssText = 'position:absolute;visibility:hidden;display:flex;flex-direction:column;row-gap:1px';
  flex.appendChild(document.createElement('div'));flex.appendChild(document.createElement('div'));
  document.body.appendChild(flex);
  const flexGap = flex.scrollHeight === 1;
  flex.remove();
  html.classList.add(flexGap ? 'supports-flex-gap' : 'minitool-no-flex-gap');
  const cssMath = !!window.CSS?.supports?.('width','min(1px, 2px)');
  html.classList.toggle('minitool-basic-layout', !cssMath);
  let queued = false;
  function schedule() {
    if (queued || document.hidden) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  }
  function update() {
    for (const rule of hasRules) {
      document.querySelectorAll<HTMLElement>(rule.subject).forEach(element => {
        const matched = rule.condition.startsWith('+')
          ? !!element.nextElementSibling?.matches(rule.condition.slice(1).trim())
          : !!element.querySelector(rule.condition.startsWith('>') ? `:scope ${rule.condition}` : rule.condition);
        if (element.classList.contains(rule.className) !== matched) element.classList.toggle(rule.className, matched);
      });
    }
    if (!flexGap) document.querySelectorAll<HTMLElement>('#root [class]').forEach(element => {
      const style = getComputedStyle(element);
      const isFlex = style.display === 'flex' || style.display === 'inline-flex';
      if (!isFlex) return;
      const x = style.getPropertyValue('--mt-gap-x').trim() || '0px';
      const y = style.getPropertyValue('--mt-gap-y').trim() || '0px';
      const column = style.flexDirection.startsWith('column');
      const children = Array.from(element.children).filter(child => getComputedStyle(child).display !== 'none') as HTMLElement[];
      children.forEach((child,index) => {
        const gap = index === 0 ? '0px' : column ? y : x;
        if (child.style.getPropertyValue('--mt-item-gap') !== gap) child.style.setProperty('--mt-item-gap',gap);
        const direction = column ? 'mt-gap-column' : 'mt-gap-row';
        if (!child.classList.contains(direction)) { child.classList.remove('mt-gap-row','mt-gap-column');child.classList.add(direction); }
      });
    });
  }
  new MutationObserver(schedule).observe(document.getElementById('root')!, {childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  window.addEventListener('resize', height);
  window.visualViewport?.addEventListener('resize', height);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) height(); });
  height();
}
