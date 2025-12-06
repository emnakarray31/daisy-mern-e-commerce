import { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';

const categories = [
  'jeans',
  't-shirts',
  'shoes',
  'glasses',
  'jackets',
  'suits',
  'bags',
  'accessories',
];

const AdminProductsNew = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
   
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
   
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'jeans',
    image: '',
    images: [],
    totalStock: '',
    isFeatured: false,
  });
  
  const [imageInput, setImageInput] = useState('');
  const [imageInputMode, setImageInputMode] = useState('url');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/products');
      setProducts(response.data.products || response.data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === 'edit' && product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'jeans',
        image: product.image || '',
        images: product.images || [],
        totalStock: product.totalStock || '',
        isFeatured: product.isFeatured || false,
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'jeans',
        image: '',
        images: [],
        totalStock: '',
        isFeatured: false,
      });
    }
    setImageInput('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'jeans',
      image: '',
      images: [],
      totalStock: '',
      isFeatured: false,
    });
    setImageInput('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddImageUrl = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
        image: prev.image || imageInput.trim()
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || ''
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64String],
          image: prev.image || base64String
        }));
        toast.success('Image uploaded');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.totalStock) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    try {
      if (modalMode === 'create') {
        await axios.post('/products', formData);
        toast.success('Product created successfully');
      } else {
        await axios.put(`/products/${currentProduct._id}`, formData);
        toast.success('Product updated successfully');
      }
      
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
      console.error(error);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await axios.delete(`/products/${productToDelete._id}/delete`);
      toast.success('Product deleted successfully');
      fetchProducts();
      setShowDeleteDialog(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await axios.patch(`/products/${product._id}/toggle`);
      toast.success(`Product ${product.isFeatured ? 'unfeatured' : 'featured'}`);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product');
      console.error(error);
    }
  };

  
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <i className="fa fa-spinner fa-spin" style={{ fontSize: '48px', color: '#895129' }}></i>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px' }}>
 
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '32px',
          fontWeight: '700',
          color: '#111',
          fontFamily: 'Playfair Display, serif',
        }}>
          Products Management
        </h1>
        <button
          onClick={() => handleOpenModal('create')}
          style={{
            padding: '12px 24px',
            background: '#895129',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#6f3f1f'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#895129'}
        >
          <i className="fa fa-plus"></i>
          New Product
        </button>
      </div>
 
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e5e5',
        marginBottom: '30px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px',
              border: '1px solid #e5e5e5',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>
        <div style={{ minWidth: '200px' }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px',
              border: '1px solid #e5e5e5',
              borderRadius: '6px',
              fontSize: '14px',
              background: '#fff',
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px',
          color: '#666',
          fontWeight: '600',
        }}>
          {filteredProducts.length} products
        </div>
      </div>
 
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
      }}>
        {paginatedProducts.map((product) => (
          <div
            key={product._id}
            style={{
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(137, 81, 41, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          > 
            <div style={{
              position: 'relative',
              paddingTop: '100%',
              background: '#f9f9f9',
            }}>
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {product.isFeatured && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#ff9800',
                  color: '#fff',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <i className="fa fa-star" style={{ fontSize: '10px' }}></i> Featured
                </div>
              )}
            </div>
 
            <div style={{ padding: '15px' }}>
              <div style={{
                fontSize: '10px',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}>
                {product.category}
              </div>
              <h3 style={{
                margin: '0 0 10px 0',
                fontSize: '14px',
                fontWeight: '700',
                color: '#111',
                lineHeight: '1.3',
                minHeight: '36px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {product.name}
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '15px',
              }}>
                <p style={{
                  margin: '0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#895129',
                }}>
                  ${product.price?.toFixed(2)}
                </p>
                <div style={{
                  background: product.totalStock > 0 ? '#895129' : '#ef4444',
                  color: '#fff',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                }}>
                  Stock: {product.totalStock || 0}
                </div>
              </div>
 
              <div style={{
                display: 'flex',
                gap: '8px',
              }}>
                <button
                  onClick={() => handleOpenModal('edit', product)}
                  title="Edit"
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: 'transparent',
                    color: '#895129',
                    border: '1px solid #895129',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#895129';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#895129';
                  }}
                >
                  <i className="fa fa-edit"></i>
                </button>
                <button
                  onClick={() => handleToggleFeatured(product)}
                  title={product.isFeatured ? 'Unfeature' : 'Feature'}
                  style={{
                    padding: '8px 10px',
                    background: 'transparent',
                    color: product.isFeatured ? '#ff9800' : '#666',
                    border: `1px solid ${product.isFeatured ? '#ff9800' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (product.isFeatured) {
                      e.currentTarget.style.background = '#ff9800';
                      e.currentTarget.style.color = '#fff';
                    } else {
                      e.currentTarget.style.background = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = product.isFeatured ? '#ff9800' : '#666';
                  }}
                >
                  <i className={`fa fa-star${product.isFeatured ? '' : '-o'}`}></i>
                </button>
                <button
                  onClick={() => handleDeleteClick(product)}
                  title="Delete"
                  style={{
                    padding: '8px 10px',
                    background: 'transparent',
                    color: '#e53637',
                    border: '1px solid #e53637',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e53637';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#e53637';
                  }}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
 
      {filteredProducts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
        }}>
          <i className="fa fa-inbox" style={{
            fontSize: '64px',
            color: '#e5e5e5',
            marginBottom: '20px',
          }}></i>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#111',
          }}>
            No products found
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#6f6f6f',
          }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
 
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '30px',
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              background: currentPage === 1 ? '#f5f5f5' : '#fff',
              color: currentPage === 1 ? '#ccc' : '#111',
              border: '1px solid #e5e5e5',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <i className="fa fa-chevron-left"></i>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '10px 16px',
                background: currentPage === page ? '#895129' : '#fff',
                color: currentPage === page ? '#fff' : '#111',
                border: `1px solid ${currentPage === page ? '#895129' : '#e5e5e5'}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                minWidth: '44px',
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              background: currentPage === totalPages ? '#f5f5f5' : '#fff',
              color: currentPage === totalPages ? '#ccc' : '#111',
              border: '1px solid #e5e5e5',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      )}
 
      {showModal && (
        <>
          <div
            onClick={handleCloseModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: '12px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}> 
            <div style={{
              padding: '25px',
              borderBottom: '1px solid #e5e5e5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: '#fff',
              zIndex: 1,
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: '#111',
                fontFamily: 'Playfair Display, serif',
              }}>
                {modalMode === 'create' ? 'Create New Product' : 'Edit Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#999',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                  placeholder="Enter product name"
                />
              </div>
 
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                  placeholder="Enter product description"
                />
              </div>
 
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '15px',
                marginBottom: '20px',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#111',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Price * ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#111',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="totalStock"
                    value={formData.totalStock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#111',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '6px',
                      fontSize: '14px',
                      background: '#fff',
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
 
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111',
                  }}>
                    Mark as Featured Product
                  </span>
                </label>
              </div>
 
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Product Images *
                </label>
 
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '15px',
                }}>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    style={{
                      padding: '8px 16px',
                      background: imageInputMode === 'url' ? '#895129' : '#f5f5f5',
                      color: imageInputMode === 'url' ? '#fff' : '#111',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    <i className="fa fa-link"></i> URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    style={{
                      padding: '8px 16px',
                      background: imageInputMode === 'upload' ? '#895129' : '#f5f5f5',
                      color: imageInputMode === 'upload' ? '#fff' : '#111',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  >
                    <i className="fa fa-upload"></i> Upload
                  </button>
                </div>
 
                {imageInputMode === 'url' && (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input
                      type="url"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px 15px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      style={{
                        padding: '12px 20px',
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                    >
                      <i className="fa fa-plus"></i> Add
                    </button>
                  </div>
                )}
 
                {imageInputMode === 'upload' && (
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px dashed #e5e5e5',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    />
                    {uploadingImage && (
                      <div style={{
                        marginTop: '10px',
                        fontSize: '13px',
                        color: '#895129',
                      }}>
                        <i className="fa fa-spinner fa-spin"></i> Uploading...
                      </div>
                    )}
                  </div>
                )}
 
                {formData.images.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '10px',
                  }}>
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          paddingTop: '100%',
                          background: '#f9f9f9',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #e5e5e5',
                        }}
                      >
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            width: '24px',
                            height: '24px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                        {index === 0 && (
                          <div style={{
                            position: 'absolute',
                            bottom: '5px',
                            left: '5px',
                            background: '#895129',
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600',
                          }}>
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {formData.images.length === 0 && (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    border: '2px dashed #e5e5e5',
                  }}>
                    <i className="fa fa-image" style={{
                      fontSize: '48px',
                      color: '#e5e5e5',
                      marginBottom: '10px',
                    }}></i>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: '#999',
                    }}>
                      No images added yet
                    </p>
                  </div>
                )}
              </div>
 
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                paddingTop: '20px',
                borderTop: '1px solid #e5e5e5',
              }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '12px 24px',
                    background: '#f5f5f5',
                    color: '#111',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: '#895129',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#6f3f1f'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#895129'}
                >
                  {modalMode === 'create' ? 'Create Product' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
 
      {showDeleteDialog && (
        <>
          <div
            onClick={() => setShowDeleteDialog(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            zIndex: 1000,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            padding: '30px',
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <i className="fa fa-trash" style={{ fontSize: '24px', color: '#ef4444' }}></i>
            </div>
            <h3 style={{
              margin: '0 0 10px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#111',
              textAlign: 'center',
            }}>
              Delete Product?
            </h3>
            <p style={{
              margin: '0 0 25px 0',
              fontSize: '14px',
              color: '#6f6f6f',
              textAlign: 'center',
              lineHeight: '1.6',
            }}>
              Are you sure you want to delete "<strong>{productToDelete?.name}</strong>"? This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
            }}>
              <button
                onClick={() => setShowDeleteDialog(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f5f5f5',
                  color: '#111',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProductsNew;