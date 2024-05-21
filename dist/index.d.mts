type CookieObject = {
    name: string;
    value: string;
    expires?: string | number | Date | boolean;
    path?: string;
    domain?: string;
    httponly?: boolean;
    secure?: boolean;
    samesite?: String;
};
declare const cookie: {
    stringify: (obj: CookieObject) => string;
    parse: (string: any, path: any, domain: any) => CookieObject;
    tokenize: (array: CookieObject[]) => string;
};

export { cookie as default };
