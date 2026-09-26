import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Workouts from './pages/Workouts'
import WorkoutCategory from './pages/WorkoutCategory'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Tools from './pages/Tools'
import Toast from './components/Toast'
import Chatbot from './components/Chatbot'
import Footer from './components/Footer'
import SearchResults from './pages/SearchResults'
import Progress from './pages/Progress'
import RouteLoadingBar from './components/Routeloadingbar'

function App() {
  return (
    <BrowserRouter>
      <RouteLoadingBar />
      <Navbar />
      <Toast />
      <Chatbot />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/bmi" element={<Navigate to="/tools?tab=bmi" replace />} />
        <Route path="/tools/1rm" element={<Navigate to="/tools?tab=1rm" replace />} />
        <Route path="/tools/macro" element={<Navigate to="/tools?tab=macro" replace />} />
        <Route path="/tools/calorie" element={<Navigate to="/tools?tab=calorie" replace />} />
        <Route path="/tools/calories" element={<Navigate to="/tools?tab=calorie" replace />} />
        <Route path="/search" element={<SearchResults />} />

        <Route path="/workouts/:categorySlug"
          element={
            <ProtectedRoute>
              <WorkoutCategory />
            </ProtectedRoute>
          } />

        <Route path="/articles" element={<Articles />} />

        <Route path="/articles/:slug"
          element={
            <ProtectedRoute>
              <ArticleDetail />
            </ProtectedRoute>
          } />

        <Route path="/recipes" element={<Recipes />} />

        <Route path="/recipes/:slug"
          element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          } />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      </Routes>

      <Footer />

    </BrowserRouter>
  )
}

export default App
