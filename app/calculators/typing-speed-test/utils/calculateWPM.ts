export function calculateWPM(
  correctChars: number,
  elapsedSeconds: number
) {
  if (
    elapsedSeconds <= 0
  ) {
    return 0;
  }

  const words =
    correctChars / 5;

  const minutes =
    elapsedSeconds / 60;

  return Math.round(
    words / minutes
  );
}