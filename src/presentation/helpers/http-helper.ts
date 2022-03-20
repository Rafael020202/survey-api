import { HttpResponse } from '../protocols/http';

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  };
};

export const success = (message: string): HttpResponse => {
  return {
    statusCode: 200,
    body: message
  };
};
