/**
 * RSVP receiver for the wedding invitation.
 *
 * Deploy: Extensions > Apps Script, paste this file, then
 * Deploy > New deployment > Web app, "Execute as: Me",
 * "Who has access: Anyone". Copy the /exec URL into VITE_RSVP_ENDPOINT.
 *
 * doGet answers a lookup so a guest who already confirmed is shown their
 * answer instead of an empty form.
 *
 * Run buildSummary() once from the editor to add a third, derived sheet.
 *
 * The spreadsheet needs two sheets:
 *   Responses — Timestamp | Family ID | Family | Confirmed | Guests | Message
 *   Families  — Family ID | Family | Guests   (mirror of src/content/families.ts)
 *
 * Families exists because the frontend list ships in a public bundle: anyone
 * can edit the payload in DevTools. This sheet is the only copy the guest
 * cannot touch, so it — not the request — decides the pass ceiling.
 */

var RESPONSES_SHEET = 'Responses';
var SUMMARY_SHEET = 'Resumen';
var FAMILIES_SHEET = 'Families';
var MESSAGE_MAX_LENGTH = 500;

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ success: false, error: 'empty_body' });
    }

    var payload = JSON.parse(e.postData.contents);
    var family = findFamily(payload.familyId);
    if (!family) {
      return json({ success: false, error: 'unknown_family' });
    }

    if (typeof payload.confirmed !== 'boolean') {
      return json({ success: false, error: 'invalid_confirmed' });
    }

    // A declining family books zero seats; a confirming one is capped by the
    // sheet, never by the number that arrived in the request.
    var guests = 0;
    if (payload.confirmed) {
      guests = Math.floor(Number(payload.guests));
      if (!isFinite(guests) || guests < 1 || guests > family.guests) {
        return json({ success: false, error: 'invalid_guests' });
      }
    }

    var message = typeof payload.message === 'string'
      ? payload.message.slice(0, MESSAGE_MAX_LENGTH)
      : '';

    // Every submission is appended, never overwritten: a family that changes
    // its mind leaves an audit trail instead of silently rewriting history.
    sheet(RESPONSES_SHEET).appendRow([
      new Date(),
      family.id,
      family.name,
      payload.confirmed,
      guests,
      message,
    ]);

    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: String(error) });
  }
}

/**
 * Returns a family and its most recent answer, or null if it has never
 * replied.
 *
 * A GET with no custom headers is a CORS simple request, so this skips the
 * preflight Apps Script never answers — the same reason doPost is fed
 * text/plain.
 */
function doGet(e) {
  try {
    var family = findFamily(e && e.parameter ? e.parameter.familyId : '');
    if (!family) {
      return json({ success: false, error: 'unknown_family' });
    }

    return json({
      success: true,
      family: { id: family.id, name: family.name, guests: family.guests },
      response: findLatestResponse(family.id),
    });
  } catch (error) {
    // Generic on purpose: this body reaches the browser, and "Missing sheet:
    // Families" is a note to the maintainer, not to a guest.
    return json({ success: false, error: 'server_error' });
  }
}

/**
 * The last row for a family, not the first.
 *
 * Responses is append-only by design, so a household that changed its mind
 * has several rows. Scanning upward from the bottom is what makes the newest
 * answer the current one.
 */
function findLatestResponse(id) {
  var rows = sheet(RESPONSES_SHEET).getDataRange().getValues();
  for (var i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][1]).trim() !== id) continue;

    var confirmed = rows[i][3];
    return {
      confirmed: confirmed === true || String(confirmed).toLowerCase() === 'true',
      guests: Number(rows[i][4]) || 0,
      message: String(rows[i][5] || ''),
      at: rows[i][0] instanceof Date ? rows[i][0].toISOString() : String(rows[i][0]),
    };
  }
  return null;
}

function findFamily(id) {
  if (typeof id !== 'string' || !id) return null;

  var rows = sheet(FAMILIES_SHEET).getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === id.trim()) {
      return { id: String(rows[i][0]).trim(), name: String(rows[i][1]), guests: Number(rows[i][2]) };
    }
  }
  return null;
}

function sheet(name) {
  var found = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!found) throw new Error('Missing sheet: ' + name);
  return found;
}

function json(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Builds the Resumen tab: one row per family, showing only its current answer.
 *
 * Responses stays append-only, so a household that changed its mind keeps
 * every row it wrote. But a couple counting heads should not have to read a
 * log — summing the Guests column there double-counts anyone who replied
 * twice. This sheet is the number to trust; Responses is the record of how it
 * got there.
 *
 * Run it from the editor after the guest list changes. The formulas refresh
 * themselves as confirmations arrive.
 */
function buildSummary() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var count = Math.max(sheet(FAMILIES_SHEET).getLastRow() - 1, 1);

  var summary = book.getSheetByName(SUMMARY_SHEET);
  if (!summary) summary = book.insertSheet(SUMMARY_SHEET);
  summary.clear();

  summary.appendRow(['ID', 'Familia', 'Pases', 'Asiste', 'Personas', 'Mensaje', 'Actualizado']);
  summary.getRange(1, 1, 1, 7).setFontWeight('bold');
  summary.setFrozenRows(1);

  var formulas = [];
  for (var i = 0; i < count; i++) {
    var row = i + 2;
    formulas.push([
      '=Families!A' + row,
      '=Families!B' + row,
      '=Families!C' + row,
      '=IFERROR(IF(' + latest(row, 'D') + ',"Sí","No"),"—")',
      '=IFERROR(' + latest(row, 'E') + ',0)',
      '=IFERROR(' + latest(row, 'F') + ',"")',
      '=IFERROR(' + latest(row, 'A') + ',"")',
    ]);
  }
  summary.getRange(2, 1, count, 7).setFormulas(formulas);

  var totals = count + 3;
  summary.getRange(totals, 4).setValue('Personas confirmadas');
  summary.getRange(totals, 5).setFormula('=SUM(E2:E' + (count + 1) + ')');
  summary.getRange(totals + 1, 4).setValue('Familias sin responder');
  summary.getRange(totals + 1, 5).setFormula('=COUNTIF(D2:D' + (count + 1) + ',"—")');
  summary.getRange(totals, 4, 2, 1).setFontWeight('bold');
}

/**
 * The value in `column` on the LAST Responses row belonging to this family.
 *
 * LOOKUP(2, 1/(range = value), result) is the spreadsheet idiom for exactly
 * that: non-matching rows divide by zero, LOOKUP skips errors, and the last
 * survivor wins. It is the same rule findLatestResponse follows, which is why
 * the sheet and the invitation never disagree.
 */
function latest(row, column) {
  return 'LOOKUP(2,1/(Responses!$B$2:$B=$A' + row + '),Responses!$' + column + '$2:$' + column + ')';
}
