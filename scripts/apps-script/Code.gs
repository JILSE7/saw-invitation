/**
 * RSVP receiver for the wedding invitation.
 *
 * Deploy: Extensions > Apps Script, paste this file, then
 * Deploy > New deployment > Web app, "Execute as: Me",
 * "Who has access: Anyone". Copy the /exec URL into VITE_RSVP_ENDPOINT.
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
