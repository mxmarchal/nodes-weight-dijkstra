type Comparator<T> = (a: T, b: T) => boolean;

export class PriorityQueue<T> {
  private heap: T[];
  private comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this.heap = [];
    this.comparator = comparator;
  }

  enqueue(value: T): void {
    this.heap.push(value);
    this.siftUp();
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const poppedValue = this.heap[0];
    const lastItem = this.heap.pop();
    if (this.heap.length > 0 && lastItem !== undefined) {
      this.heap[0] = lastItem;
      this.siftDown();
    }
    return poppedValue;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private siftUp(): void {
    let nodeIndex = this.heap.length - 1;
    while (
      nodeIndex > 0 &&
      this.compare(nodeIndex, this.getParentIndex(nodeIndex))
    ) {
      this.swap(nodeIndex, this.getParentIndex(nodeIndex));
      nodeIndex = this.getParentIndex(nodeIndex);
    }
  }

  private siftDown(): void {
    let nodeIndex = 0;
    while (
      (this.getLeftChildIndex(nodeIndex) < this.heap.length &&
        this.compare(this.getLeftChildIndex(nodeIndex), nodeIndex)) ||
      (this.getRightChildIndex(nodeIndex) < this.heap.length &&
        this.compare(this.getRightChildIndex(nodeIndex), nodeIndex))
    ) {
      const smallerChildIndex =
        this.getRightChildIndex(nodeIndex) < this.heap.length &&
        this.compare(
          this.getRightChildIndex(nodeIndex),
          this.getLeftChildIndex(nodeIndex)
        )
          ? this.getRightChildIndex(nodeIndex)
          : this.getLeftChildIndex(nodeIndex);

      this.swap(nodeIndex, smallerChildIndex);
      nodeIndex = smallerChildIndex;
    }
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private compare(i: number, j: number): boolean {
    return this.comparator(this.heap[i], this.heap[j]);
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}
