interface EnvFunction {
  (key: string, defaultValue?: unknown): unknown;
  int(key: string, defaultValue?: number): number;
  array(key: string, defaultValue?: unknown[]): unknown[];
  bool(key: string, defaultValue?: boolean): boolean;
}

export default ({ env }: { env: EnvFunction }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2', 'defaultKey3', 'defaultKey4']),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  url: env('RAILWAY_STATIC_URL') ? `https://${env('RAILWAY_STATIC_URL')}` : undefined,
  proxy: true,
});