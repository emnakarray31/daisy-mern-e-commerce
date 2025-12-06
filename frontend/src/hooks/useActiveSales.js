import { useState, useEffect } from 'react';
import axios from '../lib/axios';

export const useActiveSales = () => {
  const [hasActiveSales, setHasActiveSales] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkActiveSales = async () => {
      try {
        const response = await axios.get('/sales/active');
        setHasActiveSales(response.data && response.data.length > 0);
      } catch (error) {
        console.error('Error checking active sales:', error);
        setHasActiveSales(false);
      } finally {
        setLoading(false);
      }
    };

    checkActiveSales();
  }, []);

  return { hasActiveSales, loading };
};