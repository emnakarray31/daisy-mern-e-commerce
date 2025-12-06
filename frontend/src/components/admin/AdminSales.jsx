import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  FormControlLabel,
  Avatar,
  Tooltip,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  LocalOffer,
  TrendingDown,
  Percent,
  ShoppingCart,
  CalendarToday,
  Search,
  Category,
  SelectAll,
  Clear,
} from '@mui/icons-material';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';

const AdminSales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTab, setCurrentTab] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    selectedProducts: [],
  });
 
  const categories = [
    { value: 'all', label: 'All Categories', count: 0 },
    { value: 'jeans', label: 'Jeans', count: 0 },
    { value: 't-shirt', label: 'T-Shirts', count: 0 },
    { value: 'shoes', label: 'Shoes', count: 0 },
    { value: 'glasses', label: 'Glasses', count: 0 },
    { value: 'jacket', label: 'Jackets', count: 0 },
    { value: 'suit', label: 'Suits', count: 0 },
    { value: 'bag', label: 'Bags', count: 0 },
    { value: 'accessories', label: 'Accessories', count: 0 },
  ];

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);
 
  const getCategoriesWithCount = () => {
    return categories.map(cat => ({
      ...cat,
      count: cat.value === 'all' 
        ? products.length 
        : products.filter(p => p.category === cat.value).length
    }));
  };

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/sales');
      setSales(response.data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenModal = (mode, sale = null) => {
    setModalMode(mode);
    if (mode === 'edit' && sale) {
      setSelectedSale(sale);
      setFormData({
        name: sale.name || '',
        description: sale.description || '',
        discountType: sale.discountType || 'percentage',
        discountValue: sale.discountValue || 0,
        startDate: sale.startDate ? sale.startDate.split('T')[0] : '',
        endDate: sale.endDate ? sale.endDate.split('T')[0] : '',
        isActive: sale.isActive !== false,
        selectedProducts: sale.products?.map(p => p._id || p) || [],
      });
    } else {
      setSelectedSale(null);
      setFormData({
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        startDate: '',
        endDate: '',
        isActive: true,
        selectedProducts: [],
      });
    }
    setSelectedCategory('all');
    setSearchTerm('');
    setCurrentTab(0);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSale(null);
    setSelectedCategory('all');
    setSearchTerm('');
    setCurrentTab(0);
    setFormData({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      startDate: '',
      endDate: '',
      isActive: true,
      selectedProducts: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  }; 
  const handleSelectAllInCategory = () => {
    const currentProducts = getFilteredProducts();
    const currentIds = currentProducts.map(p => p._id);
    
    setFormData(prev => { 
      const allSelected = currentIds.every(id => prev.selectedProducts.includes(id));
      
      if (allSelected) { 
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.filter(id => !currentIds.includes(id))
        };
      } else { 
        const newSelected = [...new Set([...prev.selectedProducts, ...currentIds])];
        return {
          ...prev,
          selectedProducts: newSelected
        };
      }
    });
  };

   const handleClearSelection = () => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: []
    }));
  };

  const getFilteredProducts = () => {
    let filtered = products;
 
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
 
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.selectedProducts.length === 0) {
      toast.error('Please select at least one product');
      return;
    }

    if (formData.discountValue <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return;
    }

    try {
      const saleData = {
        name: formData.name,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        products: formData.selectedProducts,
      };

      if (modalMode === 'create') {
        await axios.post('/sales', saleData);
        toast.success('Sale created successfully');
      } else {
        await axios.put(`/sales/${selectedSale._id}`, saleData);
        toast.success('Sale updated successfully');
      }

      fetchSales();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save sale');
      console.error(error);
    }
  };

  const handleDeleteClick = (sale) => {
    setSaleToDelete(sale);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!saleToDelete) return;

    try {
      await axios.delete(`/sales/${saleToDelete._id}`);
      toast.success('Sale deleted successfully');
      fetchSales();
      setShowDeleteDialog(false);
      setSaleToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete sale');
      console.error(error);
    }
  };

  const handleToggleActive = async (sale) => {
    try {
      await axios.patch(`/sales/${sale._id}/toggle`, {
        isActive: !sale.isActive
      });
      toast.success(`Sale ${!sale.isActive ? 'activated' : 'deactivated'}`);
      fetchSales();
    } catch (error) {
      toast.error('Failed to update sale status');
      console.error(error);
    }
  };

  const filteredProducts = getFilteredProducts();
  const categoriesWithCount = getCategoriesWithCount();
   
  const allCurrentSelected = filteredProducts.length > 0 && 
    filteredProducts.every(p => formData.selectedProducts.includes(p._id));

  const activeSales = sales.filter(s => s.isActive).length;
  const totalDiscount = sales.reduce((acc, s) => {
    if (s.isActive && s.discountType === 'percentage') {
      return acc + s.discountValue;
    }
    return acc;
  }, 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div style={{
          width: '70px',
          height: '70px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #895129',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}> 
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: '5px', 
            height: '56px', 
            background: 'linear-gradient(180deg, #895129 0%, #e53637 100%)',
            borderRadius: '10px'
          }} />
          <Box>
            <Typography 
              variant="h3" 
              fontWeight={800}
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                background: 'linear-gradient(135deg, #895129 0%, #e53637 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5
              }}
            >
              Sales & Discounts
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontFamily: "'Inter', sans-serif" }}
            >
              Manage promotional sales and discounts
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal('create')}
          sx={{
            background: '#895129',
            textTransform: 'none',
            px: 4,
            py: 1.5,
            fontWeight: 700,
            borderRadius: '12px',
            fontSize: '15px',
            fontFamily: "'Inter', sans-serif",
            '&:hover': {
              background: '#6f3f1f',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(137, 81, 41, 0.3)',
            },
            transition: 'all 0.3s',
          }}
        >
          Create New Sale
        </Button>
      </Box>
 
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #89512915 0%, #89512905 100%)',
            border: '1px solid #89512920',
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px #89512920' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ fontSize: '13px', mb: 0.5 }}>
                    Total Sales
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ fontSize: '28px', color: '#895129' }}>
                    {sales.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#895129', width: 50, height: 50 }}>
                  <LocalOffer sx={{ fontSize: 26 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #e5363715 0%, #e5363705 100%)',
            border: '1px solid #e5363720',
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px #e5363720' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ fontSize: '13px', mb: 0.5 }}>
                    Active Sales
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ fontSize: '28px', color: '#e53637' }}>
                    {activeSales}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#e53637', width: 50, height: 50 }}>
                  <TrendingDown sx={{ fontSize: 26 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #10b98115 0%, #10b98105 100%)',
            border: '1px solid #10b98120',
            transition: 'all 0.3s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px #10b98120' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ fontSize: '13px', mb: 0.5 }}>
                    Avg Discount
                  </Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ fontSize: '28px', color: '#10b981' }}>
                    {activeSales > 0 ? (totalDiscount / activeSales).toFixed(1) : 0}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#10b981', width: 50, height: 50 }}>
                  <Percent sx={{ fontSize: 26 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sales Table */}
      <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Sale Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Discount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Products</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => {
                const now = new Date();
                const start = new Date(sale.startDate);
                const end = new Date(sale.endDate);
                const isExpired = now > end;
                const isUpcoming = now < start;
                const isOngoing = now >= start && now <= end && sale.isActive;

                return (
                  <TableRow key={sale._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {sale.name}
                        </Typography>
                        {sale.description && (
                          <Typography variant="caption" color="text.secondary">
                            {sale.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Percent sx={{ fontSize: 16 }} />}
                        label={
                          sale.discountType === 'percentage'
                            ? `${sale.discountValue}%`
                            : `$${sale.discountValue}`
                        }
                        size="small"
                        sx={{
                          bgcolor: '#e5363715',
                          color: '#e53637',
                          fontWeight: 700,
                          border: '1px solid #e5363740',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<ShoppingCart sx={{ fontSize: 16 }} />}
                        label={`${sale.products?.length || 0} products`}
                        size="small"
                        sx={{
                          bgcolor: '#89512915',
                          color: '#895129',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block">
                        {new Date(sale.startDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        to {new Date(sale.endDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          isExpired ? 'Expired' :
                          isUpcoming ? 'Upcoming' :
                          isOngoing ? 'Active' :
                          'Inactive'
                        }
                        size="small"
                        color={
                          isExpired ? 'default' :
                          isUpcoming ? 'info' :
                          isOngoing ? 'success' :
                          'warning'
                        }
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title={sale.isActive ? 'Deactivate' : 'Activate'}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleActive(sale)}
                            sx={{
                              bgcolor: sale.isActive ? '#10b98115' : '#f5f5f5',
                              color: sale.isActive ? '#10b981' : '#666',
                              '&:hover': { 
                                bgcolor: sale.isActive ? '#10b981' : '#111', 
                                color: '#fff' 
                              },
                            }}
                          >
                            <LocalOffer fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit sale">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenModal('edit', sale)}
                            sx={{
                              bgcolor: '#89512915',
                              color: '#895129',
                              '&:hover': { bgcolor: '#895129', color: '#fff' },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete sale">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(sale)}
                            sx={{
                              bgcolor: '#e5363715',
                              color: '#e53637',
                              '&:hover': { bgcolor: '#e53637', color: '#fff' },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {sales.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <LocalOffer sx={{ fontSize: 64, color: '#e5e5e5', mb: 2 }} />
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              No sales yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first sale to start offering discounts
            </Typography>
          </Box>
        )}
      </Card>
 
      <Dialog 
        open={showModal} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontFamily: "'Playfair Display', serif", fontSize: '24px' }}>
          {modalMode === 'create' ? 'Create New Sale' : 'Edit Sale'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
             
              <TextField
                label="Sale Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                placeholder="e.g., Summer Sale 2024"
              />
 
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={2}
                fullWidth
                placeholder="Brief description of the sale"
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Discount Type</InputLabel>
                    <Select
                      name="discountType"
                      value={formData.discountType}
                      label="Discount Type"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="percentage">Percentage (%)</MenuItem>
                      <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Discount Value"
                    name="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {formData.discountType === 'percentage' ? '%' : '$'}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
 
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
 
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    name="isActive"
                  />
                }
                label="Active (Enable this sale immediately)"
              />
 
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Select Products ({formData.selectedProducts.length} selected)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<SelectAll />}
                      onClick={handleSelectAllInCategory}
                      sx={{
                        textTransform: 'none',
                        color: allCurrentSelected ? '#e53637' : '#895129',
                        border: `1px solid ${allCurrentSelected ? '#e53637' : '#895129'}`,
                        '&:hover': {
                          bgcolor: allCurrentSelected ? '#e5363715' : '#89512915',
                        }
                      }}
                    >
                      {allCurrentSelected ? 'Deselect All' : 'Select All in Category'}
                    </Button>
                    {formData.selectedProducts.length > 0 && (
                      <Button
                        size="small"
                        startIcon={<Clear />}
                        onClick={handleClearSelection}
                        sx={{
                          textTransform: 'none',
                          color: '#666',
                          border: '1px solid #e5e5e5',
                          '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                      >
                        Clear All
                      </Button>
                    )}
                  </Box>
                </Box>
 
                <Tabs
                  value={currentTab}
                  onChange={(e, newValue) => {
                    setCurrentTab(newValue);
                    setSelectedCategory(categoriesWithCount[newValue].value);
                  }}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ 
                    mb: 2,
                    borderBottom: '1px solid #e5e5e5',
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      minHeight: '48px',
                      fontWeight: 600,
                    }
                  }}
                >
                  {categoriesWithCount.map((cat, index) => (
                    <Tab
                      key={cat.value}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Category sx={{ fontSize: 18 }} />
                          <span>{cat.label}</span>
                          <Chip 
                            label={cat.count} 
                            size="small" 
                            sx={{ 
                              height: '20px',
                              fontSize: '11px',
                              fontWeight: 700,
                              bgcolor: currentTab === index ? '#895129' : '#f5f5f5',
                              color: currentTab === index ? '#fff' : '#666',
                            }} 
                          />
                        </Box>
                      }
                    />
                  ))}
                </Tabs>

                <TextField
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ 
                  maxHeight: '400px', 
                  overflow: 'auto',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  p: 1,
                }}>
                  {filteredProducts.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Category sx={{ fontSize: 48, color: '#e5e5e5', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No products in this category
                      </Typography>
                    </Box>
                  ) : (
                    filteredProducts.map((product) => (
                      <Box
                        key={product._id}
                        onClick={() => handleProductToggle(product._id)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 1.5,
                          cursor: 'pointer',
                          borderRadius: '8px',
                          bgcolor: formData.selectedProducts.includes(product._id) ? '#89512915' : 'transparent',
                          border: formData.selectedProducts.includes(product._id) ? '1px solid #89512940' : '1px solid transparent',
                          '&:hover': { bgcolor: formData.selectedProducts.includes(product._id) ? '#89512920' : '#f5f5f5' },
                          transition: 'all 0.2s',
                        }}
                      >
                        <Avatar
                          src={product.image}
                          variant="rounded"
                          sx={{ width: 50, height: 50 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {product.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              ${product.price.toFixed(2)}
                            </Typography>
                            <Chip 
                              label={product.category} 
                              size="small" 
                              sx={{ 
                                height: '18px', 
                                fontSize: '10px',
                                textTransform: 'capitalize',
                                bgcolor: '#f5f5f5',
                                color: '#666',
                              }} 
                            />
                          </Box>
                        </Box>
                        {formData.selectedProducts.includes(product._id) && (
                          <Chip 
                            label="✓ Selected" 
                            size="small" 
                            sx={{ 
                              bgcolor: '#895129', 
                              color: '#fff',
                              fontWeight: 600,
                            }} 
                          />
                        )}
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseModal}
              sx={{ color: '#666', fontWeight: 600, borderRadius: '8px', textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#895129',
                fontWeight: 700,
                borderRadius: '8px',
                textTransform: 'none',
                px: 3,
                '&:hover': { bgcolor: '#6f3f1f' },
              }}
            >
              {modalMode === 'create' ? 'Create Sale' : 'Update Sale'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
 
      <Dialog 
        open={showDeleteDialog} 
        onClose={() => setShowDeleteDialog(false)}
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>
          Delete Sale
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Delete sx={{ fontSize: 32, color: '#dc2626' }} />
            </Box>
            <Typography sx={{ mb: 1 }}>
              Are you sure you want to delete <strong>"{saleToDelete?.name}"</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This will remove the discount from all associated products.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setShowDeleteDialog(false)}
            sx={{ color: '#666', fontWeight: 600, borderRadius: '8px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              bgcolor: '#e53637',
              fontWeight: 700,
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#c62828' },
            }}
          >
            Delete Sale
          </Button>
        </DialogActions>
      </Dialog>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default AdminSales;