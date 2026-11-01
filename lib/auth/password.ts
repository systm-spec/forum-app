import "server-only";

import { hash, verify } from "@node-rs/argon2";

// Öffentliches Dummy-Hash: auch unbekannte Nicknames durchlaufen Argon2.
const dummyHash = "$argon2id$v=19$m=19456,t=2,p=1$Qc8AZSW+7w+jMOAz7AF5nA$TbvqtLfPADfyyw1ZRVRlyU/y30/xOKAagOyKSbzVFrw";

export const hashPassword = (password: string) => hash(password, {
  // Argon2id = 2; der Enum der Bibliothek ist mit isolatedModules nicht importierbar.
  algorithm: 2,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
});

export const verifyPassword = async (passwordHash: string | undefined, password: string) => {
  const matches = await verify(passwordHash ?? dummyHash, password);
  return Boolean(passwordHash) && matches;
};
