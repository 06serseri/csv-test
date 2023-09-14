export class FinancialReportRow {
  constructor(
    public glCode: string,
    public glName: string,
    public periodToDateAmount: number | string,
    public periodToDatePercentage: number | string,
    public yearToDateAmount: number | string,
    public yearToDatePercentage: number | string,
    public adjustingJE: number | string,
    public yearToDateAmountAndAdjustingJERoundedToZeroDecimal: number | string,
    public roundingAdjustmentOneDollar: number | string,
    public finalAmount: number | string,
    public isBold: boolean
  ) {}
}
