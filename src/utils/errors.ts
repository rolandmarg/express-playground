export class APIError extends Error {
  readonly statusCode: number;

  constructor(message = 'Ooh! Nasty things! Nasty!', statusCode = 500) {
    super(message);

    this.statusCode = statusCode;
  }
}

export class BadRequest extends APIError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class Unauthorized extends APIError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}
