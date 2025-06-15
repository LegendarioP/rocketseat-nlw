import { JwtPayload } from '../types/jwt-types'
import { JwtSignFunction } from '../types/jwt-types';
export function generateToken(
  sign: JwtSignFunction,
  user: JwtPayload,
) {
  return sign(
    {
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    {
      sub: user.id,
      expiresIn: '30 days',
    },
  )
}
