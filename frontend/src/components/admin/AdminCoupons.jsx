import { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    discountValue: '',
    minimumPurchase: '',
    maxDiscount: '',
    expirationDate: '',
    maxUses: '',
    isPublic: true,
    onePerUser: false,
    description: '',
  });

  const types = ['all', 'percentage', 'fixed', 'freeShipping'];

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/coupons/admin/all');
      setCoupons(res.data.coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, coupon = null) => {
    setModalMode(mode);
    if (mode === 'edit' && coupon) {
      setCurrentCoupon(coupon); 
      const formattedDate = coupon.expirationDate
        ? new Date(coupon.expirationDate).toISOString().split('T')[0]
        : '';
      setFormData({
        code: coupon.code || '',
        type: coupon.type || 'percentage',
        discountValue: coupon.discountValue || '',
        minimumPurchase: coupon.minimumPurchase || '',
        maxDiscount: coupon.maxDiscount || '',
        expirationDate: formattedDate,
        maxUses: coupon.maxUses || '',
        isPublic: coupon.isPublic !== undefined ? coupon.isPublic : true,
        onePerUser: coupon.onePerUser || false,
        description: coupon.description || '',
      });
    } else {
      setCurrentCoupon(null);
      setFormData({
        code: '',
        type: 'percentage',
        discountValue: '',
        minimumPurchase: '',
        maxDiscount: '',
        expirationDate: '',
        maxUses: '',
        isPublic: true,
        onePerUser: false,
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCoupon(null);
    setFormData({
      code: '',
      type: 'percentage',
      discountValue: '',
      minimumPurchase: '',
      maxDiscount: '',
      expirationDate: '',
      maxUses: '',
      isPublic: true,
      onePerUser: false,
      description: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await axios.post('/coupons/admin/create', formData);
        toast.success('Coupon created successfully');
      } else {
        await axios.put(`/coupons/admin/${currentCoupon._id}`, formData);
        toast.success('Coupon updated successfully');
      }
      fetchCoupons();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`/coupons/admin/${id}/toggle`);
      toast.success('Coupon status updated!');
      fetchCoupons();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;

    try {
      await axios.delete(`/coupons/admin/${couponToDelete._id}`);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
      setShowDeleteDialog(false);
      setCouponToDelete(null);
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = (coupon.code?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || coupon.type === typeFilter;
    return matchesSearch && matchesType;
  });
 
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + itemsPerPage);
 
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  const getTypeLabel = (type) => {
    return type === 'percentage' ? 'Percentage' : 
           type === 'fixed' ? 'Fixed Amount' : 
           'Free Shipping';
  };

  const getTypeColor = (type) => {
    return type === 'percentage' ? '#895129' : 
           type === 'fixed' ? '#e53637' : 
           '#10b981';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <i className="fa fa-spinner fa-spin" style={{ fontSize: '48px', color: '#e53637' }}></i>
        <h3 style={{ marginTop: '20px' }}>Loading Coupons...</h3>
      </div>
    );
  }

  return (
    <div> 
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
      }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111',
            marginBottom: '5px',
            fontFamily: 'Playfair Display, serif',
          }}>
            Coupons Management
          </h2>
          <p style={{ color: '#6f6f6f', fontSize: '14px', margin: 0 }}>
            {filteredCoupons.length} coupon{filteredCoupons.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={() => handleOpenModal('create')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: '#e53637',
            color: '#fff',
            padding: '12px 25px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '700',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#ca2829'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#e53637'}
        >
          <i className="fa fa-plus"></i>
          Create Coupon
        </button>
      </div>
 
      <div style={{
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
        }}> 
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              color: '#6f6f6f',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
            }}>
              Search Code
            </label>
            <input
              type="text"
              placeholder="Enter coupon code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #e5e5e5',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
 
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              color: '#6f6f6f',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
            }}>
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #e5e5e5',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
                background: '#fff',
              }}
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="freeShipping">Free Shipping</option>
            </select>
          </div>
        </div>
      </div>
 
      {filteredCoupons.length === 0 ? (
        <div style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '60px 20px',
          textAlign: 'center',
        }}>
          <i className="fa fa-ticket" style={{ fontSize: '64px', color: '#e5e5e5', marginBottom: '20px' }}></i>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#111',
          }}>
            No coupons found
          </h3>
          <p style={{
            margin: '0 0 25px 0',
            fontSize: '14px',
            color: '#6f6f6f',
          }}>
            Try adjusting your search or create a new coupon
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {paginatedCoupons.map((coupon) => {
            const isExpired = new Date(coupon.expirationDate) < new Date();
            const typeColor = getTypeColor(coupon.type);

            return (
              <div
                key={coupon._id}
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
                  background: `linear-gradient(135deg, ${typeColor}15 0%, ${typeColor}05 100%)`,
                  padding: '20px',
                  borderBottom: '1px solid #e5e5e5',
                  position: 'relative',
                }}> 
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: typeColor,
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {getTypeLabel(coupon.type)}
                  </div>
 
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#111',
                    fontFamily: 'Courier New, monospace',
                    letterSpacing: '2px',
                    marginBottom: '8px',
                    wordBreak: 'break-all',
                  }}>
                    {coupon.code}
                  </div>
 
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: typeColor,
                  }}>
                    {coupon.type === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : coupon.type === 'fixed'
                      ? `$${coupon.discountValue} OFF`
                      : 'FREE SHIPPING'}
                  </div>
                </div>
 
                <div style={{ padding: '15px' }}> 
                  {coupon.description && (
                    <p style={{
                      fontSize: '12px',
                      color: '#6f6f6f',
                      marginBottom: '12px',
                      lineHeight: '1.5',
                      minHeight: '36px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {coupon.description}
                    </p>
                  )}
 
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      fontSize: '11px',
                      color: '#999',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      <div style={{ marginBottom: '4px' }}>Usage</div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#111',
                      }}>
                        {coupon.usedCount}/{coupon.maxUses || '∞'}
                      </div>
                    </div>
                    {coupon.minimumPurchase > 0 && (
                      <div style={{
                        fontSize: '11px',
                        color: '#999',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        <div style={{ marginBottom: '4px' }}>Min Purchase</div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#111',
                        }}>
                          ${coupon.minimumPurchase}
                        </div>
                      </div>
                    )}
                  </div>
 
                  <div style={{
                    fontSize: '11px',
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}>
                    <div style={{ marginBottom: '4px' }}>Expires</div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: isExpired ? '#ef4444' : '#111',
                    }}>
                      {format(new Date(coupon.expirationDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
 
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '15px',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontWeight: '700',
                      borderRadius: '4px',
                      background: coupon.isActive ? '#89512920' : '#ef444420',
                      color: coupon.isActive ? '#895129' : '#ef4444',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {coupon.isPublic && (
                      <span style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        fontWeight: '700',
                        borderRadius: '4px',
                        background: '#3b82f620',
                        color: '#3b82f6',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        Public
                      </span>
                    )}
                    {coupon.onePerUser && (
                      <span style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        fontWeight: '700',
                        borderRadius: '4px',
                        background: '#f59e0b20',
                        color: '#f59e0b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        One/User
                      </span>
                    )}
                    {isExpired && (
                      <span style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        fontWeight: '700',
                        borderRadius: '4px',
                        background: '#ef444420',
                        color: '#ef4444',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        Expired
                      </span>
                    )}
                  </div> 
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenModal('edit', coupon)}
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
                      onClick={() => handleToggleStatus(coupon._id)}
                      title={coupon.isActive ? 'Deactivate' : 'Activate'}
                      style={{
                        padding: '8px 10px',
                        background: 'transparent',
                        color: coupon.isActive ? '#f59e0b' : '#10b981',
                        border: `1px solid ${coupon.isActive ? '#f59e0b' : '#10b981'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = coupon.isActive ? '#f59e0b' : '#10b981';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = coupon.isActive ? '#f59e0b' : '#10b981';
                      }}
                    >
                      <i className={`fa ${coupon.isActive ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.code);
                        toast.success('Code copied!');
                      }}
                      title="Copy Code"
                      style={{
                        padding: '8px 10px',
                        background: 'transparent',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#3b82f6';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#3b82f6';
                      }}
                    >
                      <i className="fa fa-copy"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(coupon)}
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
            );
          })}
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
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          > 
            <div style={{
              padding: '25px',
              borderBottom: '1px solid #e5e5e5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#111',
                margin: 0,
                fontFamily: 'Playfair Display, serif',
              }}>
                {modalMode === 'create' ? 'Create New Coupon' : 'Edit Coupon'}
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#999',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
 
            <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6f6f6f',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}>
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#6f6f6f',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}>
                    Type *
                  </label>
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="freeShipping">Free Shipping</option>
                  </select>
                </div>

                {formData.type !== 'freeShipping' && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#6f6f6f',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '8px',
                    }}>
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      name="discountValue"
                      required
                      value={formData.discountValue}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#6f6f6f',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}>
                    Min Purchase
                  </label>
                  <input
                    type="number"
                    name="minimumPurchase"
                    value={formData.minimumPurchase}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#6f6f6f',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}>
                    Max Uses
                  </label>
                  <input
                    type="number"
                    name="maxUses"
                    value={formData.maxUses}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6f6f6f',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}>
                  Expiration Date *
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  required
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6f6f6f',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginBottom: '10px',
                  color: '#111',
                }}>
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                  />
                  Public Coupon
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#111',
                }}>
                  <input
                    type="checkbox"
                    name="onePerUser"
                    checked={formData.onePerUser}
                    onChange={handleInputChange}
                  />
                  One Per User
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#f5f5f5',
                    color: '#111',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#e53637',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {modalMode === 'create' ? 'Create Coupon' : 'Update Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
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
              Delete Coupon?
            </h3>
            <p style={{
              margin: '0 0 25px 0',
              fontSize: '14px',
              color: '#6f6f6f',
              textAlign: 'center',
              lineHeight: '1.6',
            }}>
              Are you sure you want to delete "<strong>{couponToDelete?.code}</strong>"? This action cannot be undone.
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

export default AdminCoupons;