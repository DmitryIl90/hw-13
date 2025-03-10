import { expect, test } from '@playwright/test'

test('Get empty array all users test', async ({ request }) => {
  const allUsersResponse = await request.get('http://localhost:3000/users')
  const json = await allUsersResponse.json()
  expect(json.length).toBe(0)
})
