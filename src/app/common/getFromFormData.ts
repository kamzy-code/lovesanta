export const get = (key: string, formData: FormData) => {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
};
