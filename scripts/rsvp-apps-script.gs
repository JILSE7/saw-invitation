/**
 * RSVP receiver for the wedding invitation.
 *
 * DEPLOYMENT
 *   1. Create a Google Sheet. Its first tab will hold confirmations.
 *   2. Extensions > Apps Script. Replace Code.gs with this file.
 *   3. Fill in ALLOWED below so it mirrors src/content/families.ts.
 *   4. Deploy > New deployment > Web app.
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      "Anyone" is required. The invitation is a static site with no session,
 *      so the browser posts anonymously; "Anyone with a Google account" makes
 *      every guest sign in to confirm.
 *   5. Copy the /exec URL into .env.local as VITE_RSVP_ENDPOINT.
 *   6. Re-run steps 4-5 as "Manage deployments > Edit > New version" after
 *      any change to this file. Saving alone does not update the live web app.
 *
 * THE ENDPOINT URL IS NOT A SECRET. Vite inlines every VITE_* variable into
 * the JavaScript bundle, so anyone who opens the site can read it and post to
 * it. That is why validation lives here and not only in the form.
 */

const SHEET_CONFIRMATIONS = 'Confirmaciones'
const SHEET_HISTORY = 'Historial'
const MESSAGE_MAX_LENGTH = 500

/**
 * Guest list, as { id: passes }.
 *
 * This mirrors src/content/families.ts and must be updated alongside it. The
 * duplication is deliberate: the client copy can be edited by anyone with
 * DevTools, so it cannot be trusted to cap a headcount.
 */
const ALLOWED = {
  garcia: 4,
  lopez: 2,
}

const HEADERS = ['Familia', 'ID', 'Asiste', 'Personas', 'Mensaje', 'Actualizado']

function doPost(e) {
  // One writer at a time. Two families confirming in the same second would
  // otherwise read the same last row and one would overwrite the other.
  const lock = LockService.getScriptLock()
  try {
    lock.waitLock(20000)
  } catch (err) {
    return json({ success: false, error: 'busy' })
  }

  try {
    const data = parseBody(e)
    if (!data) return json({ success: false, error: 'bad_request' })

    const allowedGuests = ALLOWED[data.familyId]
    if (allowedGuests === undefined) return json({ success: false, error: 'unknown_family' })

    // The client already clamps this. Doing it again here is the version that
    // counts, because the client is editable and this is not.
    const guests = data.confirmed ? Math.min(Math.max(data.guests, 1), allowedGuests) : 0

    const row = [
      data.familyName,
      data.familyId,
      data.confirmed ? 'Sí' : 'No',
      guests,
      data.message,
      new Date(),
    ]

    upsert(sheet(SHEET_CONFIRMATIONS), row, data.familyId)
    sheet(SHEET_HISTORY).appendRow(row)

    return json({ success: true })
  } catch (err) {
    return json({ success: false, error: 'server_error' })
  } finally {
    lock.releaseLock()
  }
}

/** The client posts JSON under a text/plain content type to dodge preflight. */
function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) return null

  let data
  try {
    data = JSON.parse(e.postData.contents)
  } catch (err) {
    return null
  }

  if (typeof data !== 'object' || data === null) return null
  if (typeof data.familyId !== 'string' || !data.familyId) return null
  if (typeof data.familyName !== 'string' || !data.familyName) return null
  if (typeof data.confirmed !== 'boolean') return null
  if (typeof data.guests !== 'number' || !isFinite(data.guests)) return null

  return {
    familyId: data.familyId.trim().slice(0, 64),
    familyName: data.familyName.trim().slice(0, 120),
    confirmed: data.confirmed,
    guests: Math.round(data.guests),
    message: typeof data.message === 'string' ? data.message.trim().slice(0, MESSAGE_MAX_LENGTH) : '',
  }
}

/**
 * Replaces a family's row, or appends it the first time.
 *
 * Families change their mind, and two contradictory rows for one household is
 * how a couple ends up cooking for the wrong number of people. The full
 * sequence of answers is kept on the history tab instead.
 */
function upsert(target, row, familyId) {
  const ids = target.getRange(2, 2, Math.max(target.getLastRow() - 1, 1), 1).getValues()
  for (let i = 0; i < ids.length; i++) {
    if (ids[i][0] === familyId) {
      target.getRange(i + 2, 1, 1, row.length).setValues([row])
      return
    }
  }
  target.appendRow(row)
}

function sheet(name) {
  const book = SpreadsheetApp.getActiveSpreadsheet()
  let target = book.getSheetByName(name)
  if (!target) {
    target = book.insertSheet(name)
  }
  if (target.getLastRow() === 0) {
    target.appendRow(HEADERS)
    target.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    target.setFrozenRows(1)
  }
  return target
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
