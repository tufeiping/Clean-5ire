interface IElectronAPI {
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => void;
    on: (channel: string, func: (...args: any[]) => void) => void;
  };
  openExternal: (url: string) => Promise<void>;
  ingestEvent: (events: any[]) => void;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
