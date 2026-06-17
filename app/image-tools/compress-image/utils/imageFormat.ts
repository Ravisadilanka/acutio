export async function convertFormat(
  file: File,
  format:
    | "original"
    | "jpg"
    | "webp"
): Promise<File> {
  if (
    format ===
    "original"
  ) {
    return file;
  }

  const bitmap =
    await createImageBitmap(file);

  const canvas =
    document.createElement("canvas");

  canvas.width =
    bitmap.width;

  canvas.height =
    bitmap.height;

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
    0
  );

  const mime =
    format === "webp"
      ? "image/webp"
      : "image/jpeg";

  const blob =
    await new Promise<Blob>(
      (resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              throw new Error(
                "Conversion failed"
              );
            }

            resolve(blob);
          },
          mime,
          0.9
        );
      }
    );

  const extension =
    format === "webp"
      ? "webp"
      : "jpg";

  return new File(
    [blob],
    file.name.replace(
      /\.[^.]+$/,
      `.${extension}`
    ),
    {
      type: mime,
    }
  );
}