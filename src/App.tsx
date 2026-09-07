import { adultsOnly, closing, gifts, passes } from './content/invitation'
import { photos } from './content/photos'
import { Countdown } from './sections/countdown/Countdown'
import { DressCode } from './sections/dress-code/DressCode'
import { Hero } from './sections/hero/Hero'
import { Itinerary } from './sections/itinerary/Itinerary'
import { MusicPlayer } from './sections/music/MusicPlayer'
import { InvitationNotFound } from './sections/not-found/InvitationNotFound'
import { Photo } from './sections/photo/Photo'
import { Rsvp } from './sections/rsvp/Rsvp'
import { Statement } from './sections/statement/Statement'
import { Venues } from './sections/venues/Venues'
import { useFamily } from './shared/hooks/useFamily'

/**
 * The invitation is a single scrolling document, so composition order here is
 * the document order of the source design. Decorative floral crops are not
 * placed yet: they land once the source export is sliced.
 */
export default function App() {
  const { state, family } = useFamily()

  // A link that names nobody is a mistake worth stopping on. A link with no
  // family at all is just the invitation itself, so it still renders — only
  // the RSVP asks for a personal link.
  if (state === 'unknown') return <InvitationNotFound />

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
      <Rsvp family={family} />
      <Photo photo={photos.dock} ornament />
      <Statement body={closing.body} variant="tinted" />
      <MusicPlayer />
    </main>
  )
}
