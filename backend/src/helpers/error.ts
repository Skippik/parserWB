export const handleError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  } else {
    return 'Unknown error';
  }
};
