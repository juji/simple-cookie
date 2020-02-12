declare module 'simple-cookie' {
  export type Cookie = {
    name: string // cookie name
    value: string // cookie value
    expires?: string | number | Date  // expire date (default type is Date)
    path?: string // cookie path, defaults to /
    domain?: string // cookie domain
    httponly?: boolean // defaults to false
    secure?: boolean // defaults to false
  }

  export function parse(str: string, defaultPath?: string, defaultDomain?: string): Cookie
  export function stringify(cookie: Cookie): string
  export function tokenize(cookies: Array<Cookie>): string
}
