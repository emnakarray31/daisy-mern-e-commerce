import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Person,
  Shield,
  ShoppingBag,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';

// StatCard Component (same as AdminDashboard)
const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;
  return (
    <Card sx={{ 
      height: '100%', 
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`, 
      border: `1px solid ${color}20`, 
      borderRadius: '16px', 
      transition: 'all 0.3s', 
      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 24px ${color}20` } 
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 50, height: 50 }}>
            <Icon sx={{ fontSize: 26 }} />
          </Avatar>
          <Chip
            icon={isPositive ? <ArrowUpward /> : <ArrowDownward />}
            label={`${Math.abs(change)}%`}
            size="small"
            color={isPositive ? 'success' : 'error'}
            sx={{ fontWeight: 600, fontSize: '11px' }}
          />
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ fontSize: '28px', mb: 0.5 }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ fontSize: '13px', mb: 0.5 }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '11px' }}>
          {isPositive ? '+' : ''}{change}% from last month
        </Typography>
      </CardContent>
    </Card>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/users/admin/all');
      setUsers(response.data.users || response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    if (mode === 'edit' && user) {
      setSelectedUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'customer',
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
      });
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    if (modalMode === 'create' && !formData.password) {
      toast.error('Password is required for new users');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      if (modalMode === 'create') {
        await axios.post('/users/admin/create', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        toast.success('User created successfully');
      } else {
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await axios.put(`/users/admin/${selectedUser._id}`, updateData);
        toast.success('User updated successfully');
      }
      
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save user');
      console.error(error);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`/users/admin/${userToDelete._id}`);
      toast.success('User deleted successfully');
      fetchUsers();
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
      console.error(error);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    try {
      await axios.patch(`/users/admin/${user._id}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
      console.error(error);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(parseInt(value, 10));
    setPage(0);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.role === 'customer').length,
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #895129',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
      </div>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header with Gradient Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '5px',
            height: '56px',
            background: 'linear-gradient(180deg, #895129 0%, #e53637 100%)',
            borderRadius: '10px',
          }} />
          <div>
            <h1 style={{
              margin: '0 0 5px 0',
              fontSize: '36px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #895129 0%, #e53637 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Playfair Display', serif",
            }}>
              Users Management
            </h1>
            <p style={{
              margin: 0,
              fontSize: '15px',
              color: '#6f6f6f',
              fontFamily: "'Inter', sans-serif",
            }}>
              Manage all users and their permissions
            </p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal('create')}
          style={{
            padding: '15px 32px',
            background: '#895129',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(137, 81, 41, 0.25)',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#6f3f1f';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(137, 81, 41, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#895129';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(137, 81, 41, 0.25)';
          }}
        >
          <i className="fa fa-plus-circle"></i>
          Add New User
        </button>
      </div>

      {/* Stats Cards (Material-UI like AdminDashboard) */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard 
            title="Total Users" 
            value={stats.total} 
            change={12.5} 
            icon={Person} 
            color="#895129" 
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard 
            title="Administrators" 
            value={stats.admins} 
            change={5.3} 
            icon={Shield} 
            color="#e53637" 
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard 
            title="Customers" 
            value={stats.customers} 
            change={18.2} 
            icon={ShoppingBag} 
            color="#111" 
          />
        </Grid>
      </Grid>

      {/* Modern Filters Card */}
      <div style={{
        background: '#fff',
        padding: '25px',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        marginBottom: '30px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '20px',
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative' }}>
            <i className="fa fa-search" style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#895129',
              fontSize: '16px',
            }}></i>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px 14px 50px',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                fontSize: '14px',
                transition: 'all 0.3s',
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#895129';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(137, 81, 41, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#f0f0f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '14px 45px 14px 18px',
              border: '2px solid #f0f0f0',
              borderRadius: '12px',
              fontSize: '14px',
              background: '#fff',
              cursor: 'pointer',
              fontWeight: '600',
              color: '#111',
              minWidth: '200px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="customer">Customers</option>
          </select>
        </div>
      </div>

      {/* Modern Table Card */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={{
                padding: '20px 25px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#6f6f6f',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Inter', sans-serif",
              }}>
                User
              </th>
              <th style={{
                padding: '20px 25px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '700',
                color: '#6f6f6f',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Inter', sans-serif",
              }}>
                Role
              </th>
              <th style={{
                padding: '20px 25px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: '#6f6f6f',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Inter', sans-serif",
              }}>
                Orders
              </th>
              <th style={{
                padding: '20px 25px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: '#6f6f6f',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Inter', sans-serif",
              }}>
                Cart
              </th>
              <th style={{
                padding: '20px 25px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: '#6f6f6f',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Inter', sans-serif",
              }}>
                Wishlist
              </th>
              <th style={{
                padding: '20px 25px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: '#6f6f6f',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Inter', sans-serif",
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user._id}
                style={{
                  borderBottom: '1px solid #f5f5f5',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <td style={{ padding: '20px 25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '12px',
                      background: user.role === 'admin' 
                        ? 'linear-gradient(135deg, #895129 0%, #6f3f1f 100%)'
                        : 'linear-gradient(135deg, #111 0%, #333 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      flexShrink: 0,
                      fontFamily: "'Playfair Display', serif",
                    }}>
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#111',
                        marginBottom: '3px',
                        fontFamily: "'Inter', sans-serif",
                      }}>
                        {user.name}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#6f6f6f',
                        fontFamily: "'Inter', sans-serif",
                      }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 25px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: user.role === 'admin' ? '#89512915' : '#f5f5f5',
                    color: user.role === 'admin' ? '#895129' : '#111',
                    border: `1px solid ${user.role === 'admin' ? '#89512940' : '#e5e5e5'}`,
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    <i className={`fa fa-${user.role === 'admin' ? 'shield' : 'user'}`}></i>
                    {user.role === 'admin' ? 'Admin' : 'Customer'}
                  </span>
                </td>
                <td style={{ padding: '20px 25px', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#10b98115',
                    color: '#15803d',
                    fontSize: '14px',
                    fontWeight: '700',
                  }}>
                    {user.orders?.length || 0}
                  </span>
                </td>
                <td style={{ padding: '20px 25px', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#3b82f615',
                    color: '#1e40af',
                    fontSize: '14px',
                    fontWeight: '700',
                  }}>
                    {user.cartItems?.length || 0}
                  </span>
                </td>
                <td style={{ padding: '20px 25px', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#e5363715',
                    color: '#991b1b',
                    fontSize: '14px',
                    fontWeight: '700',
                  }}>
                    {user.wishlist?.length || 0}
                  </span>
                </td>
                <td style={{ padding: '20px 25px' }}>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <button
                      onClick={() => handleOpenModal('edit', user)}
                      title="Edit user"
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#89512915',
                        color: '#895129',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#895129';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#89512915';
                        e.currentTarget.style.color = '#895129';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleToggleRole(user)}
                      title={`Make ${user.role === 'admin' ? 'Customer' : 'Admin'}`}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#f5f5f5',
                        color: '#111',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#111';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f5f5f5';
                        e.currentTarget.style.color = '#111';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <i className={`fa fa-${user.role === 'admin' ? 'user' : 'shield'}`}></i>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      title="Delete user"
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#e5363715',
                        color: '#e53637',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e53637';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#e5363715';
                        e.currentTarget.style.color = '#e53637';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <i className="fa fa-users" style={{
                fontSize: '40px',
                color: '#999',
              }}></i>
            </div>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '22px',
              fontWeight: '700',
              color: '#111',
              fontFamily: "'Playfair Display', serif",
            }}>
              No users found
            </h3>
            <p style={{
              margin: 0,
              fontSize: '15px',
              color: '#6f6f6f',
              fontFamily: "'Inter', sans-serif",
            }}>
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 25px',
            borderTop: '1px solid #f0f0f0',
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6f6f6f',
              fontFamily: "'Inter', sans-serif",
            }}>
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  background: page === 0 ? '#f5f5f5' : '#fff',
                  color: page === 0 ? '#ccc' : '#111',
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
              >
                <i className="fa fa-chevron-left"></i>
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handleChangePage(pageNum)}
                  style={{
                    padding: '10px 14px',
                    border: `1px solid ${page === pageNum ? '#895129' : '#e5e5e5'}`,
                    borderRadius: '8px',
                    background: page === pageNum ? '#895129' : '#fff',
                    color: page === pageNum ? '#fff' : '#111',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    minWidth: '42px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (page !== pageNum) {
                      e.currentTarget.style.borderColor = '#895129';
                      e.currentTarget.style.color = '#895129';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (page !== pageNum) {
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.color = '#111';
                    }
                  }}
                >
                  {pageNum + 1}
                </button>
              ))}
              
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  background: page >= totalPages - 1 ? '#f5f5f5' : '#fff',
                  color: page >= totalPages - 1 ? '#ccc' : '#111',
                  cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
              >
                <i className="fa fa-chevron-right"></i>
              </button>

              <select
                value={rowsPerPage}
                onChange={(e) => handleChangeRowsPerPage(e.target.value)}
                style={{
                  padding: '10px 32px 10px 12px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  background: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  marginLeft: '10px',
                }}
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal - Keeping your existing modal code */}
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
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 999,
              backdropFilter: 'blur(4px)',
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '30px 30px 20px',
              borderBottom: '1px solid #f0f0f0',
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
                  {modalMode === 'create' ? 'Add New User' : 'Edit User'}
                </h2>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#6f6f6f',
                }}>
                  {modalMode === 'create' ? 'Create a new user account' : 'Update user information'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  background: '#f5f5f5',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  color: '#6f6f6f',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e5e5';
                  e.currentTarget.style.color = '#111';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.color = '#6f6f6f';
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
              {/* Name */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111',
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #f0f0f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    transition: 'all 0.3s',
                  }}
                  placeholder="John Doe"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#895129';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(137, 81, 41, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111',
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #f0f0f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    transition: 'all 0.3s',
                  }}
                  placeholder="john@example.com"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#895129';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(137, 81, 41, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111',
                }}>
                  Password {modalMode === 'edit' && '(leave blank to keep current)'}
                  {modalMode === 'create' && ' *'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={modalMode === 'create'}
                    style={{
                      width: '100%',
                      padding: '12px 50px 12px 16px',
                      border: '2px solid #f0f0f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      transition: 'all 0.3s',
                    }}
                    placeholder={modalMode === 'create' ? 'Enter password' : 'Leave blank to keep current'}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#895129';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(137, 81, 41, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#f0f0f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#6f6f6f',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '5px',
                    }}
                  >
                    <i className={`fa fa-eye${showPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {(modalMode === 'create' || formData.password) && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111',
                  }}>
                    Confirm Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required={modalMode === 'create' || formData.password}
                      style={{
                        width: '100%',
                        padding: '12px 50px 12px 16px',
                        border: '2px solid #f0f0f0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        transition: 'all 0.3s',
                      }}
                      placeholder="Confirm your password"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#895129';
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(137, 81, 41, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#f0f0f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#6f6f6f',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '5px',
                      }}
                    >
                      <i className={`fa fa-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p style={{
                      margin: '8px 0 0 0',
                      fontSize: '12px',
                      color: '#ef4444',
                      fontWeight: '500',
                    }}>
                      <i className="fa fa-exclamation-circle"></i> Passwords do not match
                    </p>
                  )}
                </div>
              )}

              {/* Role */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111',
                }}>
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #f0f0f0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#895129';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(137, 81, 41, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#f0f0f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '24px',
                borderTop: '1px solid #f0f0f0',
              }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#f5f5f5',
                    color: '#111',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e5e5e5';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#895129',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(137, 81, 41, 0.25)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6f3f1f';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(137, 81, 41, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#895129';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(137, 81, 41, 0.25)';
                  }}
                >
                  {modalMode === 'create' ? 'Create User' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Delete Dialog */}
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
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 999,
              backdropFilter: 'blur(4px)',
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: '16px',
            maxWidth: '440px',
            width: '90%',
            zIndex: 1000,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '30px',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <i className="fa fa-trash" style={{ fontSize: '28px', color: '#dc2626' }}></i>
            </div>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '22px',
              fontWeight: '700',
              color: '#111',
              textAlign: 'center',
              fontFamily: "'Playfair Display', serif",
            }}>
              Delete User?
            </h3>
            <p style={{
              margin: '0 0 28px 0',
              fontSize: '15px',
              color: '#6f6f6f',
              textAlign: 'center',
              lineHeight: '1.6',
              fontFamily: "'Inter', sans-serif",
            }}>
              Are you sure you want to delete <strong style={{ color: '#111' }}>"{userToDelete?.name}"</strong>? This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
            }}>
              <button
                onClick={() => setShowDeleteDialog(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f5f5f5',
                  color: '#111',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e5e5';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.25)',
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.25)';
                }}
              >
                Delete User
              </button>
            </div>
          </div>
        </>
      )}
    </Box>
  );
};

export default AdminUsers;