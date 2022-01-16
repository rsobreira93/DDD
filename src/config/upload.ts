import * as multer from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tempFolder,
  uploadFolder: path.resolve(tempFolder, 'uploads'),

  storage: multer.diskStorage({
    destination: tempFolder,
    filename(request, file, cb) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};
