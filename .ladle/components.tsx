import { OrphanProvider, OrphanContainer } from '../src/components/basics/hooks/orphan';
import '../src/index.css';
import './styles.css';
import type { GlobalProvider } from '@ladle/react';
import React from 'react';

export const Provider: GlobalProvider = ({ children }) => (
  <OrphanProvider>
    <OrphanContainer />
    {children}
  </OrphanProvider>
);
