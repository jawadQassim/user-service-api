export const validate = <T>(value: unknown, schema: (input: unknown) => T) => schema(value);
