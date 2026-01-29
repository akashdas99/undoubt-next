export const successResponse = <T>(data?: T) => {
  return {
    success: true,
    data,
  };
};
export const errorResponse = (
  errors:
    | {
        [k: string]: {
          message: string;
        };
      }
    | string,
) => {
  return {
    success: false,
    errors: typeof errors === "string" ? { root: { message: errors } } : errors, // ✅ Return the errors object
  };
};
