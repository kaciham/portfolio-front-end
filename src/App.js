import './App.css';
import { useState, useEffect } from 'react';
import RouteIndex from './routes/RouteIndex';
import CookieConsent from './components/CookieConsent';

function App() {
  const [isReady, setIsReady] = useState(false);

  // Defer rendering of ElevenLabs widget until page is fully loaded
  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <CookieConsent>
      <RouteIndex />
      {isReady && <elevenlabs-convai agent-id="agent_3101kd5vhaaqfrtszfpcpsz0wcw8"></elevenlabs-convai>}
    </CookieConsent>
  );
}

export default App;
