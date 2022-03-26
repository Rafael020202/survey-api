import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password);

    const data: AccountModel = {
      created_at: new Date(),
      email: 'someemail@mail.com',
      id: '232',
      name: 'somename',
      password: 'somepass',
      updated_at: new Date()
    };

    await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }));

    return await new Promise((resolve) => resolve(data));
  }
};
