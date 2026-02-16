import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import PlayStandardPage from './pages/PlayStandardPage';
import PlayDailyPage from './pages/PlayDailyPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ResultsPage from './pages/ResultsPage';
import ProfileSetupDialog from './components/ProfileSetupDialog';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AppLayout />
      <ProfileSetupDialog />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const playStandardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play',
  component: PlayStandardPage,
});

const playDailyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily',
  component: PlayDailyPage,
});

const leaderboardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboards',
  component: LeaderboardsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: ResultsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  playStandardRoute,
  playDailyRoute,
  leaderboardsRoute,
  profileRoute,
  settingsRoute,
  resultsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
