import { APIRequestContext } from 'playwright-core'

export class ApiClient {
  private static instance: ApiClient;
  private request: APIRequestContext;
  private token: string | null = null;

  private constructor(request: APIRequestContext) {
    this.request = request;
  }

  public static getInstance(request: APIRequestContext): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(request);
    }
    return ApiClient.instance;
  }

  public async login(username: string, password: string): Promise<void> {

    this.token = 'jwt_token_example';
    console.log(`Токен получен: ${this.token}`);
  }

  public async createOrder(orderDetails: any): Promise<void> {
    if (!this.token) {
      throw new Error('Необходима авторизация');
    }

    console.log('Создание заказа с деталями:', orderDetails);
    // Здесь можно выполнить запрос с использованием токена, например:
    // fetch('https://api.example.com/orders', { method: 'POST', headers: { Authorization: `Bearer ${this.token}` } })
  }

  // Метод для получения заказа
  public async getOrder(orderId: string): Promise<void> {
    if (!this.token) {
      throw new Error('Необходима авторизация');
    }

    // Логика для получения заказа
    console.log(`Получение заказа с ID: ${orderId}`);
    // Например:
    // fetch(`https://api.example.com/orders/${orderId}`, { method: 'GET', headers: { Authorization: `Bearer ${this.token}` } })
  }

  // Метод для удаления заказа
  public async deleteOrder(orderId: string): Promise<void> {
    if (!this.token) {
      throw new Error('Необходима авторизация');
    }

    // Логика для удаления заказа
    console.log(`Удаление заказа с ID: ${orderId}`);
    // Например:
    // fetch(`https://api.example.com/orders/${orderId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${this.token}` } })
  }
}