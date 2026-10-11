// Employer / client names that must never appear in public source, per
// PRODUCT.md ("Public site names no employers or clients"). Stored base64 so
// this list does not itself leak the names it bans, and so the file-scan guard
// in banned-names.test.ts does not match on its own source.
const BANNED_BASE64 = [
  'bG9ibGF3',
  'c2hvcHBlcnM=',
  'cHVibGljaXM=',
  'c2FwaWVudA==',
  'dmlydHVzYQ==',
  'aW5mb3N5cw==',
  'bGNs',
  'Y2FwaXRhbCBvbmU=',
  'Y2FwaXRhbG9uZQ==',
  'YWVnaXM=',
]

export const bannedNames = BANNED_BASE64.map(b => Buffer.from(b, 'base64').toString('utf8'))

// Match each name only when it is not glued to another alphanumeric character.
// We can't use "\b": it counts "_" as a word char, so "\b...\b" would miss the
// real leak shape "..._Engineer_<name>.docx" (underscore before) and camel/join
// forms. "(?<![a-z0-9])...(?![a-z0-9])" (case-insensitive) treats "_", ".", "-"
// and spaces as separators, so it still rejects a short token buried inside an
// identifier (a made-up "qzx" would not match inside "fooQzxBar").
export const bannedPatterns = bannedNames.map(name => {
  const body = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
  return new RegExp(`(?<![a-z0-9])${body}(?![a-z0-9])`, 'i')
})
