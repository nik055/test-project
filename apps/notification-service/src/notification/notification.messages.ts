export function createNotificationMessageForMoneySender(
  userIdReceivingMoney: string,
  amountToTransfer: number,
): string {
  return `You have sent ${amountToTransfer}$ to the user with id: ${userIdReceivingMoney}`;
}

export function createNotificationMessageForMoneyReceiver(
  userIdSendingMoney: string,
  amountToTransfer: number,
): string {
  return `You have received ${amountToTransfer}$ from the user with id: ${userIdSendingMoney}`;
}
