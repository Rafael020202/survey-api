import { MongoClient, Collection } from 'mongodb';

export const MongoHelper = {
  client: MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },

  async close (): Promise<void> {
    await this.client.close();
  },

  getCollection (collection: string): Collection {
    return this.client.db().collection(collection);
  }
};
