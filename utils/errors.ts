export class MyError extends Error {
  info: any;
  status: number | undefined;
  constructor(message: string) {
    super(message);
  }
}
