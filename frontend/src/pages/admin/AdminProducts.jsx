import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  category: 'Electronics',
  image: '',
  stock: '',
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ limit: 100 });
      setProducts(data.products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
    });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editing) {
        await updateProduct(editing._id, payload);
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product created');
      }
      setModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Product
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="mt-6 overflow-x-auto card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b dark:border-gray-800">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">${p.price?.toFixed(2)}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="rounded p-2 text-blue-600 hover:bg-blue-50">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="rounded p-2 text-red-600 hover:bg-red-50">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
            <h2 className="text-lg font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {['title', 'description', 'price', 'category', 'image', 'stock'].map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium capitalize">{field}</label>
                  {field === 'description' ? (
                    <textarea
                      required
                      rows={3}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="input-field mt-1"
                    />
                  ) : (
                    <input
                      required
                      type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="input-field mt-1"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
