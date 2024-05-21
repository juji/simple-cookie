function printExpires(expires) {
  if (!expires)
    return false;
  let date = /* @__PURE__ */ new Date();
  if (typeof expires === "string")
    date = new Date(expires);
  if (typeof expires === "number")
    date = new Date(expires);
  return "Expires=" + date.toUTCString() + ";Max-Age=" + Math.round(
    (date.valueOf() - (/* @__PURE__ */ new Date()).valueOf()) / 1e3
  );
}
const cookie = {
  /** 
   * From a CookieObject, returns string. 
   * @param obj the CookieObject 
   * @returns a cookie string
   * */
  stringify: function(obj) {
    let value;
    try {
      value = encodeURIComponent(obj.value);
    } catch (e) {
      value = obj.value;
    }
    return [
      obj.name + "=" + value,
      typeof obj.expires !== "undefined" && obj.expires ? printExpires(obj.expires) : "",
      typeof obj.path !== "undefined" ? obj.path ? "Path=" + obj.path : "" : "Path=/",
      typeof obj.domain !== "undefined" && obj.domain ? "Domain=" + obj.domain : "",
      typeof obj.secure !== "undefined" && obj.secure ? "secure" : "",
      typeof obj.httponly !== "undefined" && obj.httponly ? "HttpOnly" : "",
      typeof obj.samesite !== "undefined" && obj.samesite ? "SameSite=" + obj.samesite : ""
    ].join(";").replace(/;+/g, ";").replace(/;$/, "").replace(/;/g, "; ");
  },
  /** 
   * From a string, returns CookieObject. 
   * @param string the string
   * @param path the path to use in CookieObject
   * @param domain the domain to use in CookieObject
   * @returns CookieObject
   * */
  parse: function(string, path, domain) {
    const s = string.replace(/;\s+/g, ";").split(";").map((s2) => s2.replace(/\s+\s+/g, "=").split("="));
    let n = s.shift();
    if (!n)
      throw new Error("malformed cookie");
    const obj = {
      name: "",
      value: "",
      expires: false,
      httponly: false,
      secure: false,
      path: path || "/",
      domain: domain || "",
      samesite: ""
    };
    const f = {
      httponly() {
        obj.httponly = true;
      },
      secure() {
        obj.secure = true;
      },
      expires(v) {
        obj.expires = new Date(v);
      },
      "max-age"(v) {
        if (obj.expires)
          return;
        obj.expires = new Date((/* @__PURE__ */ new Date()).valueOf() + v * 1e3);
      },
      path(v) {
        obj.path = v;
      },
      domain(v) {
        obj.domain = v;
      },
      samesite(v) {
        obj.samesite = v;
      }
    };
    let I;
    for (let i in s) {
      I = s[i][0].toLowerCase();
      if (typeof f[I] !== "undefined")
        f[I](s[i].length == 2 ? s[i][1] : "");
    }
    if (!obj.expires)
      obj.expires = 0;
    obj.name = n.shift() || "";
    if (!obj.name)
      throw new Error("cookie name is empty");
    n = n.map((s2) => {
      let fi;
      try {
        fi = decodeURIComponent(s2);
      } catch (e) {
        fi = s2;
      }
      return fi;
    });
    obj.value = n.join("=");
    return obj;
  },
  /** 
   * Tokenize CookieObject. 
   * @param array array of CookieObject
   * @returns Tokenized cookies
   * */
  tokenize: function(array) {
    return array.map((s) => s.name + "=" + s.value).join("; ");
  }
};

export { cookie as default };
