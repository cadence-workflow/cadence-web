export type UserInfoMiddlewareContext =
  | {
      id?: string;
      userName?: string;
    }
  | undefined;
