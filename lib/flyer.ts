export function toDirectImageUrl(url: string) {
  const m = url.match(/\/d\/([\w-]+)/) || url.match(/[?&]id=([\w-]+)/);
  return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1000` : url;
}

export function splitFlyer(raw = "") {
  // Calendar sometimes returns HTML once a description was edited in the web UI
  const text = raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&");

  const match = text.match(/^\s*Flyer:\s*(\S+)\s*$/im);
  if (!match) return { description: text.trim(), flyerUrl: undefined };

  return {
    description: text.replace(match[0], "").trim(),
    flyerUrl: toDirectImageUrl(match[1]),
  };
}