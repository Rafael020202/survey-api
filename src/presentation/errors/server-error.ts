export class ServerError extends Error {
  constructor () {
    super('server error');
    this.name = 'ServerError';
  }
}
