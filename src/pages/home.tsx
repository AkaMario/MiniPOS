import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Sistema POS (Punto de Venta) con gestión de inventario multi-usuario
 * 
 * Características:
 * - Datos separados por usuario (email) en localStorage
 * - Punto de venta con carrito de compras
 * - Gestión completa de inventario (CRUD)
 * - Historial y reportes de ventas
 * - Soporte para imágenes de productos
 */

type Product = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  location: string;
  price: number;
  description: string;
  image?: string;
  category?: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};


type Sale = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
};

type ProductFormProps = {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  editingProduct: Product | null;
  onCancelEdit: () => void;
};

const ProductForm: React.FC<ProductFormProps> = ({ setProducts, editingProduct, onCancelEdit }) => {
  const [form, setForm] = useState<Omit<Product, 'id'>>({
    name: '',
    sku: '',
    quantity: 0,
    location: '',
    price: 0,
    description: '',
    image: '',
    category: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        sku: editingProduct.sku,
        quantity: editingProduct.quantity,
        location: editingProduct.location,
        price: editingProduct.price,
        description: editingProduct.description,
        image: editingProduct.image || '',
        category: editingProduct.category || ''
      });
    }
  }, [editingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.location || !form.price) return;

    if (editingProduct) {
      // Editar producto existente
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...form, id: editingProduct.id } : p));
      onCancelEdit();
    } else {
      // Agregar nuevo producto
      const id = Date.now().toString();
      setProducts(prev => [...prev, { ...form, id }]);
    }
    
    setForm({ name: '', sku: '', quantity: 0, location: '', price: 0, description: '', image: '', category: '' });
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre *</label>
        <input className="mt-1 block w-full border rounded-md p-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">SKU *</label>
        <input className="mt-1 block w-full border rounded-md p-2" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Categoría</label>
        <input className="mt-1 block w-full border rounded-md p-2" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Cantidad *</label>
        <input type="number" className="mt-1 block w-full border rounded-md p-2" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} min={0} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ubicación *</label>
        <input className="mt-1 block w-full border rounded-md p-2" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Precio *</label>
        <input type="number" step="0.01" className="mt-1 block w-full border rounded-md p-2" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} min={0} required />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea className="mt-1 block w-full border rounded-md p-2" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Imagen</label>
        <input type="file" accept="image/*" className="mt-1 block w-full" onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = ev => setForm(f => ({ ...f, image: ev.target?.result as string }));
            reader.readAsDataURL(file);
          }
        }} />
        {form.image && (
          <div
            className="mt-2 h-20 w-20 relative group cursor-pointer"
            title="Haz click para eliminar la imagen"
            onClick={() => setForm(f => ({ ...f, image: '' }))}
          >
            <img
              src={form.image}
              alt="preview"
              className="h-20 w-20 object-cover rounded border-2 border-transparent group-hover:border-red-500 group-hover:opacity-60 transition duration-200"
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold opacity-0 group-hover:opacity-100 bg-red-500 bg-opacity-70 rounded transition duration-200">
              Quitar
            </span>
          </div>
        )}
      </div>
      <div className="md:col-span-2 flex justify-end gap-2">
        {editingProduct && (
          <button type="button" onClick={onCancelEdit} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Cancelar
          </button>
        )}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {editingProduct ? 'Actualizar' : 'Agregar'}
        </button>
      </div>
    </form>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; token?: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'pos' | 'inventory' | 'sales'>('pos');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
  const [salesFilter, setSalesFilter] = useState<'today' | 'month' | 'year' | 'all'>('all');
  const [salesGroupBy, setSalesGroupBy] = useState<'day' | 'month' | 'year'>('day');

  // Función para obtener la clave de localStorage basada en el email del usuario
  const getStorageKey = (key: string, userEmail: string) => {
    return `${key}_${userEmail}`;
  };

  // Cargar datos de localStorage específicos del usuario
  useEffect(() => {
    if (user?.email) {
      const savedProducts = localStorage.getItem(getStorageKey('pos_products', user.email));
      const savedSales = localStorage.getItem(getStorageKey('pos_sales', user.email));
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedSales) setSales(JSON.parse(savedSales));
    }
  }, [user?.email]);

  // Guardar productos en localStorage específico del usuario
  useEffect(() => {
    if (user?.email && products.length >= 0) {
      localStorage.setItem(getStorageKey('pos_products', user.email), JSON.stringify(products));
    }
  }, [products, user?.email]);

  // Guardar ventas en localStorage específico del usuario
  useEffect(() => {
    if (user?.email && sales.length >= 0) {
      localStorage.setItem(getStorageKey('pos_sales', user.email), JSON.stringify(sales));
    }
  }, [sales, user?.email]);

  useEffect(() => {
    const rawLocal = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;
    const rawSession = typeof window !== "undefined" ? sessionStorage.getItem("currentUser") : null;
    const raw = rawLocal ?? rawSession;
    if (!raw) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      const parsed = JSON.parse(raw as string);
      if (!parsed?.name || !parsed?.email) {
        navigate("/login", { replace: true });
        return;
      }
      setUser(parsed);
    } catch {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('inventory');
  };

  const handleAddToCart = (product: Product) => {
    if (product.quantity <= 0) {
      alert('Producto sin stock');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          alert('No hay suficiente stock');
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.quantity) {
      alert('No hay suficiente stock');
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const sale: Sale = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cart,
      total,
      paymentMethod
    };

    // Actualizar inventario
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(item => item.product.id === p.id);
      if (cartItem) {
        return { ...p, quantity: p.quantity - cartItem.quantity };
      }
      return p;
    }));

    setSales(prev => [sale, ...prev]);
    setCart([]);
    alert(`Venta completada: $${total.toFixed(2)}`);
  };

  // Funciones de filtrado de ventas
  const getFilteredSales = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      switch (salesFilter) {
        case 'today':
          return saleDate >= today;
        case 'month':
          return saleDate >= thisMonth;
        case 'year':
          return saleDate >= thisYear;
        default:
          return true;
      }
    });
  };

  // Agrupar ventas por período
  const getGroupedSales = () => {
    const filtered = getFilteredSales();
    const grouped: { [key: string]: Sale[] } = {};

    filtered.forEach(sale => {
      const saleDate = new Date(sale.date);
      let key = '';

      switch (salesGroupBy) {
        case 'day':
          key = saleDate.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          break;
        case 'month':
          key = saleDate.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long' 
          });
          break;
        case 'year':
          key = saleDate.getFullYear().toString();
          break;
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(sale);
    });

    return grouped;
  };

  const filteredSales = getFilteredSales();
  const groupedSales = getGroupedSales();

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Redirigiendo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between bg-white shadow px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="text-lg sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="sm:w-9 sm:h-9">
              <rect width="24" height="24" rx="6" fill="#06b6d4" />
              <path d="M6 12h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6 8h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg> 
            <span className="hidden sm:inline">Mini POS</span>
            <span className="sm:hidden">POS</span>
          </div>
          <div className="hidden md:block text-sm text-gray-500">Punto de Venta</div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-xs sm:text-sm text-gray-700 max-w-[100px] sm:max-w-none truncate">
            <span className="hidden sm:inline">👤 </span>{user.name}
          </div>
          <button
            onClick={handleSignOut}
            className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm rounded hover:bg-red-600"
          >
            <span className="hidden sm:inline">Cerrar sesión</span>
            <span className="sm:hidden">Salir</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Responsive: Bottom nav en móvil, lateral en desktop */}
        <aside className="md:w-64 bg-white border-r md:border-b-0 border-b md:min-h-[calc(100vh-64px)] order-2 md:order-1">
          {/* Navigation tabs - Horizontal en móvil, vertical en desktop */}
          <nav className="flex md:flex-col md:p-4 md:space-y-1 overflow-x-auto md:overflow-x-visible">
            <button
              onClick={() => setActiveTab('pos')}
              className={`flex-1 md:w-full text-center md:text-left px-3 md:px-4 py-3 md:rounded-lg transition whitespace-nowrap ${
                activeTab === 'pos' ? 'bg-blue-100 text-blue-700 font-medium border-b-2 md:border-b-0 border-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <span className="md:hidden">💳 POS</span>
              <span className="hidden md:inline">💳 Punto de Venta</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 md:w-full text-center md:text-left px-3 md:px-4 py-3 md:rounded-lg transition whitespace-nowrap ${
                activeTab === 'inventory' ? 'bg-blue-100 text-blue-700 font-medium border-b-2 md:border-b-0 border-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <span className="md:hidden">📦 Inv.</span>
              <span className="hidden md:inline">📦 Inventario</span>
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`flex-1 md:w-full text-center md:text-left px-3 md:px-4 py-3 md:rounded-lg transition whitespace-nowrap ${
                activeTab === 'sales' ? 'bg-blue-100 text-blue-700 font-medium border-b-2 md:border-b-0 border-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <span className="md:hidden">📊 Ventas</span>
              <span className="hidden md:inline">📊 Ventas</span>
            </button>
          </nav>

          {/* Stats sidebar - Oculto en móvil, visible en tablet y desktop */}
          <div className="hidden md:block p-4 border-t mt-4 space-y-3">
            <div className="bg-green-50 p-3 rounded">
              <div className="text-xs text-green-600 font-medium">Ventas del día</div>
              <div className="text-lg lg:text-xl font-bold text-green-700">${totalSales.toFixed(2)}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-xs text-blue-600 font-medium">Productos en stock</div>
              <div className="text-lg lg:text-xl font-bold text-blue-700">{totalProducts}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="text-xs text-purple-600 font-medium">Transacciones</div>
              <div className="text-lg lg:text-xl font-bold text-purple-700">{sales.length}</div>
            </div>
          </div>
        </aside>

        {/* Main Content - Responsive padding */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 order-1 md:order-2">
          {/* TAB: PUNTO DE VENTA */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {/* Productos disponibles */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
                  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Productos disponibles</h2>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="🔍 Buscar productos..."
                    className="w-full px-3 sm:px-4 py-2 border rounded-lg mb-3 sm:mb-4 text-sm sm:text-base"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
                    {products
                      .filter(p =>
                        p.name.toLowerCase().includes(query.toLowerCase()) ||
                        p.sku.toLowerCase().includes(query.toLowerCase())
                      )
                      .map((product) => (
                        <div
                          key={product.id}
                          className="border rounded-lg p-2 sm:p-3 hover:shadow-md transition cursor-pointer active:scale-95"
                          onClick={() => handleAddToCart(product)}
                        >
                          <div className="flex gap-2 sm:gap-3">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0" />
                            ) : (
                              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                                Sin imagen
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs sm:text-sm truncate">{product.name}</div>
                              <div className="text-xs text-gray-500 truncate">{product.sku}</div>
                              <div className="text-sm sm:text-base font-bold text-green-600 mt-1">${product.price.toFixed(2)}</div>
                              <div className="text-xs text-gray-600">Stock: {product.quantity}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Carrito de compras - Sticky en móvil */}
              <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-20 lg:self-start">
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
                  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">🛒 Carrito</h2>
                  {cart.length === 0 ? (
                    <div className="text-center text-gray-400 py-6 sm:py-8 text-sm sm:text-base">
                      Carrito vacío
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-[200px] sm:max-h-[300px] overflow-y-auto mb-3 sm:mb-4">
                        {cart.map((item) => (
                          <div key={item.product.id} className="flex items-center gap-2 border-b pb-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs sm:text-sm font-medium truncate">{item.product.name}</div>
                              <div className="text-xs text-gray-500">${item.product.price.toFixed(2)} c/u</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity - 1)}
                                className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200 rounded hover:bg-gray-300 active:scale-95 text-sm sm:text-base"
                              >
                                -
                              </button>
                              <span className="w-6 sm:w-8 text-center text-xs sm:text-sm">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity + 1)}
                                className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200 rounded hover:bg-gray-300 active:scale-95 text-sm sm:text-base"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700 text-sm sm:text-base ml-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-3 sm:pt-4 space-y-3">
                        <div className="flex justify-between text-base sm:text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-green-600">${cartTotal.toFixed(2)}</span>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-2">Método de pago</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as 'efectivo' | 'tarjeta' | 'transferencia')}
                            className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base"
                          >
                            <option value="efectivo">💵 Efectivo</option>
                            <option value="tarjeta">💳 Tarjeta</option>
                            <option value="transferencia">🏦 Transferencia</option>
                          </select>
                        </div>

                        <button
                          onClick={handleCompleteSale}
                          className="w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-green-700 active:scale-95 font-medium text-sm sm:text-base transition"
                        >
                          Completar venta
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: INVENTARIO */}
          {activeTab === 'inventory' && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Formulario */}
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  {editingProduct ? '✏️ Editar producto' : '➕ Agregar producto'}
                </h2>
                <ProductForm
                  setProducts={setProducts}
                  editingProduct={editingProduct}
                  onCancelEdit={() => setEditingProduct(null)}
                />
              </div>

              {/* Tabla de productos - Responsive: cards en móvil, tabla en desktop */}
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">📦 Lista de productos</h2>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="🔍 Buscar por nombre, SKU o ubicación..."
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg mb-3 sm:mb-4 text-sm sm:text-base"
                />
                
                {/* Vista de tabla (desktop) */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-3 text-left">Imagen</th>
                        <th className="px-4 py-3 text-left">Producto</th>
                        <th className="px-4 py-3 text-left">SKU</th>
                        <th className="px-4 py-3 text-left">Categoría</th>
                        <th className="px-4 py-3 text-left">Stock</th>
                        <th className="px-4 py-3 text-left">Precio</th>
                        <th className="px-4 py-3 text-left">Ubicación</th>
                        <th className="px-4 py-3 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter(p =>
                          p.name.toLowerCase().includes(query.toLowerCase()) ||
                          p.sku.toLowerCase().includes(query.toLowerCase()) ||
                          p.location.toLowerCase().includes(query.toLowerCase())
                        )
                        .map((product) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                  N/A
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-gray-500">{product.description}</div>
                            </td>
                            <td className="px-4 py-3">{product.sku}</td>
                            <td className="px-4 py-3">{product.category || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                product.quantity === 0 ? 'bg-red-100 text-red-700' :
                                product.quantity < 10 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {product.quantity}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium">${product.price.toFixed(2)}</td>
                            <td className="px-4 py-3">{product.location}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Vista de cards (móvil y tablet) */}
                <div className="lg:hidden space-y-3">
                  {products
                    .filter(p =>
                      p.name.toLowerCase().includes(query.toLowerCase()) ||
                      p.sku.toLowerCase().includes(query.toLowerCase()) ||
                      p.location.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((product) => (
                      <div key={product.id} className="border rounded-lg p-3 hover:shadow-md transition">
                        <div className="flex gap-3 mb-3">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0" />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                              Sin imagen
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm sm:text-base mb-1">{product.name}</div>
                            <div className="text-xs text-gray-500 mb-1">SKU: {product.sku}</div>
                            {product.category && (
                              <div className="text-xs text-gray-500 mb-1">📁 {product.category}</div>
                            )}
                            <div className="text-xs text-gray-500">📍 {product.location}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="text-xs text-gray-500">Precio</div>
                              <div className="font-bold text-green-600 text-sm sm:text-base">${product.price.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Stock</div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                product.quantity === 0 ? 'bg-red-100 text-red-700' :
                                product.quantity < 10 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {product.quantity}
                              </span>
                            </div>
                          </div>
                        </div>

                        {product.description && (
                          <div className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-xs sm:text-sm hover:bg-blue-600 active:scale-95 transition"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-xs sm:text-sm hover:bg-red-600 active:scale-95 transition"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Mensaje cuando no hay productos */}
                {products.filter(p =>
                  p.name.toLowerCase().includes(query.toLowerCase()) ||
                  p.sku.toLowerCase().includes(query.toLowerCase()) ||
                  p.location.toLowerCase().includes(query.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
                    No se encontraron productos
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: VENTAS */}
          {activeTab === 'sales' && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Resumen con filtros - Responsive */}
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-semibold">📊 Resumen de ventas</h2>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setSalesFilter('today')}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition ${
                        salesFilter === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 active:scale-95'
                      }`}
                    >
                      Hoy
                    </button>
                    <button
                      onClick={() => setSalesFilter('month')}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition ${
                        salesFilter === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 active:scale-95'
                      }`}
                    >
                      Este mes
                    </button>
                    <button
                      onClick={() => setSalesFilter('year')}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition ${
                        salesFilter === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 active:scale-95'
                      }`}
                    >
                      Este año
                    </button>
                    <button
                      onClick={() => setSalesFilter('all')}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition ${
                        salesFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 active:scale-95'
                      }`}
                    >
                      Todas
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-green-700 font-medium">Total ventas</div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 mt-1">${totalSales.toFixed(2)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-blue-700 font-medium">Transacciones</div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mt-1">{filteredSales.length}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-purple-700 font-medium">Promedio por venta</div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 mt-1">
                      ${filteredSales.length > 0 ? (totalSales / filteredSales.length).toFixed(2) : '0.00'}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg">
                    <div className="text-xs sm:text-sm text-orange-700 font-medium">Productos vendidos</div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600 mt-1">
                      {filteredSales.reduce((sum, sale) => sum + sale.items.reduce((s, i) => s + i.quantity, 0), 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Historial de ventas con agrupación - Responsive */}
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-semibold">📋 Historial de ventas</h2>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Agrupar por:</span>
                    <select
                      value={salesGroupBy}
                      onChange={(e) => setSalesGroupBy(e.target.value as 'day' | 'month' | 'year')}
                      className="px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm"
                    >
                      <option value="day">Día</option>
                      <option value="month">Mes</option>
                      <option value="year">Año</option>
                    </select>
                  </div>
                </div>

                {filteredSales.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
                    No hay ventas registradas para este período
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {Object.entries(groupedSales).map(([period, periodSales]) => {
                      const periodTotal = periodSales.reduce((sum, sale) => sum + sale.total, 0);
                      const periodItems = periodSales.reduce((sum, sale) => sum + sale.items.reduce((s, i) => s + i.quantity, 0), 0);

                      return (
                        <div key={period} className="border rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 pb-3 border-b">
                            <div>
                              <h3 className="font-semibold text-sm sm:text-base text-gray-800 capitalize">{period}</h3>
                              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                {periodSales.length} {periodSales.length === 1 ? 'venta' : 'ventas'} • {periodItems} productos
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="text-xl sm:text-2xl font-bold text-green-600">${periodTotal.toFixed(2)}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {periodSales.map((sale) => (
                              <div key={sale.id} className="bg-gray-50 rounded-lg p-2 sm:p-3 hover:bg-gray-100 transition">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-xs sm:text-sm">Venta #{sale.id.slice(-6)}</div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(sale.date).toLocaleString('es-ES', { 
                                        dateStyle: 'short', 
                                        timeStyle: 'short' 
                                      })}
                                    </div>
                                  </div>
                                  <div className="flex justify-between sm:block sm:text-right">
                                    <div className="text-base sm:text-lg font-bold text-green-600">${sale.total.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500 capitalize">{sale.paymentMethod}</div>
                                  </div>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                  <div className="text-xs text-gray-600 mb-1">Productos:</div>
                                  <ul className="text-xs space-y-1">
                                    {sale.items.map((item, idx) => (
                                      <li key={idx} className="flex justify-between gap-2">
                                        <span className="text-gray-700 flex-1 min-w-0 truncate">{item.product.name} x{item.quantity}</span>
                                        <span className="font-medium text-gray-900 flex-shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
