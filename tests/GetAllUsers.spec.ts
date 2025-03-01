import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

test('TL-14-4 get all users test', async ({ request }) => {
  await request.post('http://localhost:3000/users')
  await request.post('http://localhost:3000/users')
  await request.post('http://localhost:3000/users')
  const allUsersResponse = await request.get('http://localhost:3000/users')

  expect(allUsersResponse.status()).toBe(StatusCodes.OK);

})
