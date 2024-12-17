import { ApplicationException } from './application.exception';

export class FileNotImageException extends ApplicationException {
  constructor(error?: string) {
    super(422, 'Invalid image', error);
  }
}

export class FileSizeException extends ApplicationException {
  constructor(error?: string) {
    super(422, 'File size is more than what is allowed', error);
  }
}

export class FileTypeException extends ApplicationException {
  constructor(error?: string) {
    super(422, 'File is not allowed', error);
  }
}
