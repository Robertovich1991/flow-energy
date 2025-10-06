import { RootState } from "../config/configStore";

export const ownedStreamsListSelector = (state: RootState) => state.ownedStreamsReducer.ownedStreamsList;
export const ownedStreamsLoadingSelector = (state: RootState) => state.ownedStreamsReducer.loading;
export const ownedStreamsErrorSelector = (state: RootState) => state.ownedStreamsReducer.error;
