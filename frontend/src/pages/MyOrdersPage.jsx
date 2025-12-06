import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#6f6f6f20', color: '#6f6f6f', text: 'Pending' },
      processing: { bg: '#f59e0b20', color: '#f59e0b', text: 'Processing' },
      shipped: { bg: '#3b82f620', color: '#3b82f6', text: 'Shipped' },
      delivered: { bg: '#10b98120', color: '#10b981', text: 'Delivered' },
      cancelled: { bg: '#ef444420', color: '#ef4444', text: 'Cancelled' },
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'fa-clock-o',
      processing: 'fa-cog',
      shipped: 'fa-truck',
      delivered: 'fa-check-circle',
      cancelled: 'fa-times-circle',
    };
    return icons[status] || 'fa-clock-o';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <i className="fa fa-spinner fa-spin" style={{ fontSize: '48px', color: '#e53637' }}></i>
      </div>
    );
  }

  return (
    <>
       <div style={{
        background: '#f9f9f9',
        padding: '40px 0',
        borderBottom: '1px solid #e5e5e5',
      }}>
        <div className="container">
          <h1 style={{
            margin: '0 0 10px 0',
            fontSize: '36px',
            fontWeight: '700',
            color: '#111',
            fontFamily: 'Playfair Display, serif',
          }}>
            My Orders
          </h1>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#6f6f6f',
          }}>
            Track and manage your orders
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 0' }}>
        {orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
          }}>
            <i className="fa fa-shopping-bag" style={{
              fontSize: '80px',
              color: '#e5e5e5',
              marginBottom: '20px',
            }}></i>
            <h3 style={{
              margin: '0 0 10px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#111',
            }}>
              No orders yet
            </h3>
            <p style={{
              margin: '0 0 30px 0',
              fontSize: '14px',
              color: '#6f6f6f',
            }}>
              Start shopping to place your first order!
            </p>
            <Link
              to="/category/all"
              style={{
                display: 'inline-block',
                padding: '12px 30px',
                background: '#e53637',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderRadius: '4px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#895129'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#e53637'}
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '20px',
          }}>
            {orders.map((order) => {
              const statusInfo = getStatusColor(order.status);
              return (
                <div
                  key={order._id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                   <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #f5f5f5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '15px',
                  }}>
                    <div>
                      <h3 style={{
                        margin: '0 0 5px 0',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#895129',
                      }}>
                        Order #{order.orderNumber}
                      </h3>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#999',
                      }}>
                        Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      background: statusInfo.bg,
                      color: statusInfo.color,
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}>
                      <i className={`fa ${getStatusIcon(order.status)}`}></i>
                      {statusInfo.text}
                    </div>
                  </div>

                   <div style={{ padding: '20px' }}>
                     <div style={{
                      display: 'flex',
                      gap: '15px',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                    }}>
                      {order.products.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: '60px',
                            height: '60px',
                            border: '1px solid #e5e5e5',
                            borderRadius: '8px',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={item.product?.image || item.image || '/placeholder.jpg'}
                            alt={item.product?.name || item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      ))}
                      {order.products.length > 3 && (
                        <div style={{
                          width: '60px',
                          height: '60px',
                          border: '1px solid #e5e5e5',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f9f9f9',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#6f6f6f',
                        }}>
                          +{order.products.length - 3}
                        </div>
                      )}
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '15px',
                      marginBottom: '20px',
                    }}>
                      <div>
                        <p style={{
                          margin: '0 0 5px 0',
                          fontSize: '12px',
                          color: '#999',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}>
                          Items
                        </p>
                        <p style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#111',
                        }}>
                          {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      <div>
                        <p style={{
                          margin: '0 0 5px 0',
                          fontSize: '12px',
                          color: '#999',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}>
                          Total
                        </p>
                        <p style={{
                          margin: 0,
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#e53637',
                        }}>
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p style={{
                          margin: '0 0 5px 0',
                          fontSize: '12px',
                          color: '#999',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}>
                          Payment
                        </p>
                        <p style={{
                          margin: 0,
                          fontSize: '14px',
                          fontWeight: '600',
                          color: order.paymentStatus === 'paid' ? '#10b981' : '#6f6f6f',
                        }}>
                          <i className={`fa ${order.paymentStatus === 'paid' ? 'fa-check-circle' : 'fa-clock-o'}`}></i>
                          {' '}{order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </p>
                      </div>
                    </div>

                     <div style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}>
                      <button
                        onClick={() => viewOrderDetails(order)}
                        style={{
                          padding: '10px 20px',
                          background: '#895129',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#6f3f1f'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#895129'}
                      >
                        <i className="fa fa-eye"></i> View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button
                          style={{
                            padding: '10px 20px',
                            background: '#f5f5f5',
                            color: '#111',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
                        >
                          <i className="fa fa-repeat"></i> Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

       {showModal && selectedOrder && (
        <>
          <div
            onClick={() => setShowModal(false)}
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
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}>
            
            <div style={{
              padding: '25px',
              borderBottom: '1px solid #e5e5e5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: '#111',
                fontFamily: 'Playfair Display, serif',
              }}>
                Order #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowModal(false)}
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
                padding: '15px',
                background: '#f9f9f9',
                borderRadius: '8px',
                marginBottom: '25px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}>
                  <span style={{
                    fontSize: '13px',
                    color: '#999',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Status
                  </span>
                  <span style={{
                    ...getStatusColor(selectedOrder.status),
                    padding: '6px 12px',
                    background: getStatusColor(selectedOrder.status).bg,
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {getStatusColor(selectedOrder.status).text}
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#6f6f6f',
                }}>
                  Order placed on {format(new Date(selectedOrder.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>

              <h3 style={{
                margin: '0 0 15px 0',
                fontSize: '16px',
                fontWeight: '700',
                color: '#111',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Items ({selectedOrder.products.length})
              </h3>
              <div style={{ marginBottom: '25px' }}>
                {selectedOrder.products.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      padding: '15px 0',
                      borderBottom: idx < selectedOrder.products.length - 1 ? '1px solid #f5f5f5' : 'none',
                    }}
                  >
                    <img
                      src={item.product?.image || item.image || '/placeholder.jpg'}
                      alt={item.product?.name || item.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e5e5e5',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        margin: '0 0 5px 0',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#111',
                      }}>
                        {item.product?.name || item.name || 'Product'}
                      </h4>
                      <p style={{
                        margin: '0 0 5px 0',
                        fontSize: '12px',
                        color: '#999',
                      }}>
                        Quantity: {item.quantity}
                        {item.selectedSize && ` • Size: ${item.selectedSize}`}
                      </p>
                      <p style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#e53637',
                      }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '25px',
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
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  fontSize: '14px',
                }}>
                  <span style={{ color: '#6f6f6f' }}>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>${selectedOrder.subtotal?.toFixed(2) || selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    fontSize: '14px',
                  }}>
                    <span style={{ color: '#10b981' }}>Discount</span>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #e5e5e5',
                  fontSize: '14px',
                }}>
                  <span style={{ color: '#6f6f6f' }}>Shipping</span>
                  <span style={{ fontWeight: '600' }}>${selectedOrder.shippingCost?.toFixed(2) || '0.00'}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                }}>
                  <span style={{ fontWeight: '700', color: '#111' }}>Total</span>
                  <span style={{ fontWeight: '700', color: '#e53637' }}>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Shipping Address
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#6f6f6f',
                    lineHeight: '1.6',
                  }}>
                    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}<br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyOrdersPage;