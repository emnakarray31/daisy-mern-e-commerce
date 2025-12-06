import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  AttachMoney,
  ShoppingCart,
  People,
  Inventory,
  LocalOffer,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  PictureAsPdf,
  TableChart,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from '../../lib/axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
 
const exportDashboardToPDF = (stats, salesData, categoryData, recentOrders) => {
  const doc = new jsPDF();
 
  doc.setFontSize(20);
  doc.setTextColor(137, 81, 41);
  doc.text('Daisy and More - Dashboard Report', 14, 20);
 
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 28);
 
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Key Metrics', 14, 40);

  const metricsData = [
    ['Total Revenue', `$${stats.totalRevenue.toLocaleString()}`],
    ['Total Orders', stats.totalOrders],
    ['Total Customers', stats.totalCustomers],
    ['Total Products', stats.totalProducts],
    ['Avg Order Value', `$${(stats.totalRevenue / stats.totalOrders || 0).toFixed(2)}`],
  ];

  autoTable(doc, {
    head: [['Metric', 'Value']],
    body: metricsData,
    startY: 45,
    theme: 'striped',
    headStyles: { fillColor: [137, 81, 41], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } },
  });
 
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Sales Overview (Last 7 Days)', 14, finalY);

  const salesTableData = salesData.map(day => [
    day.name,
    `$${Number(day.revenue).toLocaleString()}`,
  ]);

  autoTable(doc, {
    head: [['Date', 'Revenue']],
    body: salesTableData,
    startY: finalY + 5,
    theme: 'striped',
    headStyles: { fillColor: [137, 81, 41], halign: 'center' },
    columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } },
  });
 
  finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Sales by Category', 14, finalY);

  const categoryTableData = categoryData.map(cat => [
    cat.name,
    cat.value,
  ]);

  autoTable(doc, {
    head: [['Category', 'Sales']],
    body: categoryTableData,
    startY: finalY + 5,
    theme: 'striped',
    headStyles: { fillColor: [137, 81, 41], halign: 'center' },
    columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } },
  });
 
  if (recentOrders.length > 0) {
    finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Recent Orders', 14, finalY);

    const ordersTableData = recentOrders.map(order => [
      order.orderNumber || order._id.slice(-6),
      order.user?.name || 'N/A',
      order.products?.length || 0,
      `$${order.totalAmount?.toFixed(2)}`,
      order.status,
    ]);

    autoTable(doc, {
      head: [['Order #', 'Customer', 'Items', 'Amount', 'Status']],
      body: ordersTableData,
      startY: finalY + 5,
      theme: 'striped',
      headStyles: { fillColor: [137, 81, 41], halign: 'center' },
      columnStyles: { 3: { halign: 'center', fontStyle: 'bold' } },
    });
  }

  doc.save(`dashboard-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  toast.success('Dashboard exported to PDF successfully!');
};
 
const exportDashboardToExcel = (stats, salesData, categoryData, recentOrders) => {
  const workbook = XLSX.utils.book_new();
 
  const metricsData = [
    ['Daisy and More - Dashboard Report'],
    [`Generated on: ${format(new Date(), 'PPP')}`],
    [],
    ['Key Metrics'],
    ['Metric', 'Value'],
    ['Total Revenue', `$${stats.totalRevenue.toLocaleString()}`],
    ['Total Orders', stats.totalOrders],
    ['Total Customers', stats.totalCustomers],
    ['Total Products', stats.totalProducts],
    ['Avg Order Value', `$${(stats.totalRevenue / stats.totalOrders || 0).toFixed(2)}`],
  ];

  const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
  XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Key Metrics');
 
  const salesSheetData = [
    ['Sales Overview (Last 7 Days)'],
    [],
    ['Date', 'Revenue'],
    ...salesData.map(day => [day.name, day.revenue]),
  ];

  const salesSheet = XLSX.utils.aoa_to_sheet(salesSheetData);
  XLSX.utils.book_append_sheet(workbook, salesSheet, 'Sales Data');
 
  const categorySheetData = [
    ['Sales by Category'],
    [],
    ['Category', 'Sales'],
    ...categoryData.map(cat => [cat.name, cat.value]),
  ];

  const categorySheet = XLSX.utils.aoa_to_sheet(categorySheetData);
  XLSX.utils.book_append_sheet(workbook, categorySheet, 'Categories');
 
  if (recentOrders.length > 0) {
    const ordersSheetData = [
      ['Recent Orders'],
      [],
      ['Order #', 'Customer', 'Items', 'Amount', 'Status', 'Date'],
      ...recentOrders.map(order => [
        order.orderNumber || order._id.slice(-6),
        order.user?.name || 'N/A',
        order.products?.length || 0,
        order.totalAmount?.toFixed(2),
        order.status,
        format(new Date(order.createdAt), 'MMM dd, yyyy'),
      ]),
    ];

    const ordersSheet = XLSX.utils.aoa_to_sheet(ordersSheetData);
    XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Recent Orders');
  }

  XLSX.writeFile(workbook, `dashboard-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  toast.success('Dashboard exported to Excel successfully!');
};

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;
  return (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`, border: `1px solid ${color}20`, borderRadius: '16px', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 24px ${color}20` } }}>
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

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const analyticsRes = await axios.get('/analytics');
      const ordersRes = await axios.get('/orders/admin/all?limit=5');

      setStats({
        totalRevenue: analyticsRes.data.analyticsData.totalRevenue,
        totalOrders: analyticsRes.data.analyticsData.totalSales,
        totalCustomers: analyticsRes.data.analyticsData.users,
        totalProducts: analyticsRes.data.analyticsData.products,
      });

      const chartData = analyticsRes.data.dailySalesData.map(day => ({
        name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: day.revenue,
      }));
      setSalesData(chartData);
      setRecentOrders(ordersRes.data.orders || []);

      setCategoryData([
        { name: 'T-Shirts', value: 400, color: '#895129' },
        { name: 'Jeans', value: 300, color: '#e53637' },
        { name: 'Shoes', value: 200, color: '#d4a574' },
        { name: 'Accessories', value: 100, color: '#6f3f1f' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress size={70} sx={{ color: '#895129' }} />
      </Box>
    );
  }

  const avgOrderValue = stats.totalOrders ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : 0;

  return (
    <Box sx={{ p: 4 }}> 
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, fontFamily: 'Playfair Display, serif' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's what's happening with your store today.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={() => exportDashboardToPDF(stats, salesData, categoryData, recentOrders)}
            sx={{
              background: 'linear-gradient(135deg, #895129 0%, #6f3f1f 100%)',
              color: '#fff',
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(137, 81, 41, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #6f3f1f 0%, #895129 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(137, 81, 41, 0.4)',
              },
            }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<TableChart />}
            onClick={() => exportDashboardToExcel(stats, salesData, categoryData, recentOrders)}
            sx={{
              background: 'linear-gradient(135deg, #d4a574 0%, #895129 100%)',
              color: '#fff',
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(212, 165, 116, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #895129 0%, #d4a574 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(212, 165, 116, 0.4)',
              },
            }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>
 
      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} change={12.5} icon={AttachMoney} color="#895129" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard title="Total Orders" value={stats.totalOrders} change={8.2} icon={ShoppingCart} color="#e53637" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard title="Total Customers" value={stats.totalCustomers} change={-2.4} icon={People} color="#d4a574" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard title="Total Products" value={stats.totalProducts} change={15.3} icon={Inventory} color="#6f3f1f" />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <StatCard title="Avg Order Value" value={`$${avgOrderValue}`} change={5.7} icon={LocalOffer} color="#111" />
        </Grid>
      </Grid>

      <Grid container spacing={9}> 
        <Grid item xs={22} lg={20}>
          <Card sx={{ borderRadius: '16px', height: 560, boxShadow: 6 , width: 500}}>
            <CardContent sx={{ p: 5, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Sales Overview
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Last 7 days performance
              </Typography>
              <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 20, right: 60, left: 30, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#895129" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#895129" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#eaeaea" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 15, fontWeight: 600 }}
                      stroke="#666"
                    />
                    <YAxis 
                      tick={{ fontSize: 14, fontWeight: 600 }}
                      stroke="#666"
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      formatter={(v) => `$${Number(v).toLocaleString()}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#895129"
                      strokeWidth={5}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      dot={{ fill: '#895129', r: 7 }}
                      activeDot={{ r: 9 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
 
        <Grid item xs={12} lg={2.5}>
          <Card sx={{ borderRadius: '16px', height: 560, boxShadow: 6 }}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Sales by Category
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Product distribution
              </Typography>

              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PieChart width={260} height={260}>
                  
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  
                </PieChart>
              </Box>

              <Box sx={{ mt: 3 }}>
                {categoryData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: 13 }}>
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: 15 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
 
      <Card sx={{ borderRadius: '16px', mt: 5 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Recent Orders</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Products</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>#{order.orderNumber || order._id.slice(-6)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: '#895129' }}>
                          {order.user?.name?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                        {order.user?.name || 'N/A'}
                      </Box>
                    </TableCell>
                    <TableCell>{order.products?.length || 0}</TableCell>
                    <TableCell fontWeight={700}>${order.totalAmount?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        size="small" 
                        color={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'warning'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right"><IconButton size="small"><MoreVert /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;