import { defaultErrorData } from "../constants/defaultErrorData";
import { IErrorContext } from "../interfaces/IErrorContext";

export const defaultErrorState: IErrorContext = {
  errorData: defaultErrorData,
  showError: false,
};
