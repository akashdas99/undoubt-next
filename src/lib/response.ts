export const successResponse = <T>(data?: T) => {
  return {
    success: true,
    data,
  };
};
export const errorResponse = (errors: {
  [k: string]: {
    message: string;
  };
}) => {
  return {
    success: false,
    errors,
  };
};
