export interface WebSocketConnection {
  sendMessage(key: string, data: Record<string, unknown>): void;
  addListener(key: string, callback: () => void): boolean;
  removeListener(key: string): boolean;
}
