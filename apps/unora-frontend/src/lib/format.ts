export function formatRelativeDay(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    return "Today";
  }
  if (days === 1) {
    return "Yesterday";
  }
  if (days < 7) {
    return `${days} days ago`;
  }

  return d.toLocaleDateString(undefined, {month: "short", day: "numeric"});
}
