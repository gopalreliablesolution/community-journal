import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Providers } from './app/providers';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { RoleRoute } from './routes/RoleRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useNProgress } from './hooks/useNProgress';
import ScrollToTop from './components/common/ScrollToTop';

// Layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Write = lazy(() => import('./pages/Write'));
const Search = lazy(() => import('./pages/Search'));
const Notifications = lazy(() => import('./pages/Notifications'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const Explore = lazy(() => import('./pages/Explore'));
const TagDetail = lazy(() => import('./pages/TagDetail'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'));
const Preferences = lazy(() => import('./pages/Preferences'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPosts = lazy(() => import('./pages/admin/AdminPosts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminTags = lazy(() => import('./pages/admin/AdminTags'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
    </div>
  );
}

function AppRoutes() {
  useNProgress();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<MainLayout />}>
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
          </Route>
        </Route>
      </Route>

      {/* Main Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/users/:username" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:slug" element={<CategoryDetail />} />
        <Route path="/tags" element={<CategoriesPage />} />
        <Route path="/tags/:slug" element={<TagDetail />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/write" element={<Write />} />
          <Route path="/edit/:id" element={<Write />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings/profile" element={<EditProfile />} />
          <Route path="/settings/preferences" element={<Preferences />} />
        </Route>
      </Route>

      {/* Admin Routes — separate layout, no navbar/footer */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute role={'ADMIN' as import('./utils/permissions').Role} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/tags" element={<AdminTags />} />
            <Route path="/admin/media" element={<AdminMedia />} />
          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<Loading />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
