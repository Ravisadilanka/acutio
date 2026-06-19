export function calculateAccuracy(
  correctChars: number,
  totalChars: number
) {
  if (totalChars === 0) {
    return 100;
  }

  return Number(
    (
      (correctChars /
        totalChars) *
      100
    ).toFixed(1)
  );
}