
export interface ApiResponse<T = any> {
  code?: number;
  data?: T;
  msg?: string;
  time?: number;
}

export type ApiPromise<T = any> = Promise<ApiResponse<T>>
