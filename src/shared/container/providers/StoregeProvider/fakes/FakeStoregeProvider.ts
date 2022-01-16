import IStoregeProvider from '../models/IStoregeProvider';

export default class FakeStoregeProvider implements IStoregeProvider {
  private storege: string[] = [];
  public async saveFile(file: string): Promise<string> {
    this.storege.push(file);

    return file;
  }
  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.storege.findIndex(
      (storegeFile) => storegeFile === file
    );

    this.storege.splice(findIndex, 1);
  }
}
