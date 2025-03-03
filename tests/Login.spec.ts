import { expect, test } from '@playwright/test'
import { LoginDto } from './DTO/LoginDto'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './DTO/OrderDto'
import { ApiClient } from '../api/ApiClient'

test.describe('Login tests', async () => {
  test('TL-12-1 Successful authorization', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    expect(apiClient.jwt).not.toBeUndefined()
  })

  test('TL-12-2 Successful authorization and order creation', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)

    const responseCreateOrder = await request.post(`https://backend.tallinn-learning.ee/orders`, {
      data: OrderDto.generateRandomOrderDto(),
      headers: {
        Authorization: 'Bearer ' + apiClient.jwt,
      },
    })
    console.log(await responseCreateOrder.text())
    expect(responseCreateOrder.status()).toBe(StatusCodes.OK)
  })

  test('TL-12-3 Successful authorization, order creation and order status', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    const responseCreateOrder = await request.post(`https://backend.tallinn-learning.ee/orders`, {
      data: OrderDto.generateRandomOrderDto(),
      headers: {
        Authorization: 'Bearer ' + apiClient.jwt,
      },
    })
    expect(responseCreateOrder.status()).toBe(StatusCodes.OK)
    const createdOrder = OrderDto.serializeResponse(await responseCreateOrder.json())
    expect(createdOrder.id).toBeDefined()
    expect(createdOrder.id).toBeGreaterThan(0)

    const responseOrderStatus = await request.get(
      `https://backend.tallinn-learning.ee/orders/${createdOrder.id}`,
      {
        headers: {
          Authorization: 'Bearer ' + apiClient.jwt,
        },
      },
    )
    expect(responseOrderStatus.status()).toBe(StatusCodes.OK)
    const requestedOrder = OrderDto.serializeResponse(await responseOrderStatus.json())
    expect(requestedOrder.status).toBeDefined()
    expect(requestedOrder.status).toBe('OPEN')
  })

  test('TL-12-4 Successful authorization, order creation, order status and delete', async ({
    request,
  }) => {
    const responseLogin = await request.post('https://backend.tallinn-learning.ee/login/student', {
      data: LoginDto.createLoginWithCorrectData(),
    })
    const responseCreateOrder = await request.post('https://backend.tallinn-learning.ee/orders', {
      data: OrderDto.generateRandomOrderDto(),
      headers: {
        Authorization: `Bearer ${await responseLogin.text()}`,
      },
    })
    const createdOrder = OrderDto.serializeResponse(await responseCreateOrder.json())
    const deleteOrder = await request.delete(
      `https://backend.tallinn-learning.ee/orders/${createdOrder.id}`,
      {
        headers: {
          Authorization: `Bearer ${await responseLogin.text()}`,
        },
      },
    )
    expect(deleteOrder.status()).toBe(StatusCodes.OK)
  })
})
