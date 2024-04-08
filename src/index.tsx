import { createRoot } from 'react-dom/client';
import './index.css';
import { OrphanContainer, OrphanProvider } from './components/basics/hooks/orphan';
import Application from './application/Application';

window.onload = () => {
  const node = document.createElement('div');
  const root = createRoot(node);
  root.render(
    <OrphanProvider>
      <OrphanContainer />
      <Application />
    </OrphanProvider>
  );
  document.body.appendChild(node);
};
