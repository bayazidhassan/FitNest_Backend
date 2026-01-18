export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type TRole = (typeof ROLES)[keyof typeof ROLES];