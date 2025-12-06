import { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await axios.get('/orders/admin/all', { params });
      setOrders(response.data.orders || response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await axios.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      toast.error('Failed to load order details');
      console.error(error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await axios.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'fa-clock-o',
      processing: 'fa-cog',
      shipped: 'fa-truck',
      delivered: 'fa-check-circle',
      cancelled: 'fa-times-circle',
    };
    return icons[status] || 'fa-box';
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    return matchesSearch;
  });

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
          Orders Management
        </h1>
        <div style={{
          padding: '12px 24px',
          background: '#f0f0f0',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#111',
        }}>
          Total Orders: {orders.length}
        </div>
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
            placeholder="Search by order number, name, email..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px',
              border: '1px solid #e5e5e5',
              borderRadius: '6px',
              fontSize: '14px',
              background: '#fff',
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
 
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e5e5e5',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{ background: '#f9f9f9' }}>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #e5e5e5',
                }}>
                  Order #
                </th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #e5e5e5',
                }}>
                  Customer
                </th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #e5e5e5',
                }}>
                  Date
                </th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #e5e5e5',
                }}>
                  Total
                </th>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #e5e5e5',
                }}>
                  Status
                </th>
                <th style={{
                  padding: '15px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #e5e5e5',
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <td style={{
                    padding: '15px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#895129',
                  }}>
                    #{order.orderNumber || order._id.slice(-8)}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111',
                      marginBottom: '3px',
                    }}>
                      {order.user?.name || 'N/A'}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6f6f6f',
                    }}>
                      {order.user?.email || 'N/A'}
                    </div>
                  </td>
                  <td style={{
                    padding: '15px',
                    fontSize: '14px',
                    color: '#111',
                  }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{
                    padding: '15px',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111',
                  }}>
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status),
                      textTransform: 'capitalize',
                    }}>
                      <i className={`fa ${getStatusIcon(order.status)}`}></i>
                      {order.status}
                    </span>
                  </td>
                  <td style={{
                    padding: '15px',
                    textAlign: 'center',
                  }}>
                    <button
                      onClick={() => handleViewDetails(order._id)}
                      style={{
                        padding: '8px 16px',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                    >
                      <i className="fa fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        {filteredOrders.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
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
              No orders found
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
      </div>
 
      {showDetailsModal && selectedOrder && (
        <>
          <div
            onClick={() => setShowDetailsModal(false)}
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
            maxWidth: '800px',
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
              <div>
                <h2 style={{
                  margin: '0 0 5px 0',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#111',
                  fontFamily: 'Playfair Display, serif',
                }}>
                  Order Details
                </h2>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#6f6f6f',
                }}>
                  Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-8)}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
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
 
            <div style={{ padding: '25px' }}> 
              <div style={{
                background: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '25px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px',
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#111',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      Order Status
                    </label>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      background: `${getStatusColor(selectedOrder.status)}20`,
                      color: getStatusColor(selectedOrder.status),
                      textTransform: 'capitalize',
                    }}>
                      <i className={`fa ${getStatusIcon(selectedOrder.status)}`}></i>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#111',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      Update Status
                    </label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                      disabled={updatingStatus}
                      style={{
                        padding: '8px 15px',
                        border: '1px solid #e5e5e5',
                        borderRadius: '6px',
                        fontSize: '14px',
                        background: '#fff',
                        cursor: updatingStatus ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
 
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Customer Information
                </h3>
                <div style={{
                  background: '#f9f9f9',
                  padding: '20px',
                  borderRadius: '8px',
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6f6f6f',
                    }}>
                      Name:
                    </span>{' '}
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111',
                    }}>
                      {selectedOrder.user?.name || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6f6f6f',
                    }}>
                      Email:
                    </span>{' '}
                    <span style={{
                      fontSize: '14px',
                      color: '#111',
                    }}>
                      {selectedOrder.user?.email || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
 
              {selectedOrder.shippingAddress && (
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{
                    margin: '0 0 15px 0',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Shipping Address
                  </h3>
                  <div style={{
                    background: '#f9f9f9',
                    padding: '20px',
                    borderRadius: '8px',
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#111',
                      lineHeight: '1.8',
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                        {selectedOrder.shippingAddress.fullName}
                      </div>
                      <div>{selectedOrder.shippingAddress.address}</div>
                      <div>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                      </div>
                      <div>{selectedOrder.shippingAddress.country}</div>
                      {selectedOrder.shippingAddress.phone && (
                        <div style={{ marginTop: '8px' }}>
                          <span style={{ color: '#6f6f6f' }}>Phone:</span> {selectedOrder.shippingAddress.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
 
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Products ({selectedOrder.products?.length || 0})
                </h3>
                <div style={{
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}>
                  {selectedOrder.products?.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        gap: '15px',
                        padding: '15px',
                        borderBottom: index < selectedOrder.products.length - 1 ? '1px solid #f0f0f0' : 'none',
                        background: '#fff',
                      }}
                    >
                      <img
                        src={item.product?.image || '/placeholder.jpg'}
                        alt={item.product?.name || 'Product'}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e5e5e5',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#111',
                          marginBottom: '5px',
                        }}>
                          {item.product?.name || 'Product name not available'}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6f6f6f',
                          marginBottom: '5px',
                        }}>
                          Quantity: {item.quantity}
                        </div>
                        {(item.size || item.color) && (
                          <div style={{
                            fontSize: '13px',
                            color: '#6f6f6f',
                          }}>
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' • '}
                            {item.color && `Color: ${item.color}`}
                          </div>
                        )}
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#895129',
                      }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
 
              <div style={{
                background: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Order Summary
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    color: '#111',
                  }}>
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '14px',
                      color: '#10b981',
                    }}>
                      <span>Discount:</span>
                      <span>-${selectedOrder.discount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    color: '#111',
                  }}>
                    <span>Shipping:</span>
                    <span>${selectedOrder.shippingCost?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div style={{
                    borderTop: '2px solid #e5e5e5',
                    paddingTop: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111',
                  }}>
                    <span>Total:</span>
                    <span style={{ color: '#895129' }}>
                      ${selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
 
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#6f6f6f',
              }}>
                <div style={{ marginBottom: '5px' }}>
                  <strong style={{ color: '#111' }}>Payment Status:</strong>{' '}
                  <span style={{
                    color: selectedOrder.paymentStatus === 'paid' ? '#10b981' : '#f59e0b',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                    {selectedOrder.paymentStatus || 'pending'}
                  </span>
                </div>
                <div>
                  <strong style={{ color: '#111' }}>Payment Method:</strong>{' '}
                  {selectedOrder.paymentMethod || 'card'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;