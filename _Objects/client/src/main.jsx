import React from 'react'
import ReactDOM from 'react-dom/client'

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import AuthSection from './views/Authentication.jsx'
import CoreDisplay from './views/modules/core_display.jsx'
import CoreProfile from './views/modules/core_profile.jsx'
import Landing from './views/home.jsx'
import AdminControl from './admin.jsx';
import { AuthProvider } from './views/modules/userAuthContext.jsx'
import { ProtectedRoute, ProtectedAuth } from './views/modules/ProtectedRoute.jsx'
import Dashboard from './user.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './components/global.css'
import 'animate.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC); // public key

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/oauth",
    element: <ProtectedAuth element={<AuthSection />} />,
  },
  {
    path: "/:username",
    element: <CoreProfile />,
  },
  {
    path: "/display",
    element: <CoreDisplay />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute element={<Dashboard />} />,
  },
  {
    path: "/admin-controller",
    element: <ProtectedRoute element={<AdminControl />} />,
  },
  {
    path: "/streamer",
    element: <h1>sdsdsd</h1>,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <RouterProvider router={router} />
      </Elements>
    </AuthProvider>
  </React.StrictMode>,
)