test('Syntax', () => {
  const css = require('../fixtures/style.css')

  expect(css).toEqual('a { color: black }\n')
})
