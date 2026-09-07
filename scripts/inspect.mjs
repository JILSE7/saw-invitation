/**
 * Visual and layout inspection of the running dev server, over the Chrome
 * DevTools Protocol.
 *
 * Plain `--headless --screenshot` is not enough here: it lays the page out at
 * its own width and then crops the image to --window-size, which reads as a
 * layout bug that does not exist. Device metrics have to be emulated.
 *
 * Start Chrome first:
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *     --headless --disable-gpu --remote-debugging-port=9222 about:blank &
 *
 * Then:
 *   node scripts/inspect.mjs shot <out.png> [width] [height] [--wait=ms]
 *   node scripts/inspect.mjs overflow            # elements escaping the viewport
 *   node scripts/inspect.mjs measure <frag...>   # rects by partial class name
 */
import { writeFileSync } from 'node:fs'

const PORT = 9222
const PAGE_URL = process.env.INSPECT_URL ?? 'http://localhost:5199/'

const [mode, ...rest] = process.argv.slice(2)
const flag = (name, fallback) =>
  Number(rest.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback)
const positional = rest.filter((a) => !a.startsWith('--'))

const targets = await (await fetch(`http://localhost:${PORT}/json`)).json()
const page = targets.find((t) => t.type === 'page')
if (!page) {
  console.error('No page target. Is Chrome running with --remote-debugging-port=9222?')
  process.exit(1)
}

const ws = new WebSocket(page.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const i = ++id
    pending.set(i, resolve)
    ws.send(JSON.stringify({ id: i, method, params }))
  })

ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result)
    pending.delete(m.id)
  }
}

const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true })
  return r?.result?.value
}

await new Promise((r) => (ws.onopen = r))

if (mode === 'shot') {
  const [out, width = '430', height = '932'] = positional
  await send('Emulation.setDeviceMetricsOverride', {
    width: Number(width),
    height: Number(height),
    deviceScaleFactor: 2,
    mobile: true,
  })
  await send('Page.navigate', { url: PAGE_URL })
  await new Promise((r) => setTimeout(r, flag('wait', 3000)))
  const { data } = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(out, Buffer.from(data, 'base64'))
  console.log(`wrote ${out} at ${width}x${height}@2x`)
} else if (mode === 'overflow') {
  console.log(
    await evaluate(`(() => {
      const docW = document.documentElement.clientWidth
      const out = []
      for (const el of document.querySelectorAll('*')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 && r.height === 0) continue
        if (r.right > docW + 1 || r.left < -1) {
          out.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 48),
                     left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) })
        }
      }
      return JSON.stringify({ viewport: docW, scrollWidth: document.documentElement.scrollWidth,
                              offenders: out.slice(0, 25) }, null, 2)
    })()`),
  )
} else if (mode === 'measure') {
  const frags = JSON.stringify(positional)
  console.log(
    await evaluate(`(() => {
      const rect = (el) => el && (({top,bottom,left,right,width,height}) => ({
        top: Math.round(top), bottom: Math.round(bottom), left: Math.round(left),
        right: Math.round(right), width: Math.round(width), height: Math.round(height),
      }))(el.getBoundingClientRect())
      const out = {}
      for (const f of ${frags}) out[f] = rect(document.querySelector('[class*="' + f + '"]')) ?? null
      return JSON.stringify(out, null, 2)
    })()`),
  )
} else {
  console.error('modes: shot | overflow | measure')
  process.exit(1)
}

ws.close()
