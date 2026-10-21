
import { useEffect, useRef, useState } from 'react';
import {
  Heart,
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import './Header.css';

export default function Header({
  cartCount = 0,
  onCartClick,
  search = '',
  onSearch,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const previousCount = useRef(cartCount);

  useEffect(() => {
    if (cartCount === previousCount.current) return;

    setCartPulse(true);
    previousCount.current = cartCount;

    const timer = window.setTimeout(() => {
      setCartPulse(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [cartCount]);

  const closeMenu = () => setMenuOpen(false);

  const goToSection = (section) => {
    closeMenu();
    setSearchOpen(false);

    document.getElementById(section)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    goToSection('produtos');
  };

  const handleCartClick = () => {
    closeMenu();
    onCartClick?.();
  };

  return (
    <header className="header" id="cabecalho">
      <div className="header-inner">
        <a
          className="brand"
          href="#inicio"
          onClick={(event) => {
            event.preventDefault();
            goToSection('inicio');
          }}
          aria-label="Belle Sucrée - Início"
        >
          <img
            className="brand-logo"
            src="/logo.png"
            alt="Belle Sucrée"
            onError={(event) => {
              console.error(
                'Não foi possível carregar /logo.png. Confira o arquivo em public/logo.png.'
              );
              event.currentTarget.style.visibility = 'hidden';
            }}
          />

          <span className="brand-caption">
            DOÇURA EM CADA DETALHE
          </span>
        </a>

        <nav
          className={`desktop-nav ${menuOpen ? 'nav-open' : ''}`}
          aria-label="Navegação principal"
        >
          <button
            className="nav-link"
            type="button"
            onClick={() => goToSection('inicio')}
          >
            Início
          </button>

          <button
            className="nav-link"
            type="button"
            onClick={() => goToSection('produtos')}
          >
            Nossa vitrine
          </button>

          <button
            className="nav-link nav-highlight"
            type="button"
            onClick={() => goToSection('produtos')}
          >
            <span>Doces especiais</span>
            <Sparkles size={14} />
          </button>

          <button
            className="mobile-menu-cart"
            type="button"
            onClick={handleCartClick}
          >
            <ShoppingBag size={19} />
            Minha sacola ({cartCount})
            <ArrowRight size={17} />
          </button>
        </nav>

        <div className="header-actions">
          <form
            className={`search-box ${searchOpen ? 'search-expanded' : ''}`}
            onSubmit={handleSearchSubmit}
          >
            <button
              className="search-icon-button"
              type="submit"
              aria-label="Buscar produtos"
            >
              <Search size={18} />
            </button>

            <input
              type="search"
              value={search}
              onChange={(event) => onSearch?.(event.target.value)}
              placeholder="Encontre sua delícia..."
              aria-label="Buscar produtos"
              onFocus={() => setSearchOpen(true)}
            />

            {search.length > 0 && (
              <button
                className="clear-search"
                type="button"
                onClick={() => onSearch?.('')}
                aria-label="Limpar busca"
              >
                <X size={15} />
              </button>
            )}
          </form>

          <button
            className="mobile-search-toggle"
            type="button"
            onClick={() => setSearchOpen((current) => !current)}
            aria-label={searchOpen ? 'Fechar busca' : 'Mostrar busca'}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X size={21} /> : <Search size={21} />}
          </button>

          <button
            className={`cart-button ${cartPulse ? 'cart-pulse' : ''}`}
            type="button"
            onClick={handleCartClick}
            aria-label={`Abrir sacola com ${cartCount} itens`}
          >
            <span className="cart-icon-wrap">
              <ShoppingBag
                className="cart-main-icon"
                size={22}
                strokeWidth={1.6}
              />

              {cartCount > 0 && (
                <span key={cartCount} className="cart-count">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>

            <span className="cart-text">
              <strong>Minha sacola</strong>
              <small>
                {cartCount === 0
                  ? 'Seu próximo mimo está aqui'
                  : `${cartCount} ${
                      cartCount === 1 ? 'item' : 'itens'
                    } na sacola`}
              </small>
            </span>

            <span className="cart-heart-wrap">
              <Heart className="cart-heart" size={17} />
            </span>

            <ChevronDown className="cart-chevron" size={15} />
          </button>

          <button
            className="mobile-menu-toggle"
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      <div className="header-promo">
        <span className="promo-line" />
        <Sparkles size={13} />
        <span>Pequenas delícias, grandes momentos</span>
        <Heart size={12} />
        <span className="promo-line" />
      </div>
    </header>
  );
}
