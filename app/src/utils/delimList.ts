export function delimList(myList: string[]): string {
  const l = myList.map((t) => `"${t}"`);
  return l.join(', ');
}
