import { container } from 'tsyringe';

import IStoregeProvider from './StoregeProvider/models/IStoregeProvider';
import DiskStoregeProvider from './StoregeProvider/implementations/DiskStoregeProvider';

container.registerSingleton<IStoregeProvider>(
  'StoregeProvider',
  DiskStoregeProvider
);
