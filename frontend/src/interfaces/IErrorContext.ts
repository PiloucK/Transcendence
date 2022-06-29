import { IErrorData } from "./IErrorData";

export interface IErrorContext {
  errorData: IErrorData;
  newError?: (errorData: IErrorData) => void;
  hideError?: () => void;
  showError: boolean;
}
