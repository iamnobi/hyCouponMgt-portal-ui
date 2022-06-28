import SecureLS from 'secure-ls';
let ls = new SecureLS({ isCompression: false });

export function setEncryptLocalStorage(name, value) {
  ls.set(name, value);
}

export function getDecryptLocalStorage(name) {
  return ls.get(name) ? JSON.parse(ls.get(name)) : null;
}

export function getDecryptLocalStorageStringData(name) {
  return ls.get(name);
}
