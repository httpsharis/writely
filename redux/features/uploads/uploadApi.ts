/**
 * @file uploadApi.ts
 * @desc RTK Query endpoints for handling multipart/form-data file uploads.
 * Injects into the master apiSlice to share auth middleware securely.
 */

import { apiSlice } from "../../api/apiSlice";

/**
 * Response shape returned by the backend after a successful file upload.
 */
export interface UploadResponse {
  message: string;
  /** The secure Cloudinary (or S3) URL to save in the database */
  url: string; 
}

export const uploadApi = apiSlice.injectEndpoints({
  overrideExisting: true, // Prevents Next.js Fast Refresh crashes
  endpoints: (builder) => ({
    
    /**
     * Uploads a single image file to the backend.
     * * @param file The File object from an `<input type="file" />` or drag-and-drop event.
     * @returns The public secure URL of the uploaded image.
     */
    uploadImage: builder.mutation<UploadResponse, File>({
      query: (file) => {
        const body = new FormData();
        // 'image' MUST match the exact field name expected by upload.single('image') in your Node.js backend
        body.append("image", file); 

        return {
          url: "/upload",
          method: "POST",
          body,
        };
      },
      // Note: We don't invalidate any tags here. An upload just returns a URL. 
      // The tag invalidation happens when you actually SAVE that URL to a Novel or Profile.
    }),
    
  }),
});

export const { useUploadImageMutation } = uploadApi;