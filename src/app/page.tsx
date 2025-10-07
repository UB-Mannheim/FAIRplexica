import ChatWindow from '@/components/ChatWindow';
import { ChatProvider } from '@/lib/hooks/useChat';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Chat - FAIRplexica',
  description: 'Search for Research Data Management (RDM) Topics',
};

const Home = () => {
  return (
    <div>
      <Suspense>
        <ChatProvider>
          <ChatWindow />
        </ChatProvider>
      </Suspense>
    </div>
  );
};

export default Home;
