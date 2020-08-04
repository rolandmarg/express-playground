export class AppError extends Error {
  readonly statusCode: number;

  constructor(message = 'Ooh! Nasty things! Nasty!', statusCode = 500) {
    super(message);

    this.statusCode = statusCode;
  }
}

export class BadRequest extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class Unauthorized extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}
