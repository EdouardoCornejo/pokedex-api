import { AxiosInstance } from 'axios';
import { HttpAdapter } from 'src/common/interfaces/http-adapter.interface';

export class AxiosAdapter implements HttpAdapter {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axiosInstance.get<T>(url);
      return data;
    } catch (error) {
      throw new Error(`Error in GET request: ${error.message}`);
    }
  }
  async post<T>(url: string, body: Record<string, unknown>): Promise<T> {
    try {
      const { data } = await this.axiosInstance.post<T>(url, body);
      return data;
    } catch (error) {
      throw new Error(`Error in POST request: ${error.message}`);
    }
  }
  async put<T>(url: string, body: Record<string, unknown>): Promise<T> {
    try {
      const { data } = await this.axiosInstance.put<T>(url, body);
      return data;
    } catch (error) {
      throw new Error(`Error in PUT request: ${error.message}`);
    }
  }
  async patch<T>(url: string, body: Record<string, unknown>): Promise<T> {
    try {
      const { data } = await this.axiosInstance.patch<T>(url, body);
      return data;
    } catch (error) {
      throw new Error(`Error in PATCH request: ${error.message}`);
    }
  }
  async delete<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axiosInstance.delete<T>(url);
      return data;
    } catch (error) {
      throw new Error(`Error in DELETE request: ${error.message}`);
    }
  }
}
