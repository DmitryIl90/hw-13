import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

test('TL-14-5 get empty array all users test', async ({ request }) => {
  const allUsersResponse = await request.get('http://localhost:3000/users')
  const json = await allUsersResponse.json()
  expect(json.length).toBe(0)
  const baseURL = 'http://localhost:3000/users'

  test.describe('User management API with loop', () => {
    test.beforeEach(async ({ request }) => {
      const response = await request.get(`${baseURL}`)
      const responseBody = await response.json()
      const numberOfObjects = responseBody.length

      const userIDs = []
      for (let i = 0; i < numberOfObjects; i++) {
        const userID = responseBody[i].id
        userIDs.push(userID)
      }

      for (let i = 0; i < numberOfObjects; i++) {
        const response = await request.delete(`${baseURL}/${userIDs[i]}`)
        expect.soft(response.status()).toBe(StatusCodes.OK)
      }

      const responseAfterDelete = await request.get(`${baseURL}`)
      expect(responseAfterDelete.status()).toBe(StatusCodes.OK)

      const responseBodyEmpty = await responseAfterDelete.text()
      expect(responseBodyEmpty).toBe('[]')
    })

    test('TL-14-5 get empty array all users test', async ({ request }) => {
      const allUsersResponse = await request.get('http://localhost:3000/users')
      const json = await allUsersResponse.json()
      expect(json.length).toBe(0)
    })
  })
})
