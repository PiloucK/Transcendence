declare const envAwareFetch: (url: string, options?: Record<string, unknown>) => Promise<any>;
export { envAwareFetch as fetch };
