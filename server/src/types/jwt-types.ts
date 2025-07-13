export interface JwtSignFunction {
  (payload: object, options?: object): string
}


export interface JwtPayload {
  name: string
  avatarUrl: string
  id: string
}