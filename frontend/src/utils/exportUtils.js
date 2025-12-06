 import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
 
export const exportOrdersToPDF = (orders, filename = 'orders-report') => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(102, 126, 234);
  doc.text('Daisy and More - Orders Report', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 28);
  
  const tableData = orders.map(order => [
    order.orderNumber || order._id.slice(-8),
    order.user?.name || 'N/A',
    order.products?.length || 0,
    `$${order.totalAmount?.toFixed(2)}`,
    order.status,
    format(new Date(order.createdAt), 'MMM dd, yyyy'),
  ]);
  
   doc.autoTable({
    head: [['Order #', 'Customer', 'Items', 'Amount', 'Status', 'Date']],
    body: tableData,
    startY: 35,
    theme: 'striped',
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      3: { halign: 'right', fontStyle: 'bold' },
    },
  });
  
   const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total Orders: ${orders.length}`, 14, finalY);
  doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, finalY + 7);
  
   doc.save(`${filename}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

 
export const exportProductsToPDF = (products, filename = 'products-report') => {
  const doc = new jsPDF();
  
 
  doc.setFontSize(18);
  doc.setTextColor(102, 126, 234);
  doc.text('Daisy and More - Products Report', 14, 20);
  
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 28);
  
 
  const tableData = products.map(product => [
    product.name,
    product.category,
    `$${product.price.toFixed(2)}`,
    product.totalStock || 0,
    product.isFeatured ? 'Yes' : 'No',
  ]);
  
   doc.autoTable({
    head: [['Product Name', 'Category', 'Price', 'Stock', 'Featured']],
    body: tableData,
    startY: 35,
    theme: 'striped',
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      2: { halign: 'right', fontStyle: 'bold' },
      3: { halign: 'center' },
    },
  });
  
   const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.totalStock || 0), 0);
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total Products: ${totalProducts}`, 14, finalY);
  doc.text(`Total Stock: ${totalStock} units`, 14, finalY + 7);
 
  doc.save(`${filename}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const exportAnalyticsToPDF = (analyticsData, filename = 'analytics-report') => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(102, 126, 234);
  doc.text('Daisy and More', 14, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text('Analytics Report', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 38);
  
  let yPos = 50;
  
   doc.setFontSize(14);
  doc.setTextColor(102, 126, 234);
  doc.text('Key Metrics', 14, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(0);
  
  const metrics = [
    ['Total Revenue:', `$${analyticsData.totalRevenue?.toLocaleString() || 0}`],
    ['Total Orders:', analyticsData.totalSales?.toLocaleString() || 0],
    ['Total Customers:', analyticsData.users?.toLocaleString() || 0],
    ['Total Products:', analyticsData.products?.toLocaleString() || 0],
    ['Average Order Value:', `$${(analyticsData.totalRevenue / analyticsData.totalSales || 0).toFixed(2)}`],
  ];
  
  metrics.forEach(([label, value]) => {
    doc.text(label, 14, yPos);
    doc.setFont(undefined, 'bold');
    doc.text(value.toString(), 80, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 7;
  });
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setTextColor(102, 126, 234);
  doc.text('Daily Sales (Last 7 Days)', 14, yPos);
  yPos += 5;
  
  if (analyticsData.dailySales && analyticsData.dailySales.length > 0) {
    const salesData = analyticsData.dailySales.map(day => [
      format(new Date(day.date), 'MMM dd, yyyy'),
      day.sales.toString(),
      `$${day.revenue.toFixed(2)}`,
    ]);
    
    doc.autoTable({
      head: [['Date', 'Orders', 'Revenue']],
      body: salesData,
      startY: yPos + 5,
      theme: 'striped',
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
    });
  }

  doc.save(`${filename}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};


export const exportOrderInvoiceToPDF = (order) => {
  const doc = new jsPDF();
  

  doc.setFontSize(24);
  doc.setTextColor(102, 126, 234);
  doc.text('INVOICE', 14, 20);
  

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text('Daisy and More', 14, 30);
  doc.text('Fashion E-commerce', 14, 36);
  doc.text('contact@daisyandmore.com', 14, 42);
  

  doc.text(`Invoice #: ${order.orderNumber || order._id.slice(-8)}`, 140, 30);
  doc.text(`Date: ${format(new Date(order.createdAt), 'MMM dd, yyyy')}`, 140, 36);
  doc.text(`Status: ${order.status}`, 140, 42);
  

  doc.setFontSize(12);
  doc.setTextColor(102, 126, 234);
  doc.text('Bill To:', 14, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(order.user?.name || 'N/A', 14, 62);
  doc.text(order.user?.email || '', 14, 68);
  
  if (order.shippingAddress) {
    doc.text(order.shippingAddress.address || '', 14, 74);
    doc.text(
      `${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`,
      14,
      80
    );
    doc.text(order.shippingAddress.country || '', 14, 86);
  }

  const productsData = order.products.map(item => [
    item.name,
    item.quantity.toString(),
    `$${item.price.toFixed(2)}`,
    `$${(item.quantity * item.price).toFixed(2)}`,
  ]);
  
  doc.autoTable({
    head: [['Product', 'Quantity', 'Price', 'Total']],
    body: productsData,
    startY: 95,
    theme: 'plain',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' },
    },
  });
  
 
  const finalY = doc.lastAutoTable.finalY + 10;
  const summaryX = 130;
  
  doc.text('Subtotal:', summaryX, finalY);
  doc.text(`$${order.subtotal?.toFixed(2)}`, 180, finalY, { align: 'right' });
  
  doc.text('Shipping:', summaryX, finalY + 6);
  doc.text(`$${order.shippingCost?.toFixed(2)}`, 180, finalY + 6, { align: 'right' });
  
  if (order.discount > 0) {
    doc.text('Discount:', summaryX, finalY + 12);
    doc.text(`-$${order.discount?.toFixed(2)}`, 180, finalY + 12, { align: 'right' });
  }
  

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  const totalY = order.discount > 0 ? finalY + 18 : finalY + 12;
  doc.text('TOTAL:', summaryX, totalY);
  doc.text(`$${order.totalAmount?.toFixed(2)}`, 180, totalY, { align: 'right' });
  

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(150);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  
  doc.save(`invoice-${order.orderNumber || order._id.slice(-8)}.pdf`);
};

 
export const exportOrdersToExcel = (orders, filename = 'orders-export') => {
  const data = orders.map(order => ({
    'Order Number': order.orderNumber || order._id.slice(-8),
    'Customer Name': order.user?.name || 'N/A',
    'Customer Email': order.user?.email || 'N/A',
    'Products': order.products?.length || 0,
    'Subtotal': order.subtotal?.toFixed(2),
    'Shipping': order.shippingCost?.toFixed(2),
    'Discount': order.discount?.toFixed(2),
    'Total Amount': order.totalAmount?.toFixed(2),
    'Status': order.status,
    'Payment Method': order.paymentMethod || 'N/A',
    'Date': format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm'),
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  
   worksheet['!cols'] = [
    { wch: 15 }, 
    { wch: 20 }, 
    { wch: 25 }, 
    { wch: 10 }, 
    { wch: 12 }, 
    { wch: 12 }, 
    { wch: 12 }, 
    { wch: 12 }, 
    { wch: 12 }, 
    { wch: 15 }, 
    { wch: 18 }, 
  ];
  
  XLSX.writeFile(workbook, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

 
export const exportProductsToExcel = (products, filename = 'products-export') => {
  const data = products.map(product => ({
    'Product ID': product._id,
    'Name': product.name,
    'Description': product.description,
    'Category': product.category,
    'Price': product.price,
    'Total Stock': product.totalStock || 0,
    'Featured': product.isFeatured ? 'Yes' : 'No',
    'Colors': product.colors?.join(', ') || '',
    'Tags': product.tags?.join(', ') || '',
    'Created At': format(new Date(product.createdAt), 'yyyy-MM-dd'),
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  
  worksheet['!cols'] = [
    { wch: 25 }, 
    { wch: 30 }, 
    { wch: 50 },  
    { wch: 15 },  
    { wch: 10 }, 
    { wch: 12 }, 
    { wch: 10 },  
    { wch: 20 }, 
    { wch: 30 }, 
    { wch: 12 }, 
  ];
  
  XLSX.writeFile(workbook, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};


export const exportUsersToExcel = (users, filename = 'users-export') => {
  const data = users.map(user => ({
    'User ID': user._id,
    'Name': user.name,
    'Email': user.email,
    'Role': user.role,
    'Orders Count': user.ordersCount || 0,
    'Total Spent': user.totalSpent?.toFixed(2) || '0.00',
    'Wishlist Items': user.wishlistCount || 0,
    'Registered': format(new Date(user.createdAt), 'yyyy-MM-dd'),
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  
  worksheet['!cols'] = [
    { wch: 25 }, 
    { wch: 20 }, 
    { wch: 30 }, 
    { wch: 12 }, 
    { wch: 12 }, 
    { wch: 12 }, 
    { wch: 12 }, 
    { wch: 12 }, 
  ];
  
  XLSX.writeFile(workbook, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};


export const exportCouponsToExcel = (coupons, filename = 'coupons-export') => {
  const data = coupons.map(coupon => ({
    'Code': coupon.code,
    'Type': coupon.discountType,
    'Value': coupon.discountValue,
    'Min Purchase': coupon.minPurchaseAmount || 'None',
    'Max Discount': coupon.maxDiscountAmount || 'None',
    'Usage Limit': coupon.usageLimit || 'Unlimited',
    'Times Used': coupon.usedCount || 0,
    'Active': coupon.isActive ? 'Yes' : 'No',
    'Public': coupon.isPublic ? 'Yes' : 'No',
    'Expiration': coupon.expirationDate
      ? format(new Date(coupon.expirationDate), 'yyyy-MM-dd')
      : 'No expiry',
    'Created': format(new Date(coupon.createdAt), 'yyyy-MM-dd'),
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Coupons');
  
  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 12 },  
    { wch: 10 },
    { wch: 12 }, 
    { wch: 12 },  
    { wch: 12 },  
    { wch: 10 }, 
    { wch: 8 },   
    { wch: 8 },  
    { wch: 12 },  
    { wch: 12 },  
  ];
  
  XLSX.writeFile(workbook, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

 
export const exportAnalyticsToExcel = (analyticsData, filename = 'analytics-export') => {
  const workbook = XLSX.utils.book_new();
  
  const summaryData = [
    ['Metric', 'Value'],
    ['Total Revenue', `$${analyticsData.totalRevenue?.toLocaleString() || 0}`],
    ['Total Orders', analyticsData.totalSales || 0],
    ['Total Customers', analyticsData.users || 0],
    ['Total Products', analyticsData.products || 0],
    ['Average Order Value', `$${(analyticsData.totalRevenue / analyticsData.totalSales || 0).toFixed(2)}`],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  if (analyticsData.dailySales) {
    const salesData = analyticsData.dailySales.map(day => ({
      'Date': format(new Date(day.date), 'yyyy-MM-dd'),
      'Orders': day.sales,
      'Revenue': day.revenue.toFixed(2),
    }));
    
    const salesSheet = XLSX.utils.json_to_sheet(salesData);
    salesSheet['!cols'] = [{ wch: 12 }, { wch: 10 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, salesSheet, 'Daily Sales');
  }
  
  XLSX.writeFile(workbook, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

export default {

  exportOrdersToPDF,
  exportProductsToPDF,
  exportAnalyticsToPDF,
  exportOrderInvoiceToPDF,
  
  
  exportOrdersToExcel,
  exportProductsToExcel,
  exportUsersToExcel,
  exportCouponsToExcel,
  exportAnalyticsToExcel,
};