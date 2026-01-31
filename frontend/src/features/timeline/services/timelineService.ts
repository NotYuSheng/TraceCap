import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/services/api/endpoints'
import type { TimelineDataPoint } from '@/types'
import { mockTimelineData, generateTimelineForRange } from '@/mocks/mockTimelineData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true'

export const timelineService = {
  /**
   * Get timeline data for a PCAP file
   * @param fileId - The file ID to get timeline for
   * @returns Timeline data points
   */
  getTimelineData: async (fileId: string): Promise<TimelineDataPoint[]> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 700))
      return mockTimelineData
    }

    const response = await apiClient.get<TimelineDataPoint[]>(
      API_ENDPOINTS.TIMELINE_DATA(fileId)
    )
    return response.data
  },

  /**
   * Get timeline data for a specific time range
   * @param fileId - The file ID
   * @param start - Start timestamp
   * @param end - End timestamp
   * @returns Timeline data points for the specified range
   */
  getTimelineRange: async (
    fileId: string,
    start: number,
    end: number
  ): Promise<TimelineDataPoint[]> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return generateTimelineForRange(start, end)
    }

    const response = await apiClient.get<TimelineDataPoint[]>(
      API_ENDPOINTS.TIMELINE_RANGE(fileId, start, end)
    )
    return response.data
  },
}
