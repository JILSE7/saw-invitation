/**
 * Checks that the deployed Apps Script answers a lookup.
 *
 * Apps Script reports a missing function with an HTML page rather than a
 * status code, and that page carries no CORS header — which is why the browser
 * blames CORS for a problem that has nothing to do with it. Reading the real
 * message out of the markup beats squinting at four kilobytes of Google's
 * inline JavaScript.
 *
 * Usage: yarn rsvp:check [familyId]
 */
import { readFileSync } from 'node:fs'

function readEnv() {
  // Vite's precedence: .env.local wins over .env.
  for (const file of ['.env.local', '.env']) {
    try {
      const match = readFileSync(file, 'utf8').match(/^VITE_RSVP_ENDPOINT=(.*)$/m)
      const value = match?.[1].trim().replace(/^["']|["']$/g, '')
      if (value) return { value, file }
    } catch {
      // Missing file is not an error; try the next one.
    }
  }
  return null
}

const env = readEnv()
if (!env) {
  console.error('VITE_RSVP_ENDPOINT no está definido en .env.local ni en .env')
  process.exit(1)
}

const familyId = process.argv[2] ?? 'gina'
const response = await fetch(`${env.value}?familyId=${encodeURIComponent(familyId)}`, {
  redirect: 'follow',
})
const body = await response.text()
const type = response.headers.get('content-type') ?? ''

console.log(`endpoint: ${env.file}  ·  familyId: ${familyId}  ·  HTTP ${response.status}`)

if (type.includes('application/json')) {
  const parsed = JSON.parse(body)
  if (parsed.success) {
    const previous = parsed.response
    console.log('OK — doGet responde JSON')
    console.log(`  familia:  ${parsed.family?.name ?? '?'} (${parsed.family?.guests ?? '?'} pases)`)
    console.log(
      `  respuesta previa: ${
        previous
          ? `${previous.confirmed ? 'asiste' : 'no asiste'}, ${previous.guests} · ${previous.at}`
          : 'ninguna'
      }`,
    )
  } else {
    console.log(`El script respondió, pero rechazó la consulta: ${parsed.error}`)
  }
  process.exit(0)
}

// Apps Script buries its real message in a centred div at the end of the page.
const message =
  body.match(/<div style="text-align:center[^"]*"[^>]*>([^<]+)<\/div>/)?.[1] ??
  body.match(/<title>([^<]*)<\/title>/)?.[1] ??
  '(sin mensaje)'

console.log(`FALLA — el script devolvió ${type.split(';')[0]}, no JSON`)
console.log(`  "${message.trim()}"`)
if (/doGet/.test(message)) {
  console.log('  -> la versión desplegada es anterior a doGet.')
  console.log('     Implementar › Administrar implementaciones › Editar › Nueva versión')
}
process.exit(1)
