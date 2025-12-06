import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AttachMoney,
  People,
  Favorite,
  Star,
  LocalOffer,
  Inventory,
  Category,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import axios from '../../lib/axios';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const COLORS = ['#895129', '#e53637', '#d4a574', '#6f3f1f', '#111'];
 
const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        transition: 'all 0.3s',
        borderRadius: '16px',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${color}20`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: color,
              width: 50,
              height: 50,
            }}
          >
            <Icon sx={{ fontSize: 26 }} />
          </Avatar>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              icon={isPositive ? <ArrowUpward /> : <ArrowDownward />}
              label={`${Math.abs(change)}%`}
              size="small"
              color={isPositive ? 'success' : 'error'}
              sx={{ fontWeight: 600, fontSize: '11px' }}
            />
          </Box>
        </Box>
        <Typography 
          variant="h4" 
          fontWeight={800}
          gutterBottom
          sx={{ 
            fontFamily: "'Poppins', sans-serif",
            mb: 0.5,
            fontSize: '28px'
          }}
        >
          {value}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          fontWeight={600}
          sx={{ 
            fontFamily: "'Inter', sans-serif",
            mb: 0.5,
            fontSize: '13px'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            fontWeight: 500,
            fontSize: '11px'
          }}
        >
          {isPositive ? '+' : ''}{change}% from last month
        </Typography>
      </CardContent>
    </Card>
  );
};

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');
  const [analytics, setAnalytics] = useState({
    revenue: { total: 0, change: 0 },
    orders: { total: 0, change: 0 },
    customers: { total: 0, change: 0 },
    products: { total: 0, change: 0 },
    avgOrderValue: { value: 0, change: 0 },
    conversionRate: { value: 0, change: 0 },
  });
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topWishlist, setTopWishlist] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [customerStats, setCustomerStats] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
 
      let startDate, endDate;
      endDate = new Date();
      
      switch (timeRange) {
        case '7days':
          startDate = subDays(endDate, 7);
          break;
        case '30days':
          startDate = subDays(endDate, 30);
          break;
        case 'thisMonth':
          startDate = startOfMonth(endDate);
          endDate = endOfMonth(endDate);
          break;
        case '3months':
          startDate = subDays(endDate, 90);
          break;
        default:
          startDate = subDays(endDate, 7);
      }

      const [
        analyticsRes,
        topProductsRes,
        categoriesRes,
      ] = await Promise.all([
        axios.get('/analytics', {
          params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
        }),
        axios.get('/analytics/top-products', { params: { limit: 10 } }),
        axios.get('/analytics/category-stats'),
      ]);

     
      let wishlistData = [];
      try {
        const wishlistsRes = await axios.get('/wishlist/all-wishlists');
        const allWishlists = wishlistsRes.data.wishlists || [];
        
        const productWishlistCount = {};
        allWishlists.forEach(wishlist => {
          (wishlist.products || []).forEach(item => {
            const productId = typeof item.product === 'object' ? item.product._id : item.product;
            if (productId) {
              productWishlistCount[productId] = (productWishlistCount[productId] || 0) + 1;
            }
          });
        });

        const productsRes = await axios.get('/products');
        const allProducts = productsRes.data.products || [];

        wishlistData = allProducts
          .map(p => ({
            _id: p._id,
            name: p.name,
            image: p.image,
            category: p.category,
            wishlistCount: productWishlistCount[p._id] || 0,
            price: p.price,
          }))
          .filter(p => p.wishlistCount > 0)
          .sort((a, b) => b.wishlistCount - a.wishlistCount)
          .slice(0, 10)
          .map(p => ({
            ...p,
            conversionRate: Math.floor(Math.random() * 80) + 10, 
          }));
          
      } catch (error) {
        console.error('Error fetching wishlist data:', error);
        try {
          const productsRes = await axios.get('/products');
          wishlistData = (productsRes.data.products || [])
            .filter(p => p.wishlistCount && p.wishlistCount > 0)
            .sort((a, b) => (b.wishlistCount || 0) - (a.wishlistCount || 0))
            .slice(0, 10)
            .map(p => ({
              _id: p._id,
              name: p.name,
              image: p.image,
              category: p.category,
              wishlistCount: p.wishlistCount || 0,
              conversionRate: Math.floor(Math.random() * 80) + 10,
            }));
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
      }

      setAnalytics({
        revenue: {
          total: analyticsRes.data.analyticsData.totalRevenue,
          change: 12.5,
        },
        orders: {
          total: analyticsRes.data.analyticsData.totalSales,
          change: 8.2,
        },
        customers: {
          total: analyticsRes.data.analyticsData.users,
          change: -2.4,
        },
        products: {
          total: analyticsRes.data.analyticsData.products,
          change: 5.7,
        },
        avgOrderValue: {
          value: analyticsRes.data.analyticsData.totalRevenue / analyticsRes.data.analyticsData.totalSales || 0,
          change: 3.8,
        },
        conversionRate: {
          value: 2.5,
          change: 1.2,
        },
      });

      const chartData = analyticsRes.data.dailySalesData.map((day) => ({
        name: format(new Date(day.date), 'MMM dd'),
        sales: day.sales,
        revenue: day.revenue,
      }));
      setSalesData(chartData);

      setTopProducts(topProductsRes.data.products || []);

      setTopWishlist(wishlistData);

      setCategoryData(categoriesRes.data.categories || []);
      setRevenueByCategory(categoriesRes.data.revenue || []);

      setCustomerStats([
        { name: 'New', value: 45 },
        { name: 'Returning', value: 55 },
      ]);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#895129' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 5,
        }}
      >
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
              Analytics Dashboard
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontFamily: "'Inter', sans-serif" }}
            >
              Comprehensive business insights and metrics
            </Typography>
          </Box>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7days">Last 7 Days</MenuItem>
            <MenuItem value="30days">Last 30 Days</MenuItem>
            <MenuItem value="thisMonth">This Month</MenuItem>
            <MenuItem value="3months">Last 3 Months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Revenue"
            value={`$${analytics.revenue.total.toLocaleString()}`}
            change={analytics.revenue.change}
            icon={AttachMoney}
            color="#895129"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Orders"
            value={analytics.orders.total}
            change={analytics.orders.change}
            icon={ShoppingCart}
            color="#e53637"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Customers"
            value={analytics.customers.total}
            change={analytics.customers.change}
            icon={People}
            color="#d4a574"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Products"
            value={analytics.products.total}
            change={analytics.products.change}
            icon={Inventory}
            color="#6f3f1f"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: '16px', height: '100%' , width: 450}}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontFamily: "'Inter', sans-serif", mb: 0.5 }}
              >
                Sales & Revenue Overview
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                gutterBottom
                sx={{ fontWeight: 500, mb: 3 }}
              >
                Daily performance trends
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#895129" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#895129" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#999" style={{ fontFamily: "'Inter', sans-serif" }} />
                  <YAxis stroke="#999" style={{ fontFamily: "'Inter', sans-serif" }} />
                  <Tooltip 
                    contentStyle={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      borderRadius: '12px'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#895129"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#e53637"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: '16px', height: '100%' , width: 450}}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontFamily: "'Inter', sans-serif", mb: 0.5 }}
              >
                Category Distribution
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                gutterBottom
                sx={{ fontWeight: 500, mb: 3 }}
              >
                Products by category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
 
      <Grid container spacing={3} sx={{ mb: 3 }}> 
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: '16px' , width: 450}}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontFamily: "'Inter', sans-serif" }}
              >
                Revenue by Category
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                Top performing categories
              </Typography>
              <ResponsiveContainer width="100%" height={300} >
                <BarChart data={revenueByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ 
                      fontFamily: "'Inter', sans-serif",
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#895129" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
 
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: '16px', width: 450 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontFamily: "'Inter', sans-serif" }}
              >
                Customer Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                New vs Returning customers
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={customerStats}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Customers"
                    dataKey="value"
                    stroke="#895129"
                    fill="#895129"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
 
      <Grid container spacing={3}> 
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: '16px', width: 925 }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                }}
              >
                <Star sx={{ color: '#ff9800' }} />
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Top Selling Products
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Sales</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={product._id} hover>
                        <TableCell>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{
                              bgcolor: index === 0 ? '#ff9800' : '#895129',
                              color: '#fff',
                              fontWeight: 700
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={product.image}
                              variant="rounded"
                              sx={{ width: 40, height: 40, bgcolor: '#895129' }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {product.category}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {product.salesCount || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={700} color="#895129">
                            ${product.revenue?.toFixed(2) || '0.00'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
 
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: '16px' , width: 925 }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                }}
              >
                <Favorite sx={{ color: '#e53637' }} />
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Most Wishlisted Products
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {topWishlist.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Wishlist</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Conversion Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topWishlist.map((product, index) => (
                        <TableRow key={product._id} hover>
                          <TableCell>
                            <Chip
                              label={`#${index + 1}`}
                              size="small"
                              sx={{
                                bgcolor: index === 0 ? '#e53637' : '#895129',
                                color: '#fff',
                                fontWeight: 700
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={product.image}
                                variant="rounded"
                                sx={{ width: 40, height: 40, bgcolor: '#895129' }}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {product.category}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: 0.5,
                              }}
                            >
                              <Favorite sx={{ fontSize: 16, color: '#e53637' }} />
                              <Typography variant="body2" fontWeight={700}>
                                {product.wishlistCount || 0}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${product.conversionRate || 0}%`}
                              size="small"
                              sx={{
                                bgcolor: product.conversionRate > 50 ? '#4caf50' : 
                                         product.conversionRate > 25 ? '#ff9800' : '#f44336',
                                color: '#fff',
                                fontWeight: 700
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Favorite sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Wishlist Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products haven't been added to wishlists yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAnalytics;