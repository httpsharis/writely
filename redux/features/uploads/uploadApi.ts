import { createApi } from '@reduxjs/toolkit/query/react';
import { sharedBaseQuery } from "../../api/baseQuery";

/**
 * Response shape returned by the backend after a successful file upload.
 */
export interface UploadResponse {
  message: string;
  /** The secure Cloudinary (or S3) URL to save in the database */
  url: string; 
}

/**
 * API Slice for handling file uploads (e.g., avatars, cover images).
 * 
 * Note: When using FormData, the browser automatically sets the correct 
 * `multipart/form-data` boundary headers. RTK Query's fetchBaseQuery 
 * detects FormData and skips forcing `application/json`.
 */
export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery: sharedBaseQuery,
  endpoints: (builder) => ({
    
    /**
     * Uploads a single image file to the backend.
     * 
     * @param file The File object from an `<input type="file" />` or drag-and-drop event.
     * @returns The public URL of the uploaded image.
     */
    uploadImage: builder.mutation<UploadResponse, File>({
      query: (file) => {
        const body = new FormData();
        body.append('image', file); // 'image' must match upload.single('image') in Multer/Backend

        return {
          url: '/upload',
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;