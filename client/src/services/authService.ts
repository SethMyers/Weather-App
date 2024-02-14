class AuthService {
  private token: string | null = null;

  public setToken(token: string): void {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
