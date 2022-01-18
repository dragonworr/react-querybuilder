import { c } from '../c';

it('should concatenate strings', () => {
  expect(c()).toBe('');
  expect(c('a')).toBe('a');
  expect(c('a', 'b')).toBe('a b');
  expect(c('a', 'b', 'c')).toBe('a b c');
  expect(c('a', '', 'c')).toBe('a  c');
});
