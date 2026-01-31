import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/services/api/endpoints'
import type { AnalysisSummary, ProtocolStats, FiveWsAnalysis, KillChainPhase } from '@/types'
import { generateMockAnalysis, mockAnalysisSummary } from '@/mocks/mockAnalysisData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true'

export const analysisService = {
  /**
   * Get analysis summary for a PCAP file
   * @param fileId - The file ID to analyze
   * @returns Analysis summary with statistics and metadata
   */
  getAnalysisSummary: async (fileId: string): Promise<AnalysisSummary> => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Return mock data (you can customize based on fileId if needed)
      return generateMockAnalysis(fileId, 'free5gc.pcap')
    }

    // Fetch data from multiple endpoints
    const [summaryRes, protocolsRes, conversationsRes] = await Promise.all([
      apiClient.get(API_ENDPOINTS.ANALYSIS_SUMMARY(fileId)),
      apiClient.get(API_ENDPOINTS.PROTOCOL_STATS(fileId)),
      apiClient.get(API_ENDPOINTS.CONVERSATIONS(fileId)),
    ])

    const summary = summaryRes.data
    const protocols = protocolsRes.data
    const conversations = conversationsRes.data

    // Transform backend response to frontend format
    const startTime = summary.startTime ? new Date(summary.startTime).getTime() : Date.now()
    const endTime = summary.endTime ? new Date(summary.endTime).getTime() : Date.now()

    // Transform protocol stats
    const protocolDistribution = Object.entries(protocols.protocols || {}).map(
      ([name, stats]: [string, any]) => ({
        protocol: name,
        count: stats.packetCount || 0,
        bytes: stats.bytes || 0,
        percentage: stats.percentage || 0,
      })
    )

    // Transform conversations (top 5)
    const topConversations = (conversations || []).slice(0, 5).map((conv: any) => ({
      id: conv.conversationId,
      endpoints: [
        { ip: conv.srcIp, port: conv.srcPort || 0 },
        { ip: conv.dstIp, port: conv.dstPort || 0 },
      ],
      protocol: { name: conv.protocol, layer: 'Transport' },
      packetCount: conv.packetCount || 0,
      totalBytes: conv.totalBytes || 0,
      startTime,
      endTime,
    }))

    // Extract unique hosts from conversations
    const hostsSet = new Set<string>()
    ;(conversations || []).forEach((conv: any) => {
      hostsSet.add(conv.srcIp)
      hostsSet.add(conv.dstIp)
    })
    const uniqueHosts = Array.from(hostsSet).map((ip) => ({
      ip,
      port: 0,
    }))

    return {
      fileId: summary.fileId,
      fileName: summary.fileName || 'unknown.pcap',
      fileSize: summary.totalBytes || 0,
      uploadTime: summary.analyzedAt ? new Date(summary.analyzedAt).getTime() : Date.now(),
      totalPackets: summary.packetCount || 0,
      timeRange: [startTime, endTime],
      protocolDistribution,
      topConversations,
      uniqueHosts,
    }
  },

  /**
   * Get protocol statistics for a PCAP file
   * @param fileId - The file ID to analyze
   * @returns Protocol distribution statistics
   */
  getProtocolStats: async (fileId: string): Promise<ProtocolStats[]> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockAnalysisSummary.protocolDistribution
    }

    const response = await apiClient.get<ProtocolStats[]>(
      API_ENDPOINTS.PROTOCOL_STATS(fileId)
    )
    return response.data
  },

  /**
   * Get Five W's analysis for a PCAP file
   * @param fileId - The file ID to analyze
   * @returns Five W's analysis (Who, What, When, Where, Why)
   */
  getFiveWs: async (fileId: string): Promise<FiveWsAnalysis> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockAnalysisSummary.fiveWs!
    }

    const response = await apiClient.get<FiveWsAnalysis>(API_ENDPOINTS.FIVE_WS(fileId))
    return response.data
  },

  /**
   * Get Cyber Kill Chain analysis for a PCAP file
   * @param fileId - The file ID to analyze
   * @returns Kill chain phases with indicators
   */
  getKillChain: async (fileId: string): Promise<KillChainPhase[]> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // Return empty array for now (can add mock kill chain data later)
      return []
    }

    const response = await apiClient.get<KillChainPhase[]>(
      API_ENDPOINTS.KILL_CHAIN(fileId)
    )
    return response.data
  },
}
