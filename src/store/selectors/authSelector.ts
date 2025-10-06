import { RootState } from "../config/configStore";

export const isLoginedSelector = (state: RootState) => state.authInfo.isLogined;
export const coinsBalanceSelector = (state: RootState) => state.authInfo.coinsBalance;
