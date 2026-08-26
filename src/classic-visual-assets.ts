export type ClassicVisualAssetId = 'catan' | 'azul' | 'ticket-to-ride' | 'carcassonne'

export type ClassicVisualAsset = Readonly<{
  id: ClassicVisualAssetId
  gameTitle: string
  shortLabel: string
  alt: string
  runtimePath: `/assets/classic-games/${string}.webp`
  width: number
  height: number
  sourcePage: `https://commons.wikimedia.org/${string}`
  creator: string
  license: 'CC0 1.0' | 'CC BY 2.0' | 'CC BY 4.0'
  licenseUrl: `https://creativecommons.org/${string}`
  rightsStatus: 'cleared-open'
  useScope: 'internal-only'
  publicUseAllowed: false
}>

/**
 * The homepage may only render assets that have passed the open-asset review.
 * The matching source, download, crop and checksum records live in
 * content/visual-assets/classic-board-game-assets.json and are enforced by
 * `pnpm qa:classic-assets`.
 */
export const CLASSIC_VISUAL_ASSETS = [
  {
    id: 'catan',
    gameTitle: '卡坦岛',
    shortLabel: '六角地形',
    alt: '一局《卡坦岛》的六角地形版图，木制道路、聚落与数字标记铺在桌面上',
    runtimePath: '/assets/classic-games/catan-board-cc0.webp',
    width: 1200,
    height: 675,
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Partida_Catan.jpg',
    creator: 'Pepenic1',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    rightsStatus: 'cleared-open',
    useScope: 'internal-only',
    publicUseAllowed: false,
  },
  {
    id: 'azul',
    gameTitle: '花砖物语',
    shortLabel: '花砖阵列',
    alt: '四人《花砖物语》游戏进行中的桌面，蓝白花砖、个人版图和计分轨道清晰可见',
    runtimePath: '/assets/classic-games/azul-table-cc0.webp',
    width: 1200,
    height: 900,
    sourcePage: 'https://commons.wikimedia.org/wiki/File:A_four-player_game_of_the_board_game_Azul.jpg',
    creator: 'Gábor Zehetmayer',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    rightsStatus: 'cleared-open',
    useScope: 'internal-only',
    publicUseAllowed: false,
  },
  {
    id: 'ticket-to-ride',
    gameTitle: '车票之旅',
    shortLabel: '路线网络',
    alt: '《车票之旅》的地图版图上，彩色列车路线和木制列车棋子连接多座城市',
    runtimePath: '/assets/classic-games/ticket-to-ride-cc-by-2.webp',
    width: 1200,
    height: 800,
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Ticket_to_Ride_(16298587785).jpg',
    creator: 'Billie Grace Ward',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    rightsStatus: 'cleared-open',
    useScope: 'internal-only',
    publicUseAllowed: false,
  },
  {
    id: 'carcassonne',
    gameTitle: '卡卡颂',
    shortLabel: '拼接版图',
    alt: '一局《卡卡颂》的方形地形板块拼成道路、城市与田野，米宝分布其间',
    runtimePath: '/assets/classic-games/carcassonne-cc-by-4.webp',
    width: 960,
    height: 1283,
    sourcePage: 'https://commons.wikimedia.org/wiki/File:Carcassone_jogo-game.jpg',
    creator: 'L’Éclipse',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    rightsStatus: 'cleared-open',
    useScope: 'internal-only',
    publicUseAllowed: false,
  },
] as const satisfies readonly ClassicVisualAsset[]

export function formatClassicVisualCredit(asset: ClassicVisualAsset): string {
  return `${asset.gameTitle}照片，${asset.creator} / ${asset.license}`
}
