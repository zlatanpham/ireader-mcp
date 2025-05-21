export function extractGoogleDocId(url: string) {
  const docsIdMatch = url.match(
    /^https:\/\/(www\.)?docs\.google\.com\/document\/d\/([a-zA-Z0-9-_]+)/,
  );

  return docsIdMatch ? docsIdMatch[2] || docsIdMatch[1] : null;
}
