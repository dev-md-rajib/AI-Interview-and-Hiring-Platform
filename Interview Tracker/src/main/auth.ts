import { safeStorage } from 'electron';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { AuthResponse, LoginCredentials, User } from '../shared/types';
import { apiClient } from '../shared/apiClient';

const AUTH_FILE_PATH = path.join(app.getPath('userData'), 'auth_session.enc');

export class AuthManager {
  private currentUser: User | null = null;
  private token: string | null = null;

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const authData = await apiClient.login(credentials);
    this.token = authData.token;
    this.currentUser = authData.user;

    if (credentials.rememberMe) {
      this.saveSecureToken(authData);
    } else {
      this.clearSavedToken();
    }

    return authData;
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
    this.token = null;
    apiClient.setToken(null);
    this.clearSavedToken();
  }

  public getStoredAuth(): { token: string; user: User } | null {
    if (this.token && this.currentUser) {
      return { token: this.token, user: this.currentUser };
    }

    try {
      if (!fs.existsSync(AUTH_FILE_PATH)) {
        return null;
      }

      const encryptedBuffer = fs.readFileSync(AUTH_FILE_PATH);
      let decryptedStr: string;

      if (safeStorage && safeStorage.isEncryptionAvailable()) {
        decryptedStr = safeStorage.decryptString(encryptedBuffer);
      } else {
        decryptedStr = encryptedBuffer.toString('utf8');
      }

      const session = JSON.parse(decryptedStr);
      if (session && session.token && session.user) {
        this.token = session.token;
        this.currentUser = session.user;
        apiClient.setToken(session.token);
        return session;
      }
    } catch (err) {
      console.error('Failed to read or decrypt saved auth session:', err);
      this.clearSavedToken();
    }

    return null;
  }

  private saveSecureToken(authData: AuthResponse): void {
    try {
      const dataStr = JSON.stringify(authData);
      let bufferToWrite: Buffer;

      if (safeStorage && safeStorage.isEncryptionAvailable()) {
        bufferToWrite = safeStorage.encryptString(dataStr);
      } else {
        bufferToWrite = Buffer.from(dataStr, 'utf8');
      }

      fs.writeFileSync(AUTH_FILE_PATH, bufferToWrite);
    } catch (err) {
      console.error('Failed to save secure auth token:', err);
    }
  }

  private clearSavedToken(): void {
    try {
      if (fs.existsSync(AUTH_FILE_PATH)) {
        fs.unlinkSync(AUTH_FILE_PATH);
      }
    } catch (err) {
      console.error('Failed to clear saved token file:', err);
    }
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getToken(): string | null {
    return this.token;
  }
}

export const authManager = new AuthManager();
