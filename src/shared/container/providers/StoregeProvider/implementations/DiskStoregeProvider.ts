import * as fs from 'fs';
import * as path from 'path';

import IStoregeProvider from '../models/IStoregeProvider';
import upload from '@config/upload';

export default class DiskStoregeProvider implements IStoregeProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(upload.tempFolder, file),
      path.resolve(upload.uploadFolder, file)
    );

    return file;
  }
  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(upload.uploadFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
