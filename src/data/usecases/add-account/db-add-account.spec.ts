import { Encrypter, AddAccountRepository, AddAccountModel, AccountModel } from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

interface Sut {
  encrypter: Encrypter
  dbAddAccount: DbAddAccount
  addAccountRepositoryStub: AddAccountRepository
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'unique_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date()
      };

      return await new Promise((resolve) => resolve(fakeAccount));
    }
  }

  const addAccountRepositoryStub = new AddAccountRepositoryStub();

  return addAccountRepositoryStub;
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
  const addAccountRepositoryStub = makeAddAccountRepository();
  const dbAddAccount = new DbAddAccount(encrypter, addAccountRepositoryStub);

  return {
    encrypter,
    dbAddAccount,
    addAccountRepositoryStub
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

  test('Should throw if encypter throws', async () => {
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

  test('Should call AddAccountRepository with correct data', async () => {
    const { dbAddAccount, addAccountRepositoryStub } = makeSut();

    const add = jest.spyOn(addAccountRepositoryStub, 'add');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'encrypted_password'
    };

    await dbAddAccount.add(accountData);
    expect(add).toHaveBeenCalledWith(accountData);
  });
});
