import { adultsOnly, gifts, notFound, passes, unreachable } from './content/invitation'
import { photos } from './content/photos'
import { Countdown } from './sections/countdown/Countdown'
import { DressCode } from './sections/dress-code/DressCode'
import { Farewell } from './sections/farewell/Farewell'
import { Hero } from './sections/hero/Hero'
import { Itinerary } from './sections/itinerary/Itinerary'
import { MusicPlayer } from './sections/music/MusicPlayer'
import { InvitationLoader } from './sections/loader/InvitationLoader'
import { InvitationNotice } from './sections/notice/InvitationNotice'
import { Photo } from './sections/photo/Photo'
import { Rsvp } from './sections/rsvp/Rsvp'
import { Statement } from './sections/statement/Statement'
import { Venues } from './sections/venues/Venues'
import { useFamily } from './shared/hooks/useFamily'
import { useHoldWhile } from './shared/hooks/useHoldWhile'

/**
 * The invitation is a single scrolling document, so composition order here is
 * the document order of the source design. Decorative floral crops are not
 * placed yet: they land once the source export is sliced.
 */
export default function App() {
  const { state, family, answer, retry } = useFamily()
  const loading = useHoldWhile(state === 'loading', 700)

  // The guest list lives in the sheet, so the family behind `?familia=` is not
  // known at first paint. The loader covers that ask rather than letting the
  // envelope render nameless and then fill in.
  if (loading) return <InvitationLoader />

  // Two failures that must never be told as one. `unknown` means the sheet
  // answered and holds no such family — the link is wrong. `unreachable` means
  // we never got to ask, and telling a genuinely invited guest their
  // invitation does not exist would be a lie with no way back.
  if (state === 'unknown') {
    return <InvitationNotice title={notFound.title} body={notFound.body} />
  }

  if (state === 'unreachable') {
    return (
      <InvitationNotice
        title={unreachable.title}
        body={unreachable.body}
        action={{ label: unreachable.action, onClick: retry }}
      />
    )
  }

  return (
    <main>
      <Hero family={family} />
      <Photo photo={photos.ring} priority ornament />
      <Countdown />
      <Venues />
      <Photo photo={photos.water} />
      <Itinerary />
      <Statement title={gifts.title} body={gifts.body} closing={gifts.closing} variant="framed" />
      <Photo photo={photos.bench} />
      <DressCode />
      <Statement body={adultsOnly.body} />
      <Photo photo={photos.walking} />
      <Statement body={passes.body} variant="tinted" />
      <Rsvp family={family} answer={answer} />
      <Photo photo={photos.dock} ornament />
      <Farewell family={family} />
      <MusicPlayer />
    </main>
  )
}
