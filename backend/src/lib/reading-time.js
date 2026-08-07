export const calculateReadingTime = (htmlContent) => {
  const text = htmlContent
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = text.split(" ").filter((word) => word.length > 0).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return minutes;
};
