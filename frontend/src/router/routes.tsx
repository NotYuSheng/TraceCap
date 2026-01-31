import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@components/common/Layout'
import { UploadPage } from '@pages/Upload'
import { AnalysisPage } from '@pages/Analysis'
import { AnalysisOverview } from '@pages/Analysis/AnalysisOverview'
import { ConversationPage } from '@pages/Conversation'
import { TimelinePage } from '@pages/Timeline'
import { StoryPage } from '@pages/Story'
import { NotFoundPage } from '@pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <UploadPage />,
      },
      {
        path: 'analysis/:fileId',
        element: <AnalysisPage />,
        children: [
          {
            index: true,
            element: <AnalysisOverview />,
          },
          {
            path: 'conversations',
            element: <ConversationPage />,
          },
          {
            path: 'timeline',
            element: <TimelinePage />,
          },
          {
            path: 'story',
            element: <StoryPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
