import { ResponseLoan } from './ResponseLoan'

export class LoanDto {
  income: number
  debt: number
  age: number
  employed: boolean
  loanAmount: number
  loanPeriod: number

  constructor(
    income: number,
    debt: number,
    age: number,
    employed: boolean,
    loanAmount: number,
    loanPeriod: number,
  ) {
    this.income = income
    this.debt = debt
    this.age = age
    this.employed = employed
    this.loanAmount = loanAmount
    this.loanPeriod = loanPeriod
  }

  static generateValidLowRisk(): LoanDto {
    return new LoanDto(10000, 100, 20, true, 100, 12)
  }

  static generateValidMediumRisk(): any {
    return new LoanDto(10000, 0, 20, true, 500, 6)
  }

  static generateValidHighRisk(): any {
    return new LoanDto(10000, 0, 17, true, 50000, 6)
  }

  static generateNegativeVeryHighRisk(): any {
    return new LoanDto(10, 100, 30, true, 10, 6)
  }

  static generateNegativeDecisionYongCustomerLoanDto(): LoanDto {
    return new LoanDto(1000, 100, 13, false, 1000, 36)
  }

  static generateEmptyLoanDto(): any {
    return {}
  }

  static serializeResponse(json: any): ResponseLoan {
    return {
      riskScore: json?.riskScore,
      riskLevel: json?.riskLevel,
      riskPeriods: json?.riskPeriods,
      applicationId: json?.applicationId,
      riskDecision: json?.riskDecision,
    }
  }
}
