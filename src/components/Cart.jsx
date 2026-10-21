
export default function Cart({
  cart,
  totalPrice,
  onClose,
  onChangeQuantity,
  onRemove,
  onCheckout
}) {
  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside
        className="cart-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Sua sacola de compras"
      >
        <div className="cart-header">
          <div>
            <span className="eyebrow">SEU MOMENTO DOCE</span>
            <h2>Minha sacola ♡</h2>
          </div>
          <button className="close-cart" onClick={onClose} aria-label="Fechar sacola">×</button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <span>🍭</span>
            <h3>Sua sacola está vazia</h3>
            <p>Tem tanta delícia esperando por você!</p>
            <button onClick={onClose}>Explorar doces</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <strong>
                      {(item.price * item.quantity).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </strong>

                    <div className="quantity-control">
                      <button onClick={() => onChangeQuantity(item.id, -1)} aria-label="Diminuir quantidade">−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onChangeQuantity(item.id, 1)} aria-label="Aumentar quantidade">+</button>
                    </div>
                  </div>
                  <button className="remove-item" onClick={() => onRemove(item.id)} aria-label={`Remover ${item.name}`}>×</button>
                </article>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <span>Total do pedido</span>
                <strong>
                  {totalPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </strong>
              </div>
              <p>Entrega e disponibilidade serão confirmadas pelo atendimento.</p>
              <button className="checkout-button" onClick={onCheckout}>
                Pedir pelo WhatsApp <span>↗</span>
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
