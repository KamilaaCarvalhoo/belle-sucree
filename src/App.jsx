import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Heart, Minus, Plus, Search, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react';
import SplashScreen from './SplashScreen';
import './App.css';

const products = [
  { id: 1, name: 'Morango Cravejado dos Sonhos', category: 'Frutinhas', price: 12.9, description: 'Um moranguinho doce, delicado e cheio de charme.', image: '/morango-cravejado.png', tag: 'Queridinho' },
  { id: 2, name: 'Entremet de Manga', category: 'Frutinhas', price: 16.9, description: 'Uma maravilhosa manga recheada e delicada.', image: '/manga.png', tag: 'Mais amada' },
  { id: 3, name: 'Emtremet Maravilhoso de Coco', category: 'Frutinhas', price: 9.9, description: 'Um toque de cor e doçura em cada mordida.', image: '/coco.png', tag: 'Delicado' },
  { id: 4, name: 'Donut De Morango', category: 'Donuts', price: 6.5, description: 'Cobertura Maravilhosa, gigante no carinho.', image: '/donut-morango.png', tag: 'Fofo demais' },
  { id: 5, name: 'Donut De Chocolate', category: 'Donuts', price: 14.9, description: 'Cobertura divertida com gostinho de felicidade.', image: '/Donut-Chocolate.png', tag: 'Novidade' },
  { id: 6, name: 'Donut de Café', category: 'Donuts', price: 1.9, description: 'Um docinho que derrete na boca e no coração.', image: '/Donut-Café.png', tag: 'Queridinho' },
  { id: 7, name: 'Trufa de Menta', category: 'Balas', price: 1.9, description: 'Um docinho que derrete na boca e no coração.', image: '/ChocoMenta.png', tag: 'Mais amada' },
  { id: 8, name: 'Trufa de Morango', category: 'Balas', price: 1.9, description: 'Um docinho que derrete na boca e no coração.', image: '/TrufaMorango.png', tag: 'Delicada' },
  { id: 9, name: 'Trufa de Coco', category: 'Balas', price: 4.9, description: 'Um chocolate que derrete na boca e no coração.', image: '/TrufadeCoco.png', tag: 'Fofo demais' },
];

