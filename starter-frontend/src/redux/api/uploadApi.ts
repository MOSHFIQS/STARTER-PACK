import { baseApi } from "./baseApi";
import type { UploadResult, MultiUploadResult } from "@/types";

export const uploadApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          uploadImage: builder.mutation<UploadResult, { file: File; folder?: string }>({
               query: ({ file, folder = "property-chai" }) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    return {
                         url: `/uploads/image`,
                         method: "POST",
                         params: { folder },
                         body: formData,
                    };
               },
          }),
          uploadImages: builder.mutation<MultiUploadResult, { files: File[]; folder?: string }>({
               query: ({ files, folder = "property-chai" }) => {
                    const formData = new FormData();
                    files.forEach((file) => formData.append("files", file));
                    return {
                         url: `/uploads/images`,
                         method: "POST",
                         params: { folder },
                         body: formData,
                    };
               },
          }),
          uploadVideo: builder.mutation<UploadResult, { file: File; folder?: string }>({
               query: ({ file, folder = "property-chai" }) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    return {
                         url: `/uploads/video`,
                         method: "POST",
                         params: { folder },
                         body: formData,
                    };
               },
          }),
          uploadDocument: builder.mutation<UploadResult, { file: File; folder?: string }>({
               query: ({ file, folder = "property-chai" }) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    return {
                         url: `/uploads/document`,
                         method: "POST",
                         params: { folder },
                         body: formData,
                    };
               },
          }),
          deleteUploadedFile: builder.mutation<{ message: string }, string>({
               query: (publicId) => ({
                    url: `/uploads`,
                    method: "DELETE",
                    params: { publicId },
               }),
          }),
     }),
});

export const {
     useUploadImageMutation,
     useUploadImagesMutation,
     useUploadVideoMutation,
     useUploadDocumentMutation,
     useDeleteUploadedFileMutation,
} = uploadApi;
