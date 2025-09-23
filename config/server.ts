interface EnvFunction {
  (key: string, defaultValue?: unknown): unknown;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
  array(key: string, defaultValue?: unknown[]): unknown[];
}

export default ({ env }: { env: EnvFunction }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 8080),
  app: {
    keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2']),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
