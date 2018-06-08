const DEBUG = true;

// https://stackoverflow.com/a/2117523/80410
export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    let r = (Math.random() * 16) | 0;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function log(...args: any[]) {
  if (DEBUG) {
    console.log("AUTOTUNE", ...args);
  }
}

export function error(...args: any[]) {
  if (DEBUG) {
    console.error("AUTOTUNE", ...args);
  }
}

export function getOwnPropertyValues<T>(x: { [name: string]: T }): T[] {
  return Object.getOwnPropertyNames(x).map(n => x[n]);
}

export function mapObject<T, S>(
  x: { [name: string]: T },
  f: (v: T, k: string) => S
): { [name: string]: S } {
  let result: { [name: string]: S } = {};
  Object.getOwnPropertyNames(x).forEach(n => (result[n] = f(x[n], n)));
  return result;
}

export function http(
  method: "POST" | "GET",
  url: string,
  data: any = undefined
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof XMLHttpRequest === "undefined") {
      // TODO support node
      return reject("Not running in browser");
    }

    let request = new XMLHttpRequest();
    request.open(method, url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onerror = () => reject(request.statusText);
    request.onreadystatechange = () => {
      if (request.readyState == 4)
        if (request.status == 200) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject(`Request failed with status ${request.status}`);
        }
    };
    if (data !== undefined) {
      request.send(JSON.stringify(data));
    } else {
      request.send();
    }
  });
}