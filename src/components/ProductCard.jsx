
export default function ProductCard({ product, onAdd }) {
  const handleAdd = (event) => {
    onAdd?.(product, event);
  };

  return (
    <article className="product-card">
      <div className="product-image">
        <img
          className="product-main-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

        <span className="product-tag">{product.tag}</span>

        <img
          className="product-brand-logo"
          src="/logo.png"
          alt="Belle Sucrée"
          loading="lazy"
        />

        <button
          type="button"
          className="quick-add"
          onClick={handleAdd}
          aria-label={`Adicionar ${product.name} à sacola`}
        >
          +
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-bottom">
          <strong>
            {product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>

          <button type="button" onClick={handleAdd}>
            Adicionar <span>↗</span>
          </button>
        </div>
      </div>
    </article>
  );
}