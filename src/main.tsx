import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter as Router } from "react-router-dom";
import './index.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from './components/ui/sonner.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppContextProvider } from './contexts/AuthContext.tsx';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="91592131102-ier1r0c1in5vbi9ibalp5iljg6229a24.apps.googleusercontent.com">
    <React.StrictMode>
      <Router>
        <AppContextProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            <Toaster richColors closeButton expand={false} position="bottom-right" />
          </QueryClientProvider>
        </AppContextProvider>
      </Router>
    </React.StrictMode>
  </GoogleOAuthProvider>,
)
