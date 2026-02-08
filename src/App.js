import './App.css';
import RouteIndex from './routes/RouteIndex';
import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <CookieConsent>
      <RouteIndex />
    </CookieConsent>
  );
}

export default App;
