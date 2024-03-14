export const AmIAuthenticated = async () => {
  try {
    const res = await fetch('/api/check-logged-in', { credentials: 'include' });
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    return data.isAuthenticated;
  } catch (error) {
    console.error("Auth check failed:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};
