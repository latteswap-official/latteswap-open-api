export interface IIterable<T> {
  [Symbol.iterator](): Iterator<T>
}

export interface IterableIterator<T> extends Iterator<T> {
  [Symbol.iterator](): IterableIterator<T>
}
