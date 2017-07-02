test('Parser as a string', () => {
  const css = require('../fixtures/style.css')

  expect(css).toEqual('a {\n  color: black\n}\n')
})
