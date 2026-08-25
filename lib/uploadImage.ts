// lib/uploadImage.ts

export async function uploadToCloudinary(file: File): Promise<string> {
  const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dhpiqwced";
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "writely_unsigned";

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Missing Cloudinary configuration (cloud name or upload preset).");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      let errorMessage = `Upload failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        console.error("Cloudinary Error Details:", errorData);
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        // JSON parsing failed
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to upload image to Cloudinary";
    console.error("Cloudinary upload error:", msg);
    throw new Error(msg);
  }
}