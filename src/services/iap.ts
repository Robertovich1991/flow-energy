
export async function purchaseProduct(sku: string) {
  // TODO: integrate expo-in-app-purchases or react-native-iap
  await new Promise(r => setTimeout(r, 500));
  return { success: true, transactionId: 'mock_'+Date.now(), sku };
}
