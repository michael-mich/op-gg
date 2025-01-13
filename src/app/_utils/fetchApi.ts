export const fetchApi = async <T>(endpoint: string): Promise<T | undefined> => {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error();
    }
    const data = await response.json() as T;
    return data;
  } catch {
    return;
  }
}