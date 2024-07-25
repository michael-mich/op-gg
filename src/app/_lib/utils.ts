export const fetchApi = async (
  url: string,
  cacheValue?: { cache: 'force-cache' }
): Promise<any | void> => {
  try {
    const response = await fetch(url, cacheValue);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = response.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
}