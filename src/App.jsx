import '@/src/styles/typography.scss';

function App() {
  return (
    <div className="page">
      <header className="site-header">
        <span className="eyebrow">Tyler Carter</span>
        <span className="timestamp">2025</span>
      </header>
      <main className="hero">
        <div className="hero__titles">
          <div className="hero__topline">Full-stack Developer</div>
          <div className="hero__headline">AI Integration Expert</div>
          <div className="hero__subhead">Specializes in development and integration.</div>
        </div>
      </main>
    </div>
  );
}

export default App;
