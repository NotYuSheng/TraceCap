import { useState, useEffect } from 'react'
import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAnalysisData } from '@features/analysis/hooks/useAnalysisData'
import { LoadingSpinner } from '@components/common/LoadingSpinner'
import { ErrorMessage } from '@components/common/ErrorMessage'

export const AnalysisPage = () => {
  const { fileId } = useParams<{ fileId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { data, loading, error, refetch } = useAnalysisData(fileId!)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Determine active tab from URL
    const path = location.pathname
    if (path.includes('/conversations')) {
      setActiveTab('conversations')
    } else if (path.includes('/timeline')) {
      setActiveTab('timeline')
    } else if (path.includes('/story')) {
      setActiveTab('story')
    } else {
      setActiveTab('overview')
    }
  }, [location.pathname])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'overview') {
      navigate(`/analysis/${fileId}`)
    } else {
      navigate(`/analysis/${fileId}/${tab}`)
    }
  }

  if (loading) {
    return <LoadingSpinner size="large" message="Loading analysis data..." fullPage />
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Analysis"
        message={error.message}
        onRetry={refetch}
      />
    )
  }

  if (!data) {
    return (
      <ErrorMessage
        title="No Data Available"
        message="No analysis data found for this file."
      />
    )
  }

  return (
    <div className="analysis-page">
      <div className="analysis-header mb-4">
        <h1>Network Traffic Analysis</h1>
        <p className="text-muted">File ID: {fileId}</p>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'conversations' ? 'active' : ''}`}
            onClick={() => handleTabChange('conversations')}
          >
            Conversations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => handleTabChange('timeline')}
          >
            Timeline
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => handleTabChange('story')}
          >
            Story
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <Outlet context={{ data, fileId }} />
    </div>
  )
}
