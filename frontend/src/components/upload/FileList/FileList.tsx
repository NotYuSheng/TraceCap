import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import type { RecentFile } from '@/store/slices/uploadSlice'
import './FileList.css'

export const FileList = () => {
  const recentFiles = useStore((state) => state.recentFiles)
  const removeRecentFile = useStore((state) => state.removeRecentFile)
  const navigate = useNavigate()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`

    return date.toLocaleDateString()
  }

  const handleFileClick = (file: RecentFile) => {
    navigate(`/analysis/${file.id}`)
  }

  const handleRemoveFile = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation()
    removeRecentFile(fileId)
  }

  if (recentFiles.length === 0) {
    return null
  }

  return (
    <div className="file-list-container">
      <h3 className="file-list-title">Recent Uploads</h3>
      <div className="file-list">
        {recentFiles.map((file) => (
          <div
            key={file.id}
            className="file-list-item"
            onClick={() => handleFileClick(file)}
          >
            <div className="file-icon">
              <i className="bi bi-file-earmark-binary"></i>
            </div>
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-meta">
                {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
              </div>
            </div>
            <div className="file-actions">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => handleFileClick(file)}
              >
                <i className="bi bi-graph-up"></i> Analyze
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={(e) => handleRemoveFile(e, file.id)}
                title="Remove from list"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
