import { PrismaClientError } from '../types/PrismaClientError';
import { UniqueConstraintError } from '../types/UniqueConstraintError';
import { DataBaseError } from '../types/DataBaseError';

enum PrimaError {
  UniqueConstraintFaild = 'P2002',
}

export const handeDataBaseErrors = (e: PrismaClientError) => {
  switch (e.code) {
    case PrimaError.UniqueConstraintFaild:
      return new UniqueConstraintError(e);
    default:
      return new DataBaseError(e.message);
  }
};
