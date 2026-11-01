export type AuthField = "nickname" | "password" | "passwordConfirmation";
export type AuthFormState = {
  message?: string;
  fieldErrors?: Partial<Record<AuthField, string>>;
  nickname?: string;
};

type CredentialsInput = { nickname?: unknown; password?: unknown };
type RegistrationInput = CredentialsInput & { passwordConfirmation?: unknown };
type Credentials = { nickname: string; normalizedNickname: string; password: string };
type ValidationResult =
  | { valid: true; data: Credentials }
  | { valid: false; state: AuthFormState };

export const validateCredentials = ({ nickname, password }: CredentialsInput): ValidationResult => {
  const name = typeof nickname === "string" ? nickname.trim() : "";
  const fieldErrors: AuthFormState["fieldErrors"] = {};

  if (!/^[A-Za-z][A-Za-z0-9_]{2,23}$/.test(name)) {
    fieldErrors.nickname = "Nutze 3–24 Buchstaben, Zahlen oder Unterstriche. Beginne mit einem Buchstaben (A–Z).";
  }
  if (typeof password !== "string" || password.length < 5 || password.length > 128) {
    fieldErrors.password = "Das Passwort muss 12–128 Zeichen lang sein.";
  }
  if (Object.keys(fieldErrors).length) {
    return { valid: false, state: { fieldErrors, nickname: name.slice(0, 24) } };
  }

  return { valid: true, data: { nickname: name, normalizedNickname: name.toLowerCase(), password: password as string } };
};

export const validateRegistration = (input: RegistrationInput): ValidationResult => {
  const result = validateCredentials(input);
  if (typeof input.passwordConfirmation !== "string" || input.password !== input.passwordConfirmation) {
    return {
      valid: false,
      state: {
        ...(result.valid ? { nickname: result.data.nickname } : result.state),
        fieldErrors: {
          ...(result.valid ? {} : result.state.fieldErrors),
          passwordConfirmation: "Die Passwörter stimmen nicht überein.",
        },
      },
    };
  }
  return result;
};
