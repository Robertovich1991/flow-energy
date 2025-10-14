import appsFlyer from 'react-native-appsflyer';

export interface AppsFlyerEventData {
  [key: string]: any;
}

export const logAppsFlyerEvent = (eventName: string, eventData?: AppsFlyerEventData) => {
  try {
    console.log(`AppsFlyer Event: ${eventName}`, eventData);
    appsFlyer.logEvent(
      eventName,
      eventData || {},
      (result) => {
        console.log(`AppsFlyer Event ${eventName} logged successfully:`, result);
      },
      (error) => {
        console.error(`AppsFlyer Event ${eventName} failed:`, error);
      }
    );
  } catch (error) {
    console.error(`AppsFlyer Event ${eventName} error:`, error);
  }
};

// Predefined event loggers for common actions
export const logUserRegistration = (userEmail?: string) => {
  logAppsFlyerEvent('af_complete_registration', {
    af_registration_method: 'email',
    ...(userEmail && { af_email: userEmail })
  });
};

export const logCardPurchase = (cardId: number, cardTitle: string, price: number, currency: string = 'USD') => {
  logAppsFlyerEvent('af_purchase', {
    af_content_id: cardId.toString(),
  af_content_type: 'purchaseCard',
  });
};

export const logStreamPurchase = (streamId: number, streamTitle: string, price: number, currency: string = 'USD') => {
  logAppsFlyerEvent('af_purchase', {
    af_content_id: streamId.toString(),
    af_content_type: 'stream',
    af_content_name: streamTitle,
    af_revenue: price,
    af_currency: currency,
    af_quantity: 1
  });
};

export const logCoinsPurchase = (coinsAmount: number, price: number, currency: string = 'USD') => {
    console.log(coinsAmount, price, currency,'coinsAmount, price, currency');
    
  logAppsFlyerEvent('af_purchase', {
    af_content_id: `coins_${coinsAmount}`,
    af_content_type: 'coins',
    af_content_name: `${coinsAmount} Coins`,
    af_revenue: price,
    af_currency: currency,
    af_quantity: 1
  });
};
