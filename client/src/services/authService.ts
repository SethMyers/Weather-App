class AuthService {
  private token: string | null = null;

  public setToken(token: string): void {
    window.sessionStorage.setItem("authToken", token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem("authToken") || null;
  }
}

export const authService = new AuthService();
