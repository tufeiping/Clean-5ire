interface IElectronAPI {
  // ... existing definitions ...
  getUserDataPath: () => Promise<string>;
  saveFile: (args: { path: string; data: Buffer }) => Promise<boolean>;
  getAvatarPath: () => Promise<string>;
  saveAvatar: (base64Data: string) => Promise<boolean>;
}

interface Window {
  electron: IElectronAPI;
}
