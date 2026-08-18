import { useState } from 'react';
import { useResolucaoTela } from './hooks/useResolucaoTela';
import DesktopApp from './components/desktop/DesktopApp';
import MobileApp from './components/mobile/MobileApp';
import Home from './components/Home';
import './index.css';

function App() {
  const isMobile = useResolucaoTela();
  const [started, setStarted] = useState(false);

  if (!started) {
    return <Home onStart={() => setStarted(true)} />;
  }

  return isMobile ? <MobileApp /> : <DesktopApp />;
}

export default App;
