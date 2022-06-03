import { defaultErrorData, IErrorData } from "./IErrorData";

export interface IErrorContext {
  errorData: IErrorData;
  newError?: (errorData: IErrorData) => void;
  hideError?: () => void;
  showError: boolean;
}

export const defaultErrorState: IErrorContext = {
  errorData: defaultErrorData,
  showError: false,
};
