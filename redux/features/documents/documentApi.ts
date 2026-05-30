import { apiSlice } from '../../api/apiSlice';

// We will refine this type later based on your exact MongoDB schema
export interface Document {
    _id: string;
    title: string;
    content?: string;
    createdAt: string;
}

export const documentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        // GET /api/document (Matches your backend!)
        getDocuments: builder.query<Document[], void>({
            query: () => '/document',
            providesTags: ['Document'],
        }),
        
        // POST /api/document
        createDocument: builder.mutation<Document, Partial<Document>>({
            query: (newDoc) => ({
                url: '/document',
                method: 'POST',
                body: newDoc,
            }),
            invalidatesTags: ['Document'],
        }),

        // GET /api/document/:id
        getDocumentById: builder.query<Document, string>({
            query: (id) => `/document/${id}`,
            providesTags: (result, error, id) => [{ type: 'Document', id }],
        })

    }),
});

export const { 
    useGetDocumentsQuery, 
    useCreateDocumentMutation, 
    useGetDocumentByIdQuery 
} = documentsApi;