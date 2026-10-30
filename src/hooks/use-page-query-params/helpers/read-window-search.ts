export default function readWindowSearch(): string {
  return window.location.search.slice(1);
}
