class AuthService {
  private token: string | null = null;

  public setToken(token: string): void {
    // this.token = token; // memory based storage
    window.sessionStorage.setItem("authToken", token);
  }

  public getToken(): string | null {
    // return token; // memory based storage
    return window.sessionStorage.getItem("authToken") || null;
  }
}

export const authService = new AuthService();
