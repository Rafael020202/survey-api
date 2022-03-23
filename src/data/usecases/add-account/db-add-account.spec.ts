import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface Sut {
  encrypter: Encrypter
  dbAddAccount: DbAddAccount
};

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (password: string): Promise<string> {
      return await new Promise((resolve) => resolve('encrypted_password'));
    }
  }

  const encrypterStub = new EncrypterStub();

  return encrypterStub;
};

const makeSut = (): Sut => {
  const encrypter = makeEncrypterStub();
  const dbAddAccount = new DbAddAccount(encrypter);

  return {
    encrypter,
    dbAddAccount
  };
};

describe('DbAddAccount usecase', () => {
  test('Should call encrypter with correct password', async () => {
    const { encrypter, dbAddAccount } = makeSut();
    const encrypt = jest.spyOn(encrypter, 'encrypt');
    const account = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };

    await dbAddAccount.add(account);
    expect(encrypt).toBeCalledWith(account.password);
  });
});
