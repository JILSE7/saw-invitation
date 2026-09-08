/**
 * Writes the Families sheet the Apps Script reads, derived from the guest list
 * the site already ships.
 *
 * Generating it beats committing a second copy: the two lists must agree or a
 * guest sees one pass count while the sheet enforces another, and a file that
 * is regenerated cannot drift.
 *
 * Run it through the package script — `yarn families` — which carries the
 * --experimental-strip-types flag Node needs to import a .ts file. The output
 * path is written here rather than piped, so neither a forgotten redirect nor
 * yarn's own banner can end up inside the TSV.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { families } from '../src/content/families.ts'

const OUT = fileURLToPath(new URL('../families.tsv', import.meta.url))
const HEADER = ['Family ID', 'Family', 'Guests']

const rows = families.map(({ id, name, guests }) => [id, name, guests].join('\t'))
writeFileSync(OUT, [HEADER.join('\t'), ...rows].join('\n') + '\n', 'utf8')

const passes = families.reduce((total, family) => total + family.guests, 0)
console.log(`families.tsv · ${families.length} filas · ${passes} pases`)
