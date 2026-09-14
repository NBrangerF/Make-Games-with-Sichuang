import { useEffect, useId, useRef, type ReactNode } from 'react';

export function Dialog({ title, subtitle, children, onClose, wide = false }: {
  title: string; subtitle?: string; children: ReactNode; onClose: () => void; wide?: boolean;
}) {
  const element = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const id = useId();
  useEffect(() => {
    const dialog = element.current!;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    const cancel = (event: Event) => { event.preventDefault(); close.current(); };
    dialog.addEventListener('cancel', cancel);
    return () => { dialog.removeEventListener('cancel', cancel); dialog.close(); previous?.focus(); };
  }, []);
  return <dialog ref={element} className={`dialog ${wide ? 'dialog-wide' : ''}`} aria-labelledby={id}
    onClick={(event) => { if (event.target === element.current) {
      const box = element.current.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
    } }}>
    <header className="dialog-header"><div><h2 id={id}>{title}</h2>{subtitle && <p className="muted">{subtitle}</p>}</div>
      <button className="icon-button" aria-label="关闭" onClick={onClose}>×</button></header>
    <div className="dialog-body">{children}</div>
  </dialog>;
}
