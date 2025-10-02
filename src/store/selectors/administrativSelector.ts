import { IAdministrativ } from "../slices/administrativSlice";

export const errorSelector = ({ administrativeReducer: { error } }: { administrativeReducer: IAdministrativ }) => error;