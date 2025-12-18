export const get = (key: string, formData: FormData) => {
  const v = formData.get(key);
  return v === null ? "" : String(v).trim();
};
