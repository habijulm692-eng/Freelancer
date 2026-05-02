/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomeScreen } from './screens/HomeScreen';
import { ToolsScreen } from './screens/ToolsScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { GigTitleGenerator } from './screens/tools/GigTitleGenerator';
import { ProposalGenerator } from './screens/tools/ProposalGenerator';
import { TemplateLibrary } from './screens/tools/TemplateLibrary';
import { IncomeTrackerScreen } from './screens/tools/IncomeTrackerScreen';
import { ImageGeneratorScreen } from './screens/tools/ImageGeneratorScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeScreen />} />
          <Route path="tools" element={<ToolsScreen />} />
          <Route path="clients" element={<ClientsScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
        </Route>
        <Route path="/tools/gig-title" element={<GigTitleGenerator />} />
        <Route path="/tools/proposal" element={<ProposalGenerator />} />
        <Route path="/tools/image-generator" element={<ImageGeneratorScreen />} />
        <Route path="/tools/templates" element={<TemplateLibrary />} />
        <Route path="/tools/income-tracker" element={<IncomeTrackerScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
