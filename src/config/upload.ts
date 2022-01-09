import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
    directory: path.resolve(__dirname, '..', '..', 'tmp'),

    storage: multer.diskStorage({
        destination: tempFolder,
        filename(request, file, cb){
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;

            return cb(null, fileName);
        },
    }),
}
