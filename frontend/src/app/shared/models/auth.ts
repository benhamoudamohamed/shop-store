export type AuthType = 'login' | 'whoami';

export interface AuthDTO {
  email: string;
  password: string;
}
