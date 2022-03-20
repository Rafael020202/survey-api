import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        body: new Error('Missing name param'),
        statusCode: 400
      };
    }

    return {
      body: 'Success',
      statusCode: 200
    };
  }
};
