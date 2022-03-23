import { AccountModel } from '../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    const data: AccountModel = {
      created_at: new Date(),
      email: 'someemail@mail.com',
      id: '232',
      name: 'somename',
      password: 'somepass',
      updated_at: new Date()
    };

    return await new Promise((resolve) => resolve(data));
  }
};
