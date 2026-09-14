/** Shared geometry used by the interactive scene and the dedicated cover compositor. */
export type StagePath = { d: string; layer: string; transform?: string };
export const stagePaths: Record<'none' | 'insurance' | 'tiebreak' | 'retry', StagePath[]> = {
  none: [],
  insurance: [
    {layer:'deep',d:'M0 220L105 310L165 660L0 720ZM1440 225L1334 320L1275 650L1440 720Z'},
    {layer:'mid',d:'M0 590L380 638L750 615L1110 645L1440 568V960H0Z'},
    {layer:'light',d:'M0 220L105 310L155 658L0 708ZM1440 225L1334 320L1285 658L1440 708Z'},
    {layer:'paper',d:'M155 658L340 700L700 680L1120 702L1285 658L1440 820L1050 880L720 922L355 890L0 823Z'},
    {layer:'fold-line',d:'M0 708L340 700L700 680L1120 702L1440 708M0 823L355 890L720 922L1050 880L1440 820M105 310L155 658M1334 320L1285 658'},
    {layer:'light',d:'M0 910L355 890L195 960H0ZM1440 910L1050 880L1245 960H1440Z'},
  ],
  tiebreak: [
    {layer:'light',d:'M0 210H78V805H0ZM1440 210H1362V805H1440Z'},
    {layer:'mid',d:'M78 210L105 232V782L78 805ZM1362 210L1335 232V782L1362 805Z'},
    {layer:'fold-line',d:'M105 232H230M1210 232H1335M105 782H285M1155 782H1335M190 845H1250'},
    {layer:'rule-line',d:'M230 232H410M1030 232H1210M285 782H445M995 782H1155'},
    {layer:'stamp',d:'M0 0H85L103 18V103L85 121H0L-18 103V18Z',transform:'translate(1270 660) rotate(-9)'},
    {layer:'stamp',d:'M11 47H74M11 71H74M-8 15H11M74 106H94',transform:'translate(1270 660) rotate(-9)'},
    {layer:'fold-line',d:'M190 862H440M1000 862H1250'},
  ],
  retry: [
    {layer:'light',d:'M37 178H210V193H52V768H201V783H37ZM1224 193H1386V814H1224V799H1371V208H1224Z'},
    {layer:'ghost-line',d:'M84 217H262M84 217V825H249M1188 217H1341V825H1188M123 249H295M123 249V849H282'},
    {layer:'rule-line',d:'M93 277V244H137M1303 244H1347V277M1347 760V793H1303M137 793H93V760'},
    {layer:'fold-line',d:'M190 870H520M940 870H1250'},
    {layer:'registration',d:'M69 214V238M57 226H81M1359 809V833M1347 821H1371'},
  ],
};
export function normalizedAbility(value: string | null | undefined): keyof typeof stagePaths {
  if (['ability.claim_draw', 'tiebreak', 'tie', 'tie-break', '抢平'].includes(value || '')) return 'tiebreak';
  if (['ability.insurance', 'insurance', 'safety', 'cushion', '保底'].includes(value || '')) return 'insurance';
  if (['ability.retry', 'retry', 'reroll', '再搏', '再搏一次'].includes(value || '')) return 'retry';
  return 'none';
}
export const scenePalettes = {
 ink: { paper: '#f5f2e9', ink: '#22252a', muted: '#6f716f', deep: '#8e9991', mid: '#c7cfc4', light: '#e6e6da', accent: '#cd3f2e', line: '#9ba59e' },
 cyanotype: { paper: '#080f1c', ink: '#e9f7fa', muted: '#94b3c4', deep: '#132a3b', mid: '#224352', light: '#142b3a', accent: '#58edd6', line: '#467182' },
} as const;
