import { HttpRequest, HttpResponse } from '../protocols/http';
import { badRequest, success } from '../helpers/http-helper';
import { MissingParamError } from '../errors/missing-param-error';

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    return success('');
  }
};
