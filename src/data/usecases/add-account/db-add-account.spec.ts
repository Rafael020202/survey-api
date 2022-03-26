import { Encrypter } from './db-add-account-protocols';
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

  test('Should ', async () => {
    const { encrypter, dbAddAccount } = makeSut();

    jest.spyOn(encrypter, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };

    const account = dbAddAccount.add(accountData);
    await expect(account).rejects.toThrow();
  });
});
