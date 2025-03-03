import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './DTO/OrderDto'
import { ApiClient } from './api/api-client.spec'

test.describe('Tests with API client', async () => {
  test('Verify if username and login are valid with API client, response returns status code "OK" and correct jwt', async ({
    request,
  }) => {
    const apiClient = await ApiClient.getInstance(request)
    expect(/^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(apiClient.jwt)).toBe(true)
  })

  test('Test order creation with API client', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    const responseCreateOrder = await request.post('https://backend.tallinn-learning.ee/orders', {
      data: OrderDto.generateRandomOrderDto(),
      headers: {
        Authorization: 'Bearer ' + apiClient.jwt,
      },
    })
    expect(responseCreateOrder.status()).toBe(StatusCodes.OK)
  })

  test('Test order creation and order search with API client', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    const orderId = await apiClient.createOrderAndReturnOrderId()

    const responseOrderStatus = await apiClient.searchOrder(orderId)
    expect(responseOrderStatus.status()).toBe(StatusCodes.OK)

    const requestedOrder = OrderDto.serializeResponse(await responseOrderStatus.json())
    expect(requestedOrder.status).toBeDefined()
    expect(requestedOrder.status).toBe('OPEN')
  })

  test('Test order deletion with API client is not found in search result', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    const orderId = await apiClient.createOrderAndReturnOrderId()
    await apiClient.deleteOrder(orderId)

    const searchStatus = await apiClient.searchOrder(orderId)
    const headers = searchStatus.headers()
    expect(searchStatus.status()).not.toBe(StatusCodes.NOT_FOUND)
    expect(headers['content-length']).toBe('0')
  })
})
