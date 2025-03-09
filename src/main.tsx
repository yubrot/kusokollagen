import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { OrphanContainer, OrphanProvider } from './components/basics/hooks/orphan';
import Application from './application/Application';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrphanProvider>
      <OrphanContainer />
      <Application />
    </OrphanProvider>
  </StrictMode>
);
