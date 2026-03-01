import re

with open("src/screens/ServicesScreen.tsx", "r") as f:
    content = f.read()

# Replace bg-nova-primary with bg-[#3B82F6]
content = content.replace("bg-nova-primary", "bg-[#3B82F6]")

# Add FabAndModal component
fab_and_modal = """
  const FabAndModal = () => (
    <>
      {cartTotal > 0 && viewMode !== 'cart' && (
        <div className="fixed bottom-24 left-4 right-4 z-50 animate-fade-in">
          <button
            onClick={() => setViewMode('cart')}
            className="w-full flex items-center justify-between p-4 bg-[#3B82F6] text-white rounded-2xl shadow-lg shadow-[#3B82F6]/30"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-1.5 -right-2 w-5 h-5 bg-[#EF4444] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#3B82F6]">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <span className="font-bold">Корзина</span>
            </div>
            <span className="font-bold">{cartTotal.toLocaleString('ru-RU')} ₽</span>
          </button>
        </div>
      )}

      {showOrderSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in">
          <div className="bg-[#12121A] border border-[#10B981]/30 rounded-3xl p-6 mx-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-[#10B981]" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
              {showOrderSuccess === 'order' ? 'Заказ оформлен!' : 'Оплата успешно прошла'}
            </h3>
            <p className="text-sm text-[#64748B]">
              {showOrderSuccess === 'order' ? 'Исполнитель свяжется с вами' : 'Чек отправлен на почту'}
            </p>
          </div>
        </div>
      )}
    </>
  );
"""

content = content.replace(
    "const handleAddToCart",
    fab_and_modal.strip() + "\n\n  const handleAddToCart"
)

# Append FabAndModal to all return divs
content = re.sub(
    r'(      </div>\n    \);\n  })',
    r'        <FabAndModal />\n\1',
    content
)

# Replace the existing Success Modal in the main return with FabAndModal
regex_old_modal = r'      \{\/\* Success Modal \*\/\}.*?      \)\}\n'
content = re.sub(regex_old_modal, '      <FabAndModal />\n', content, flags=re.DOTALL)

# Fix back buttons to also reset category
back_btn_old = """          <button
            onClick={() => setViewMode('services')}
            className="flex items-center gap-1 text-sm text-[#60A5FA]"
          >"""

back_btn_new = """          <button
            onClick={() => {
              setViewMode('services');
              setActiveCategory('all');
            }}
            className="flex items-center gap-1 text-sm text-[#60A5FA]"
          >"""

content = content.replace(back_btn_old, back_btn_new)

with open("src/screens/ServicesScreen.tsx", "w") as f:
    f.write(content)

