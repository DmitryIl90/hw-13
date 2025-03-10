import { LoginDto } from '../DTO/LoginDto'
import { APIRequestContext, APIResponse } from 'playwright-core'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from '../DTO/OrderDto'

const serverURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

export class ApiClient {
  static instance: ApiClient
  private request: APIRequestContext
  jwt: string = ''

  private constructor(request: APIRequestContext) {
    this.request = request
  }

  public static async getInstance(request: APIRequestContext): Promise<ApiClient> {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(request)
      await this.instance.requestJwt()
    }

    return ApiClient.instance
  }

  async requestJwt(): Promise<void> {
    console.log('Requesting JWT')
    const responseLogin = await this.request.post(`${serverURL}${loginPath}`, {
      data: LoginDto.createLoginWithCorrectData(),
    })

    if (responseLogin.status() !== StatusCodes.OK) {
      throw new Error(`Request failed with status ${responseLogin.status()}`)
    }

    this.jwt = await responseLogin.text()
    console.log(`JWT received: ${this.jwt}`)
  }

  async createOrderAndReturnOrderId(): Promise<number> {
    const response = await this.request.post(`${serverURL}${orderPath}`, {
      data: OrderDto.generateRandomOrderDto(),
      headers: {
        Authorization: 'Bearer ' + this.jwt,
      },
    })
    const responseBody = await response.json()
    return responseBody.id
  }
  async deleteOrder(orderId: number): Promise<void> {
    await this.request.delete(`${serverURL}${orderPath}/${orderId}`, {
      headers: {
        Authorization: 'Bearer ' + this.jwt,
      },
    })
  }
  async searchOrder(orderId: number): Promise<APIResponse> {
    return await this.request.get(`${serverURL}${orderPath}/${orderId}`, {
      headers: {
        Authorization: 'Bearer ' + this.jwt,
      },
    })
  }
}
