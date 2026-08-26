import { CLASSIC_VISUAL_ASSETS, formatClassicVisualCredit } from './classic-visual-assets'
import './classic-visual-board-v5-1.css'

const CONTACT_SHEET_ASSETS = [
  CLASSIC_VISUAL_ASSETS[1],
  CLASSIC_VISUAL_ASSETS[0],
  CLASSIC_VISUAL_ASSETS[3],
  CLASSIC_VISUAL_ASSETS[2],
] as const

export function ClassicVisualBoard({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`resource-home-visual classic-visual-board${compact ? ' is-compact' : ''}`} aria-label="经典桌游视觉标本">
      <div className="classic-visual-board__grid">
        {CONTACT_SHEET_ASSETS.map((asset, index) => (
          <figure
            className="classic-visual-board__specimen"
            data-game={asset.id}
            key={asset.id}
          >
            <img
              src={asset.runtimePath}
              alt={asset.alt}
              width={asset.width}
              height={asset.height}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span className="classic-visual-board__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="classic-visual-board__label">
                <strong>《{asset.gameTitle}》</strong>
                <span>{asset.shortLabel}</span>
                <small>{formatClassicVisualCredit(asset)}</small>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </aside>
  )
}
