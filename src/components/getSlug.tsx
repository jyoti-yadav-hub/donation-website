export function getSlug(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace("&", "and")
    .replace(/[&_\/\\#,+()$~%.'":*?<>{}]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
