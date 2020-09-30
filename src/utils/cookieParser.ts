export const cookieParser = (cookie: string): Record<string, string> => {
  const sections = cookie.split(";");
  const valuePairs = sections.map((section) => section.split("="));
  return valuePairs.reduce((acc, [key, value]) => {
    return { ...acc, [String(key).trim()]: value };
  }, {});
};
