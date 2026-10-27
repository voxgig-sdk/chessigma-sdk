
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { ChessigmaSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = ChessigmaSDK.test()
    equal(testsdk instanceof ChessigmaSDK, true,
      'ChessigmaSDK.test() must return a client synchronously')
  })

})
