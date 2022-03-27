import { AddAccountRepository } from '../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/useCases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');

    const account = {
      ...accountData,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await accountCollection.insertOne(account);

    return {
      id: String(result.insertedId),
      ...account
    };
  }
};
