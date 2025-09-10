export interface CompletedTask {
  taskName: string;
  pid: string;
  duration: number;
}

export interface UnmatchedEvent {
  taskName: string;
  pid: string;
  timestamp: Date;
}