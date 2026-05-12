export type ApiResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
