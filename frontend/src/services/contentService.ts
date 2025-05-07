
import axiosInstance from '@/lib/axios';
import { ContentItem, ContentCreateRequest } from '@/types';

export const contentService = {
  getAllContent: async (): Promise<ContentItem[]> => {
    const response = await axiosInstance.get<ContentItem[]>('/content/');
    return response.data;
  },

  getContentById: async (id: number): Promise<ContentItem> => {
    const response = await axiosInstance.get<ContentItem>(`/content/${id}/`);
    return response.data;
  },

  createContent: async (content: ContentCreateRequest): Promise<ContentItem> => {
    let response;

    if (content.original_file) {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('original_file', content.original_file);
      formData.append('summary_length', content.summary_length);
      
      response = await axiosInstance.post<ContentItem>('/content/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Send JSON for text input
      response = await axiosInstance.post<ContentItem>('/content/', {
        original_text: content.original_text,
        summary_length: content.summary_length,
      });
    }
    
    return response.data;
  },

  updateContent: async (id: number, content: Partial<ContentCreateRequest>): Promise<ContentItem> => {
    let response;

    if (content.original_file) {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('original_file', content.original_file);
      if (content.summary_length) {
        formData.append('summary_length', content.summary_length);
      }
      
      response = await axiosInstance.patch<ContentItem>(`/content/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Send JSON for text input or summary length update
      response = await axiosInstance.patch<ContentItem>(`/content/${id}/`, {
        original_text: content.original_text,
        summary_length: content.summary_length,
      });
    }
    
    return response.data;
  },

  downloadContent: async (id: number, format: 'docx' | 'pdf' | 'txt'): Promise<Blob> => {
    const response = await axiosInstance.get(`/content/${id}/download/${format}`, {
      responseType: 'blob',
    });
    return response.data;
  }
};
