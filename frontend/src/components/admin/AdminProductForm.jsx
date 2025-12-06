import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  Add,
  Delete,
  Save,
} from '@mui/icons-material';
import { useProductStore } from '../../stores/useProductStore';
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

const sizes = {
  't-shirts': ['S', 'M', 'L', 'XL', 'XXL'],
  jeans: ['28', '30', '32', '34', '36', '38', '40'],
  shoes: ['39', '40', '41', '42', '43', '44', '45'],
  jackets: ['S', 'M', 'L', 'XL', 'XXL'],
  suits: ['S', 'M', 'L', 'XL', 'XXL'],
  glasses: ['ONE SIZE'],
  bags: ['ONE SIZE'],
  accessories: ['ONE SIZE'],
};

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const { createProduct, loading } = useProductStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    images: [],
    colors: [],
    variants: [],
    tags: [],
    isFeatured: false,
  });

  const [newColor, setNewColor] = useState('');
  const [newTag, setNewTag] = useState('');
  const [imagePreview, setImagePreview] = useState('');
 
  useEffect(() => {
    if (formData.category && formData.variants.length === 0) {
      const categorySizes = sizes[formData.category] || ['ONE SIZE'];
      const initialVariants = categorySizes.map(size => ({
        size,
        stock: 50,
        priceAdjustment: 0,
      }));
      setFormData(prev => ({ ...prev, variants: initialVariants }));
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor],
      }));
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove),
    }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === 'stock' || field === 'priceAdjustment' ? Number(value) : value,
    };
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.image) {
      toast.error('Please upload a product image');
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        images: formData.image ? [formData.image] : [],
      };

      if (isEdit) { 
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  return (
    <Box> 
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/admin/products')}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {isEdit ? 'Edit Product' : 'Create New Product'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit ? 'Update product information' : 'Add a new product to your catalog'}
          </Typography>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}> 
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Classic Blue Jeans"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      multiline
                      rows={4}
                      placeholder="Describe your product..."
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        label="Category"
                        onChange={handleChange}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
 
            {formData.category && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Sizes & Stock
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2}>
                    {formData.variants.map((variant, index) => (
                      <Grid item xs={12} key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            p: 2,
                            bgcolor: '#f5f5f5',
                            borderRadius: 1,
                          }}
                        >
                          <Chip label={variant.size} />
                          <TextField
                            label="Stock"
                            type="number"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(index, 'stock', e.target.value)
                            }
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            label="Price Adjustment"
                            type="number"
                            value={variant.priceAdjustment}
                            onChange={(e) =>
                              handleVariantChange(index, 'priceAdjustment', e.target.value)
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">$</InputAdornment>
                              ),
                            }}
                            sx={{ flex: 1 }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
 
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Available Colors
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {formData.colors.map((color, index) => (
                    <Chip
                      key={index}
                      label={color}
                      onDelete={() => handleRemoveColor(color)}
                      sx={{ bgcolor: color, color: '#fff' }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Add Color (Hex Code)"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="#000000"
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddColor}
                    startIcon={<Add />}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
 
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Product Tags
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Add Tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g., summer, trending, new"
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    startIcon={<Add />}
                  >
                    Add
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
 
          <Grid item xs={12} lg={4}> 
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Product Image
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {imagePreview ? (
                  <Box sx={{ mb: 2 }}>
                    <Avatar
                      src={imagePreview}
                      variant="rounded"
                      sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#f5f5f5',
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 60, color: '#ccc' }} />
                  </Box>
                )}

                <Button
                  component="label"
                  fullWidth
                  variant="outlined"
                  startIcon={<CloudUpload />}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              </CardContent>
            </Card>
 
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Status
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FormControl fullWidth>
                  <InputLabel>Featured</InputLabel>
                  <Select
                    name="isFeatured"
                    value={formData.isFeatured}
                    label="Featured"
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        isFeatured: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value={false}>No</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                  </Select>
                </FormControl>

                <Alert severity="info" sx={{ mt: 2 }}>
                  Featured products will be displayed on the homepage
                </Alert>
              </CardContent>
            </Card>
 
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    mb: 1,
                  }}
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/admin/products')}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AdminProductForm;