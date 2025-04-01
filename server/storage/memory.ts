// src/storage/memory.ts
const storage = new Map<string, any>();

export function getData(key: string) {
  return storage.get(key);
}

export function setData(key: string, value: any) {
  storage.set(key, value);
}