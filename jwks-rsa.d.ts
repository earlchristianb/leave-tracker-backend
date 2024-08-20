declare module 'jwks-rsa' {
  interface JwksClientOptions {
    jwksUri: string;
    cache?: boolean;
    cacheMaxEntries?: number;
    cacheMaxAge?: number;
    rateLimit?: boolean;
    jwksRequestsPerMinute?: number;
    proxy?: string;
    requestHeaders?: Record<string, string>;
    timeout?: number;
  }

  interface SigningKey {
    kid: string;
    nbf: number;
    publicKey?: string;
    rsaPublicKey?: string;
  }

  interface SigningKeyCallback {
    (err: Error | null, key: SigningKey): void;
  }

  class JwksClient {
    constructor(options: JwksClientOptions);
    getSigningKey(kid: string, cb: SigningKeyCallback): void;
  }

  function expressJwtSecret(options: JwksClientOptions): any;
}
