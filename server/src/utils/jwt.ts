interface JwtPayload {
  name: string
  avatarUrl: string
  id: string
}

export function generateToken(
  sign: (payload: object, options?: object) => string,
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
