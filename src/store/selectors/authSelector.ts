import { RootState } from "../config/configStore";

export const isLoginedSelector = (state: RootState) => state.authReducer.isLogined;
