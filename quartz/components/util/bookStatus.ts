export type BookStatus = "to-read" | "reading" | "finished"

export function getBookStatus(frontmatter: Record<string, any> | undefined): BookStatus {
  const raw = frontmatter?.date_finished
  if (!raw) return "to-read"

  const finishedDate = new Date(raw)
  if (isNaN(finishedDate.getTime())) return "to-read" // guard against malformed dates

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  finishedDate.setHours(0, 0, 0, 0)

  return finishedDate.getTime() > today.getTime() ? "reading" : "finished"
}