export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export function validUsername(str) {
  return true;
}
