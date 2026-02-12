import './App.css';
import RouteIndex from './routes/RouteIndex';
import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <CookieConsent>
      <RouteIndex />
      <elevenlabs-convai agent-id="agent_3101kd5vhaaqfrtszfpcpsz0wcw8"></elevenlabs-convai>
    </CookieConsent>
  );
}

export default App;
