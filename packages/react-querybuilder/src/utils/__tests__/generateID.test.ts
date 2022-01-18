import { generateID } from '../generateID';

it('should generate unique IDs', () => {
  const id1 = generateID();
  const id2 = generateID();

  expect(id1).not.toBe(id2);
});
