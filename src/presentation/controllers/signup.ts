import { HttpRequest, HttpResponse } from '../protocols/http';
import { badRequest, success } from '../helpers/http-helper';
import { MissingParamError } from '../errors/missing-param-error';

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredParams = ['email', 'name'];

    for (const parm of requiredParams) {
      if (!httpRequest.body[parm]) return badRequest(new MissingParamError(parm));
    }

    return success('');
  }
};
