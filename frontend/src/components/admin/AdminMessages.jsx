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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Mail,
  MarkEmailRead,
  Reply,
  Delete,
  Visibility,
  NewReleases,
  DoneAll,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import axios from '../../lib/axios';
import { format } from 'date-fns';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/contact?status=${filter}`);
      setMessages(response.data.contacts || []);
      setStats(response.data.stats || { total: 0, new: 0, read: 0, replied: 0 });
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setAdminNotes(message.adminNotes || '');
    setOpenDialog(true);
    if (message.status === 'new') {
      updateMessageStatus(message._id, 'read');
    }
  };

  const updateMessageStatus = async (id, status) => {
    try {
      await axios.put(`/contact/${id}`, { status, adminNotes });
      toast.success('Status updated');
      fetchMessages();
      if (selectedMessage?._id === id) {
        setSelectedMessage(prev => ({ ...prev, status }));
      }
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/contact/${selectedMessage._id}`);
      toast.success('Message deleted');
      setDeleteDialog(false);
      setOpenDialog(false);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'new':     return { color: '#e53637', icon: <NewReleases />, label: 'New', chip: 'error' };
      case 'read':    return { color: '#ff9800', icon: <MarkEmailRead />, label: 'Read', chip: 'warning' };
      case 'replied': return { color: '#4caf50', icon: <DoneAll />, label: 'Replied', chip: 'success' };
      default:        return { color: '#999', icon: <Mail />, label: 'Unknown', chip: 'default' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress size={60} sx={{ color: '#895129' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: '5px', height: '56px', background: 'linear-gradient(180deg, #895129 0%, #e53637 100%)', borderRadius: '10px' }} />
          <Box>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                fontFamily: "'Playfair Display', serif",
                background: 'linear-gradient(135deg, #895129 0%, #e53637 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              Messages Center
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and respond to customer inquiries
            </Typography>
          </Box>
        </Box>

        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select value={filter} label="Filter by Status" onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="all">All Messages</MenuItem>
            <MenuItem value="new">New Only</MenuItem>
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="replied">Replied</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2} sx={{ mb: 5 }}>
        {[
          { title: 'Total Messages', value: stats.total, icon: Mail, color: '#895129' },
          { title: 'New Messages', value: stats.new, icon: NewReleases, color: '#e53637' },
          { title: 'Read', value: stats.read, icon: MarkEmailRead, color: '#ff9800' },
          { title: 'Replied', value: stats.replied, icon: Reply, color: '#4caf50' },
        ].map((stat, i) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                border: `1px solid ${stat.color}20`,
                borderRadius: '14px',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 8px 20px ${stat.color}15` },
              }}
            >
              <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: stat.color, width: 44, height: 44 }}>
                    <stat.icon sx={{ fontSize: 24 }} />
                  </Avatar>
                </Box>
                <Typography variant="h5" fontWeight={800} sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f9f5f3' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>From</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Received</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                      <Mail sx={{ fontSize: 56, color: '#ddd', mb: 1 }} />
                      <Typography variant="h6" color="text.secondary">
                        No messages found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((msg) => {
                    const config = getStatusConfig(msg.status);
                    return (
                      <TableRow key={msg._id} hover sx={{ '&:hover': { backgroundColor: '#fdfaf8' } }}>
                        <TableCell>
                          <Chip icon={config.icon} label={config.label} size="small" color={config.chip} sx={{ fontSize: '0.75rem' }} />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.9rem', bgcolor: '#895129' }}>
                              {msg.name[0]}
                            </Avatar>
                            <Box>
                              <Typography fontWeight={600} sx={{ fontSize: '0.9rem' }}>{msg.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{msg.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{msg.subject}</TableCell>
                        <TableCell sx={{ fontSize: '0.85rem' }}>
                          {format(new Date(msg.createdAt), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleViewMessage(msg)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedMessage && (
          <>
            <DialogTitle sx={{ bgcolor: '#895129', color: '#fff' }}>
              <Typography variant="h5" fontWeight={700}>Message Details</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={4} sx={{ py: 2 }}>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">From</Typography>
                  <Typography fontWeight={700}>{selectedMessage.name}</Typography>
                  <Typography component="a" href={`mailto:${selectedMessage.email}`} color="primary">
                    {selectedMessage.email}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">Subject</Typography>
                  <Typography fontWeight={600}>{selectedMessage.subject}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                  <Paper sx={{ p: 3, bgcolor: '#f9f5f3', mt: 1 }}>
                    <Typography whiteSpace="pre-wrap">{selectedMessage.message}</Typography>
                  </Paper>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">Received</Typography>
                  <Typography variant="body2">{format(new Date(selectedMessage.createdAt), 'PPpp')}</Typography>
                  {selectedMessage.repliedAt && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Replied: {format(new Date(selectedMessage.repliedAt), 'PPpp')}
                    </Typography>
                  )}
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">Admin Notes</Typography>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal notes..."
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </div>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button variant="outlined" color="error" onClick={() => setDeleteDialog(true)}>
                Delete
              </Button>
              <Box sx={{ flex: 1 }} />
              {selectedMessage.status === 'new' && (
                <Button variant="outlined" startIcon={<MarkEmailRead />} onClick={() => updateMessageStatus(selectedMessage._id, 'read')}>
                  Mark as Read
                </Button>
              )}
              {selectedMessage.status !== 'replied' && (
                <Button variant="contained" startIcon={<Reply />} sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#333' } }} onClick={() => updateMessageStatus(selectedMessage._id, 'replied')}>
                  Mark as Replied
                </Button>
              )}
              <Button variant="outlined" onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete this message?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMessages;