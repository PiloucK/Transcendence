export interface IErrorData {
  error: string;
  message: string;
  statusCode: number;
}

export const defaultErrorData: IErrorData = {
  error: "no error",
  message: "no error",
  statusCode: 0,
};