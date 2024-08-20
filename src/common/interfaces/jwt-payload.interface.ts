export interface JwtPayload {
  aud: string[];
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  org_code: string;
  permissions: string[];
  scp: string[];
  sub: string;
}
