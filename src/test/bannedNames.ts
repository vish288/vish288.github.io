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

// Whole-word matcher per name (spaces allow any whitespace run), so short
// tokens never match inside unrelated identifiers (e.g. "REDACTED7" in "modalClient").
export const bannedPatterns = bannedNames.map(
  name =>
    new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')}\\b`, 'i')
)
