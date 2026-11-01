const requiredVariable = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} fehlt. Bitte .env.local gemäß .env.example einrichten.`);
  return value;
};

export const getDatabaseConfig = () => {
  const port = Number(requiredVariable("PGPORT"));
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PGPORT muss eine gültige Portnummer sein.");
  }

  return {
    host: requiredVariable("PGHOST"),
    port,
    database: requiredVariable("PGDATABASE"),
    user: requiredVariable("PGUSER"),
    password: requiredVariable("PGPASSWORD"),
    ssl: false,
  };
};
