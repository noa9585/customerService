import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';

/**
 * App Component (Global Wrapper)
 * Only contains global providers and wrappers (Router, Theme, Redux, etc.)
 * All route definitions and logic are extracted to routes/AppRouter.tsx
 */
function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;