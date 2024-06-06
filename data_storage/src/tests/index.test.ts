test(`two plus two is four`, () =>
 {
 const a = (b:number, c:number) =>
 {
 return b+c;
 };
 expect(a(2, 2)).toBe(4);
 });
