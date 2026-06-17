export async function resizeImage(
  file: File,
  percentage: number
): Promise<File> {
  if (percentage >= 100) {
    return file;
  }

  const bitmap =
    await createImageBitmap(file);

  const canvas =
    document.createElement("canvas");

  canvas.width =
    Math.round(
      bitmap.width *
        (percentage / 100)
    );

  canvas.height =
    Math.round(
      bitmap.height *
        (percentage / 100)
    );

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Canvas error"
    );
  }

  ctx.drawImage(
    bitmap,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob =
    await new Promise<Blob>(
      (resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              throw new Error(
                "Resize failed"
              );
            }

            resolve(blob);
          },
          file.type
        );
      }
    );

  return new File(
    [blob],
    file.name,
    {
      type:
        file.type,
    }
  );
}