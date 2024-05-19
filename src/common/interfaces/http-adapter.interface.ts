export abstract class HttpAdapter {
  abstract get<T>(url: string): Promise<T>;
  abstract post<T>(url: string, body: Record<string, unknown>): Promise<T>;
  abstract put<T>(url: string, body: Record<string, unknown>): Promise<T>;
  abstract patch<T>(url: string, body: Record<string, unknown>): Promise<T>;
  abstract delete<T>(url: string): Promise<T>;
}
