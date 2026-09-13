import { StackIcon } from '@phosphor-icons/react/dist/csr/Stack'
import { CompassIcon } from '@phosphor-icons/react/dist/csr/Compass'
import { PencilLineIcon } from '@phosphor-icons/react/dist/csr/PencilLine'
import { ArrowsLeftRightIcon } from '@phosphor-icons/react/dist/csr/ArrowsLeftRight'
import type { LibraryKind } from './reading-navigation'

const icons = { mechanisms: StackIcon, themes: CompassIcon, lessons: PencilLineIcon, comparisons: ArrowsLeftRightIcon }
export function LibraryKindIcon({ kind, size = 28 }: { kind: LibraryKind; size?: number }) {
  const Icon = icons[kind]
  return <Icon size={size} weight="duotone" aria-hidden="true"/>
}
