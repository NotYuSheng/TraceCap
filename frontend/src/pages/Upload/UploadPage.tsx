import { useState } from 'react'
import { FileUploadZone } from '@components/upload/FileUploadZone'
import { UploadProgress } from '@components/upload/UploadProgress'
import { FileList } from '@components/upload/FileList'
import { useFileUpload } from '@features/upload/hooks/useFileUpload'

export const UploadPage = () => {
  const { uploadFile, isUploading, progress, error, resetUpload } = useFileUpload()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    await uploadFile(file)
  }

  const handleCancel = () => {
    resetUpload()
    setSelectedFile(null)
  }

  const maxSize = parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE || '100000000')
  const acceptedTypes = (import.meta.env.VITE_SUPPORTED_FILE_TYPES || '.pcap,.pcapng,.cap').split(',')

  return (
    <div className="upload-page">
      <div className="upload-header">
        <h1>Upload PCAP File</h1>
        <p className="text-muted">
          Upload your network capture files for detailed analysis and visualization
        </p>
      </div>

      <FileUploadZone
        onFileSelect={handleFileSelect}
        disabled={isUploading}
        maxSize={maxSize}
        acceptedFileTypes={acceptedTypes}
      />

      {selectedFile && (
        <UploadProgress
          fileName={selectedFile.name}
          progress={progress}
          isUploading={isUploading}
          error={error?.message}
          onCancel={handleCancel}
        />
      )}

      <FileList />
    </div>
  )
}
