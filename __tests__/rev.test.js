import reverse from '../src/rev.js';

test('reverse', () => {
  expect(reverse('hello')).toEqual('olleh');
  expect(reverse('')).toEqual('');
});