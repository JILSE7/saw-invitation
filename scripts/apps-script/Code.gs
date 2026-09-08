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
 * Run buildSummary() once from the editor to add the Resumen sheet.
 *
 * The spreadsheet needs two sheets; the other two are created for you:
 *   Responses — Timestamp | Family ID | Family | Confirmed | Guests | Message
 *   Families  — Family ID | Family | Guests   (the guest list itself)
 *   Historial — created on the first submission; every answer ever sent
 *   Resumen   — created by buildSummary(); the full roster and totals
 *
 * Families is the guest list. It is the only copy: the site no longer ships
 * one, so a name and a pass count cannot be read out of the bundle, and there
 * is no second list to drift out of step with this one.
 *
 * Editing a row here changes what the invitation says on the next load. An id
 * removed from this sheet stops resolving, which is how an invitation is
 * revoked.
 */

var RESPONSES_SHEET = 'Responses';
var HISTORY_SHEET = 'Historial';
var SUMMARY_SHEET = 'Resumen';
var FAMILIES_SHEET = 'Families';
var MESSAGE_MAX_LENGTH = 500;
var RESPONSE_HEADERS = ['Timestamp', 'Family ID', 'Family', 'Confirmed', 'Guests', 'Message'];

function doPost(e) {
  // The upsert reads the sheet before writing it. Without a lock, two
  // families confirming in the same second both see the same rows and one
  // write lands on top of the other.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (busy) {
    return json({ success: false, error: 'busy' });
  }

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

    var row = [new Date(), family.id, family.name, payload.confirmed, guests, message];

    // Responses holds one row per family, so the sheet a couple opens can be
    // counted directly: a household that changes its mind edits its own row
    // rather than adding a second one that inflates the total.
    //
    // Historial keeps every answer ever sent, so "they had said six" is still
    // an answerable question a week before the wedding.
    upsertResponse(row, family.id);
    ensureSheet(HISTORY_SHEET, RESPONSE_HEADERS).appendRow(row);

    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Replaces this family's row, or adds it the first time.
 *
 * Matching is on the id in column B, never the name: two households can share
 * a name, and the name is what the guest list is free to reword.
 */
function upsertResponse(row, familyId) {
  var target = sheet(RESPONSES_SHEET);
  var last = target.getLastRow();

  if (last >= 2) {
    var ids = target.getRange(2, 2, last - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]).trim() === familyId) {
        target.getRange(i + 2, 1, 1, row.length).setValues([row]);
        return;
      }
    }
  }

  target.appendRow(row);
}

/** Creates a derived sheet on first use, so it is not another setup step. */
function ensureSheet(name, headers) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var found = book.getSheetByName(name);
  if (found) return found;

  found = book.insertSheet(name);
  found.appendRow(headers);
  found.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  found.setFrozenRows(1);
  return found;
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
 * This family's current answer, or null if it has never replied.
 *
 * Responses holds one row per family, so this normally finds it on the first
 * hit. Scanning upward rather than downward is deliberate anyway: if a row is
 * ever duplicated by hand, the newest still wins — the same rule the Resumen
 * formulas apply.
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
 * Builds the Resumen tab: every invited family, answered or not.
 *
 * Responses only has rows for households that replied, so it cannot answer
 * the question a couple actually asks in the last week — who still has not
 * said anything. This sheet lists the whole guest list beside its current
 * answer, and totals the confirmed headcount and the silence.
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
 * survivor wins. Responses normally holds one row per family, so this reads
 * that row — and it stays correct if one is ever duplicated by hand, because
 * it resolves ties the same way findLatestResponse does.
 */
function latest(row, column) {
  return 'LOOKUP(2,1/(Responses!$B$2:$B=$A' + row + '),Responses!$' + column + '$2:$' + column + ')';
}
