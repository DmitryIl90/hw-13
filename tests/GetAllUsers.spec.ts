import { expect, test } from '@playwright/test'

test('TL-14-4 get all users test', async ({ request }) => {
  await request.post('http://localhost:3000/users')
  await request.post('http://localhost:3000/users')
  await request.post('http://localhost:3000/users')
  const allUsersResponse = await request.get('http://localhost:3000/users')

})
