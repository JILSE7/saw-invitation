/**
 * Prints the Families sheet the Apps Script reads, derived from the guest list
 * the site already ships.
 *
 * Generating it beats committing a second copy: the two lists must agree or a
 * guest sees one pass count and the sheet enforces another, and a copy that is
 * regenerated cannot drift.
 *
 * Usage:
 *   node --experimental-strip-types scripts/families-tsv.mjs > families.tsv
 */
import { families } from '../src/content/families.ts'

const HEADER = ['Family ID', 'Family', 'Guests']

console.log(HEADER.join('\t'))
for (const { id, name, guests } of families) {
  console.log([id, name, guests].join('\t'))
}
