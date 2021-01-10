export default function delimList(myList: string[]): string {
  const l = myList.map((t) => `"${t}"`);
  return l.join(', ');
}

export function lowerCaseList(myList: string[]): string[] {
  const l = myList.map((t) => t.toLowerCase());
  return l;
}
