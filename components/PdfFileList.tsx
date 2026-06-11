"use client";

export default function PdfFileList({
  files,
  removeFile,
}: {
  files: File[];
  removeFile: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex justify-between items-center border rounded-lg p-4"
        >
          <div>
            <p className="font-medium">{file.name}</p>

            <p className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            onClick={() => removeFile(index)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}