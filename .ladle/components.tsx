import { OrphanProvider, OrphanContainer } from '../src/components/common/hooks/orphan';
import '../src/globals.css';
import './styles.css';
import { GlobalProvider } from '@ladle/react';
import React from 'react';

export const Provider: GlobalProvider = ({ children }) => (
  <OrphanProvider>
    <OrphanContainer />
    {children}
  </OrphanProvider>
);
