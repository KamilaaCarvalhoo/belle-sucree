
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import './SplashScreen.css';

const drops = [
  { left: '3%', delay: '0.1s', duration: '2.8s', height: '82px' },
  { left: '13%', delay: '0.8s', duration: '3.4s', height: '125px' },
  { left: '25%', delay: '0.3s', duration: '2.6s', height: '68px' },
  { left: '37%', delay: '1.1s', duration: '3.1s', height: '110px' },
  { left: '49%', delay: '0.5s', duration: '2.9s', height: '145px' },
  { left: '61%', delay: '0.9s', duration: '3.5s', height: '76px' },
  { left: '74%', delay: '0.2s', duration: '2.7s', height: '118px' },
  { left: '86%', delay: '1.2s', duration: '3.2s', height: '92px' },
  { left: '96%', delay: '0.6s', duration: '2.5s', height: '132px' },
];

const sweets = [
  { name: 'strawberry', image: '/morango.png', alt: 'Morango' },
  { name: 'candy', image: '/balinha.png', alt: 'Balinha' },
  { name: 'cherry', image: '/cereja.png', alt: 'Cereja' },
  { name: 'donut', image: '/donut.png', alt: 'Donut' },
  { name: 'chocolate', image: '/chocolate.png', alt: 'Chocolate' },
];

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('intro');
  const [leaving, setLeaving] = useState(false);
  const sceneRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timerRef.current);
    };
  }, []);

  function handleMouseMove(event) {
    if (!sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    sceneRef.current.style.setProperty('--mx', `${x * 12}px`);
    sceneRef.current.style.setProperty('--my', `${y * 10}px`);
  }

  function revealBrand() {
    if (phase !== 'intro') return;

    setPhase('reveal');

    timerRef.current = window.setTimeout(() => {
      setPhase('ready');
    }, 1050);
  }

  function enterStore() {
    if (leaving || phase !== 'ready') return;

    setLeaving(true);

    timerRef.current = window.setTimeout(() => {
      onFinish?.();
    }, 850);
  }

  return (
    <main
      className={`choco-intro ${leaving ? 'choco-exit' : ''}`}
      aria-label="Abertura da Belle Sucrée"
    >
      <div className="choco-background" />
      <div className="choco-glow choco-glow-one" />
      <div className="choco-glow choco-glow-two" />
      <div className="choco-grain" />

      <header className="choco-header">
        <a
          className="choco-monogram"
          href="#inicio"
          onClick={(event) => event.preventDefault()}
          aria-label="Belle Sucrée"
        >
          BS<span>.</span>
        </a>

        <span className="choco-header-label">
          A DOCE SURPRESA COMEÇA AQUI
        </span>

        <span className="choco-header-heart" aria-hidden="true">
          ♡
        </span>
      </header>

      <section className="choco-stage">
        <div className="choco-copy">
          <div className="choco-kicker">
            <Sparkles size={15} />
            <span>UM SEGREDO BEM DOCINHO</span>
          </div>

          <h1 className="choco-title">
            Tem algo
            <span>derretendo</span>
            <em>por você.</em>
          </h1>

          <p className="choco-description">
            Prepare-se para descobrir seu novo desejo favorito.
          </p>

          {phase === 'intro' && (
            <button
              className="choco-button"
              onClick={revealBrand}
              type="button"
            >
              <span>Derreter a curiosidade</span>
              <ArrowRight size={19} />
            </button>
          )}

          {phase === 'reveal' && (
            <p className="choco-status" role="status">
              Shhh... a surpresa está chegando
              <span className="choco-status-dots" aria-hidden="true">
                ...
              </span>
            </p>
          )}

          {phase === 'ready' && (
            <button
              className="choco-button choco-button-ready"
              onClick={enterStore}
              type="button"
            >
              <span>Quero descobrir!</span>
              <ArrowRight size={19} />
            </button>
          )}

          <div className="choco-trust">
            <span>♡</span>
            PEQUENOS PRAZERES, GRANDES SORRISOS
          </div>
        </div>

        <div
          className={`choco-art choco-art-${phase}`}
          ref={sceneRef}
          onMouseMove={handleMouseMove}
          aria-label="Chocolate e doces decorativos"
        >
          <div className="choco-sunburst" />
          <div className="choco-orbit choco-orbit-one" />
          <div className="choco-orbit choco-orbit-two" />

          <div className="choco-orbiting-sweets" aria-hidden="true">
            {sweets.map((sweet, index) => (
              <div
                className={`choco-sweet choco-sweet-${sweet.name}`}
                key={sweet.name}
                style={{ '--sweet-index': index }}
              >
                <img src={sweet.image} alt="" />
              </div>
            ))}
          </div>

          <div className="choco-product">
            <div className="choco-product-shadow" />

            <div className="choco-wrapper">
              <div className="choco-wrapper-top">
                UM MIMO PARA VOCÊ
              </div>

              <img
                className="choco-brand-logo"
                src="/logo.png"
                alt="Belle Sucrée"
              />

              <div className="choco-wrapper-bottom">
                FEITO PARA ADOÇAR SEU DIA
              </div>

              <div className="choco-candy" aria-hidden="true">
                <span />
              </div>

              <div className="choco-seal">BS</div>
            </div>

            <div className="choco-product-ribbon" />
          </div>

          <div className="choco-liquid">
            <div className="choco-liquid-shine" />

            {drops.map((drop, index) => (
              <span
                key={drop.left}
                className={`choco-drop choco-drop-${index + 1}`}
                style={{
                  left: drop.left,
                  animationDelay: drop.delay,
                  animationDuration: drop.duration,
                  height: drop.height,
                }}
              />
            ))}
          </div>

          <div className="choco-splash choco-splash-one" />
          <div className="choco-splash choco-splash-two" />

          <div className="choco-caption">
            <span className="choco-caption-line" />
            <span>DOCE COMO A PRIMEIRA MORDIDA</span>
            <span className="choco-caption-line" />
          </div>
        </div>
      </section>

      <footer className="choco-footer">
        <span>BELLE SUCRÉE</span>
        <span className="choco-footer-dot">✦</span>
        <span>UMA EXPERIÊNCIA FORA DO COMUM</span>
      </footer>

      <div className="choco-bottom-liquid" aria-hidden="true" />
    </main>
  );
}
