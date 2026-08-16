declare module 'https-proxy-agent' {
  import { Agent } from 'http';

  export class HttpsProxyAgent<T = string> extends Agent {
    constructor(proxy: T | URL);
  }
}

declare module 'socks-proxy-agent' {
  import { Agent } from 'http';

  export class SocksProxyAgent extends Agent {
    constructor(proxy: string);
  }
}
