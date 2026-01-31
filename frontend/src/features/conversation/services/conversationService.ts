import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/services/api/endpoints'
import type { Conversation, Session } from '@/types'
import { mockConversations, mockSessions, getConversationById } from '@/mocks/mockConversationData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true'

export const conversationService = {
  /**
   * Get all conversations for a PCAP file
   * @param fileId - The file ID to get conversations for
   * @returns List of conversations
   */
  getConversations: async (fileId: string): Promise<Conversation[]> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      return mockConversations
    }

    const response = await apiClient.get<Conversation[]>(API_ENDPOINTS.CONVERSATIONS(fileId))
    return response.data
  },

  /**
   * Get detailed information about a specific conversation
   * @param conversationId - The conversation ID
   * @returns Detailed conversation data including all packets
   */
  getConversationDetail: async (conversationId: string): Promise<Conversation> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const conversation = getConversationById(conversationId)
      if (!conversation) {
        throw new Error('Conversation not found')
      }
      return conversation
    }

    const response = await apiClient.get<Conversation>(
      API_ENDPOINTS.CONVERSATION_DETAIL(conversationId)
    )
    return response.data
  },

  /**
   * Get sessions (grouped conversations) for a file
   * @param fileId - The file ID
   * @returns List of sessions
   */
  getSessions: async (fileId: string): Promise<Session[]> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockSessions
    }

    // This endpoint would need to be added to the backend
    const response = await apiClient.get<Session[]>(`/sessions/${fileId}`)
    return response.data
  },
}
