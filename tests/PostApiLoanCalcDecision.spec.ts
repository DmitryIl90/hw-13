import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import { LoanDto } from './DTO/LoanDto'

test('Successful decision of loan with correct data and Low Risk should receive code 200', async ({
                                                                                                    request,
                                                                                                  }) => {
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: LoanDto.generateValidLowRisk(),
    },
  )
  const responseBody = LoanDto.serializeResponse(await response.json())
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  console.log('Decision to loan:', responseBody.riskDecision)
  console.log('Risk level for your loan defined as:', responseBody.riskLevel)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskPeriods).toStrictEqual([12, 18, 24, 30, 36])
  expect.soft(responseBody.riskLevel).toBe('Low Risk')
  expect.soft(responseBody.riskScore).not.toBeNull()
  expect.soft(responseBody.riskDecision).toBe('positive')
})

test('Successful decision of loan with correct data and Medium Risk should receive code 200', async ({
                                                                                                       request,
                                                                                                     }) => {
  console.log(LoanDto.generateValidMediumRisk())
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: LoanDto.generateValidMediumRisk(),
    },
  )
  const responseBody = LoanDto.serializeResponse(await response.json())
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  console.log('Decision to loan:', responseBody.riskDecision)
  console.log('Risk level for your loan defined as:', responseBody.riskLevel)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskPeriods).toStrictEqual([6, 9, 12])
  expect.soft(responseBody.riskLevel).toBe('Medium Risk')
  expect.soft(responseBody.riskScore).not.toBeNull()
  expect.soft(responseBody.riskDecision).toBe('positive')
})

test('Successful decision of loan with correct data and High Risk should receive code 200', async ({
                                                                                                     request,
                                                                                                   }) => {
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: LoanDto.generateValidHighRisk(),
    },
  )
  const responseBody = LoanDto.serializeResponse(await response.json())
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  console.log('Decision to loan:', responseBody.riskDecision)
  console.log('Risk level for your loan defined as:', responseBody.riskLevel)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskPeriods).toStrictEqual([3, 6])
  expect.soft(responseBody.riskLevel).toBe('High Risk')
  expect.soft(responseBody.riskScore).not.toBeNull()
  expect.soft(responseBody.riskDecision).toBe('positive')
})

test('Unsuccessful decision of loan with correct data and Very High Risk should receive code 200', async ({
                                                                                                            request,
                                                                                                          }) => {
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: LoanDto.generateNegativeVeryHighRisk(),
    },
  )
  const responseBody = LoanDto.serializeResponse(await response.json())
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  console.log('Decision to loan:', responseBody.riskDecision)
  console.log('Risk level for your loan defined as:', responseBody.riskLevel)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskPeriods).toStrictEqual([])
  expect.soft(responseBody.riskLevel).toBe('Very High Risk')
  expect.soft(responseBody.riskScore).not.toBeNull()
  expect.soft(responseBody.riskDecision).toBe('negative')
})

test('Unsuccessful decision of loan for Young Customer and Very High Risk should receive code 200', async ({
                                                                                                             request,
                                                                                                           }) => {
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: LoanDto.generateNegativeDecisionYongCustomerLoanDto(),
    },
  )
  const responseBody = LoanDto.serializeResponse(await response.json())
  console.log('response status:', response.status())
  console.log('response body:', responseBody)
  console.log('Decision to loan:', responseBody.riskDecision)
  console.log('Risk level for your loan defined as:', responseBody.riskLevel)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskPeriods).toStrictEqual([])
  expect.soft(responseBody.riskLevel).toBe('Very High Risk')
  expect.soft(responseBody.riskScore).not.toBeNull()
  expect.soft(responseBody.riskDecision).toBe('negative')
})

test('Unsuccessful decision of loan with empty data should receive code 400', async ({
                                                                                       request,
                                                                                     }) => {
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: LoanDto.generateEmptyLoanDto(),
    },
  )
  console.log(response)
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
