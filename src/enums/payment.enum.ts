import { registerEnumType } from '@nestjs/graphql';

export enum Payment {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT CARD',
  PAYPAL = 'PAYPAL',
}

registerEnumType(Payment, {
  name: 'Payment',
  description: 'This is Enum for Payment Method Cash or Credit or Paypal',
});
