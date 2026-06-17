export async function convertImageForCompression(
  file: File
): Promise<File> {
  const type = file.type;

  if (
    type === "image/jpeg" ||
    type === "image/png" ||
    type === "image/webp"
  ) {
    return file;
  }

  if (
  type === "image/heic" ||
  type === "image/heif"
) {
  const heic2any =
    (await import("heic2any"))
      .default;

  const converted =
    await heic2any({
      blob: file,
      toType: "image/png",
    });

    const blob = Array.isArray(converted)
      ? converted[0]
      : converted;

    return new File(
      [blob as Blob],
      file.name.replace(
        /\.(heic|heif)$/i,
        ".png"
      ),
      {
        type: "image/png",
      }
    );
  }

  const bitmap =
    await createImageBitmap(file);

  const canvas =
    document.createElement("canvas");

  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Canvas not supported"
    );
  }

  ctx.drawImage(bitmap, 0, 0);

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
          "image/png"
        );
      }
    );

  return new File(
    [blob],
    file.name.replace(
      /\.[^.]+$/,
      ".png"
    ),
    {
      type: "image/png",
    }
  );
}