const categories = ['Todos', 'Frutinhas', 'Chocolates', 'Balas', 'Donuts'];
const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('belle-sucree-cart');
      const savedFavorites = localStorage.getItem('belle-sucree-favorites');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch {
      setCart([]);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('belle-sucree-cart', JSON.stringify(cart)); } catch { }
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('belle-sucree-favorites', JSON.stringify(favorites)); } catch { }
  }, [favorites]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleProducts = useMemo(() => products.filter(product => {
    const matchesCategory = category === 'Todos' || product.category === category;
    const matchesQuery = `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesFavorites = !favoritesOnly || favorites.includes(product.id);
    return matchesCategory && matchesQuery && matchesFavorites;
  }), [category, query, favoritesOnly, favorites]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function addToCart(product, event) {
    const button = event?.currentTarget;
    const card = button?.closest('.sweet-card');
    const image = card?.querySelector('.sweet-image');
    const bag = document.querySelector('.bag-trigger');
    if (image && bag && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const start = image.getBoundingClientRect();
      const end = bag.getBoundingClientRect();
      const flyer = document.createElement('img');
      flyer.src = image.currentSrc || image.src;
      flyer.className = 'flying-sweet';
      Object.assign(flyer.style, {
        left: `${start.left + start.width / 2 - 34}px`,
        top: `${start.top + start.height / 2 - 34}px`,
        width: '68px',
        height: '68px',
        '--fly-x': `${end.left + end.width / 2 - start.left - start.width / 2}px`,
        '--fly-y': `${end.top + end.height / 2 - start.top - start.height / 2}px`
      });
      document.body.appendChild(flyer);
      window.setTimeout(() => flyer.remove(), 850);
      bag.classList.remove('bag-pop');
      void bag.offsetWidth;
      bag.classList.add('bag-pop');
      window.setTimeout(() => bag.classList.remove('bag-pop'), 650);
    }
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      return found
        ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} foi para a sua sacolinha!`);
  }

  function changeQuantity(id, amount) {
    setCart(current => current
      .map(item => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter(item => item.quantity > 0));
  }

  function toggleFavorite(id) {
    setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }

  function checkout() {
    if (!cart.length) {
      setToast('Sua sacolinha ainda está vazia.');
      return;
    }
    const lines = cart.map(item => `${item.quantity}x ${item.name} — ${money(item.price * item.quantity)}`).join('\n');
    const message = `Olá, Belle Sucrée! Quero fazer este pedido:\n\n${lines}\n\nSubtotal: ${money(subtotal)}\n\nPodem me informar as opções de entrega e pagamento?`;
    setToast('Pedido preparado! Configure o WhatsApp da loja para finalizar.');
    const phone = '';
    if (phone) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  function goToCollection() {
    document.getElementById('colecao')?.scrollIntoView({ behavior: 'smooth' });
  }

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <div className="belle-site">
      <div className="top-ribbon"><Sparkles size={14} /> FEITO COM CARINHO, ESCOLHIDO COM UM SORRISO <span>✦</span> UM DOCINHO MUDA O DIA</div>

      <header className="belle-header">
        <a className="belle-brand" href="#inicio" aria-label="Belle Sucrée - início">
          <img src="/logo.png" alt="Belle Sucrée" />
        </a>
        <nav className="belle-nav" aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#colecao">Doces</a>
          <a href="#sobre">Nosso carinho</a>
        </nav>
        <div className="header-tools">
          <button className="round-tool" aria-label="Buscar doces" onClick={() => setSearchOpen(open => !open)}><Search size={19} /></button>
          <button className="round-tool favorite-tool" aria-label="Mostrar favoritos" onClick={() => { setFavoritesOnly(value => !value); goToCollection(); }}>
            <Heart size={19} fill={favoritesOnly ? 'currentColor' : 'none'} />
          </button>
          <button className="bag-trigger" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>Sacolinha</span><b>{cartCount}</b></button>
        </div>
      </header>

      {searchOpen && (
        <div className="belle-search">
          <Search size={19} />
          <input autoFocus value={query} onChange={event => { setQuery(event.target.value); goToCollection(); }} placeholder="Qual docinho você está procurando?" aria-label="Buscar doces" />
          <button onClick={() => { setSearchOpen(false); setQuery(''); }} aria-label="Fechar busca"><X size={19} /></button>
        </div>
      )}

      <main>
        <section className="belle-hero" id="inicio">
          <div className="hero-confetti confetti-one">✦</div><div className="hero-confetti confetti-two">♡</div><div className="hero-confetti confetti-three">✳</div>
          <div className="hero-content">
            <span className="eyebrow-pill"><Sparkles size={14} /> UM UNIVERSO DE DOCES</span>
            <h1>Pequenos doces,<br /><em>grandes sorrisos.</em></h1>
            <p>Uma coleção de delícias feita para colorir o seu dia, adoçar os momentos simples e transformar carinho em sabor.</p>
            <div className="hero-buttons">
              <button className="primary-cta" onClick={goToCollection}>Escolher meus doces <ArrowRight size={17} /></button>
              <a className="secondary-cta" href="#sobre">Conheça a Belle <ArrowDown size={15} /></a>
            </div>
            <div className="hero-note"><span className="note-heart">♥</span><span><strong>Um mimo em cada detalhe</strong><small>Porque você merece um momento doce.</small></span></div>
          </div>
          <div className="hero-art" aria-label="Doces especiais">
            <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
            <div className="hero-sticker sticker-top">feito com<br />amor ♡</div>
            <div className="hero-sweet sweet-strawberry"><img src="/morango.png" alt="Morango doce" /></div>
  
            <div className="hero-sweet sweet-donut"><img src="/donut.png" alt="Donut" /></div>
            <div className="hero-sticker sticker-bottom">100%<br /><b>delícia!</b></div>
            <span className="art-sparkle sparkle-a">✦</span><span className="art-sparkle sparkle-b">✧</span><span className="art-sparkle sparkle-c">♡</span>
          </div>
          <div className="hero-bottom-label"><span>01</span><i></i><span>UMA EXPERIÊNCIA AÇUCARADA</span></div>
        </section>

        <section className="collection-section" id="colecao">
          <div className="section-intro">
            <span className="section-kicker">ESCOLHIDOS PARA VOCÊ</span>
            <h2>Qual vai ser o seu <em>docinho?</em></h2>
            <p>Escolha seus favoritos e monte uma sacolinha cheia de felicidade.</p>
          </div>
          <div className="collection-controls">
            <div className="category-list" aria-label="Filtrar por categoria">
              {categories.map(item => <button key={item} className={category === item ? 'category-chip active' : 'category-chip'} onClick={() => { setCategory(item); setFavoritesOnly(false); }}>{item}</button>)}
            </div>
            <span className="result-count">{visibleProducts.length} {visibleProducts.length === 1 ? 'delícia' : 'delícias'}</span>
          </div>
          {visibleProducts.length ? (
            <div className="sweet-grid">
              {visibleProducts.map((product, index) => (
                <article className="sweet-card" key={product.id} style={{ '--card-delay': `${index * 70}ms` }}>
                  <div className={`sweet-art sweet-art-${product.id}`}>
                    {product.tag && <span className="sweet-tag">{product.tag}</span>}
                    <button className={`sweet-favorite ${favorites.includes(product.id) ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label={favorites.includes(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}><Heart size={18} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button>
                    <img className="sweet-image" src={product.image} alt={product.name} />
                    <span className="art-glimmer">✦</span>
                  </div>
                  <div className="sweet-info">
                    <div className="sweet-category">{product.category}</div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="sweet-card-bottom"><strong>{money(product.price)}</strong><button className="add-sweet" onClick={event => addToCart(product, event)} aria-label={`Adicionar ${product.name} à sacola`}><Plus size={19} /><span>Adicionar</span></button></div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results"><span>🍬</span><h3>Nenhum docinho por aqui</h3><p>Tente outra busca ou escolha uma categoria diferente.</p><button onClick={() => { setQuery(''); setCategory('Todos'); setFavoritesOnly(false); }}>Ver todos os doces</button></div>
          )}
        </section>

        <section className="love-banner" id="sobre">
          <div className="banner-sweet banner-left"><img src="/cereja.png" alt="" /></div>
          <div className="banner-copy"><span>UM CARINHO EM FORMA DE DOCE</span><h2>Seu dia merece<br /><em>um toque de magia.</em></h2><p>Na Belle Sucrée, cada escolha é uma oportunidade de presentear alguém — ou você mesma — com um momento feliz.</p><button className="banner-button" onClick={goToCollection}>Encontrar meu favorito <ArrowRight size={16} /></button></div>
          <div className="banner-sweet banner-right"><img src="/balinha.png" alt="" /></div>
          <span className="banner-star star-left">✦</span><span className="banner-star star-right">✧</span>
        </section>
      </main>

      <footer className="belle-footer"><a href="#inicio"><img src="/logo.png" alt="Belle Sucrée" /></a><p>Feito com carinho, para adoçar os seus melhores momentos. ♡</p><span>© {new Date().getFullYear()} Belle Sucrée</span></footer>

      {toast && <div className="belle-toast"><span><Check size={17} /></span>{toast}<button onClick={() => setToast('')} aria-label="Fechar aviso"><X size={16} /></button></div>}

      {cartOpen && (
        <div className="cart-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside className="cart-drawer" aria-label="Sua sacolinha">
            <div className="cart-heading"><div><span>SUA SELEÇÃO</span><h2>Sacolinha <span>♡</span></h2></div><button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Fechar sacola"><X size={21} /></button></div>
            {cart.length ? <>
              <div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-info"><h3>{item.name}</h3><span>{money(item.price)}</span><div className="quantity-control"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Diminuir quantidade"><Minus size={13} /></button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar quantidade"><Plus size={13} /></button></div></div><button className="remove-item" onClick={() => setCart(current => current.filter(product => product.id !== item.id))} aria-label={`Remover ${item.name}`}><Trash2 size={16} /></button></div>)}</div>
              <div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Entrega e pagamento combinados no atendimento.</p><button className="checkout-button" onClick={checkout}>Continuar pedido <ArrowRight size={17} /></button></div>
            </> : <div className="empty-cart"><span className="empty-cart-icon"><ShoppingBag size={30} /></span><h3>Sua sacolinha está vazia</h3><p>Tem tanta coisa gostosa esperando por você!</p><button onClick={() => { setCartOpen(false); goToCollection(); }}>Escolher meus doces</button></div>}
          </aside>
        </div>
      )}
    </div>
  );
}
