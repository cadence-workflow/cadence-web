export default function stripEscapesFromNextLog(str: string): string {
  // This regex matches all ANSI escape sequences that next.js likes to put in the console logs
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}
