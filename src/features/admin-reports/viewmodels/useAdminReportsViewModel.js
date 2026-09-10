import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import {
  getDateRangeByPreset,
  INITIAL_REPORTS_STATE,
} from '../models/reportsModel';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

export function useAdminReportsViewModel() {
  const [activePreset, setActivePreset] = useState('today');
  const initialRange = getDateRangeByPreset('today');
  const [fromDate, setFromDate] = useState(initialRange.from);
  const [toDate, setToDate] = useState(initialRange.to);

  const [data, setData] = useState(INITIAL_REPORTS_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async (from, to) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;

      const res = await api.get('/admin/reports', { params });
      // api unwraps res.data.data -> res is { totalRevenue, orderCount, topProducts }
      const revenue = Number(res?.totalRevenue || res?.revenue || 0);
      const orders = Number(res?.orderCount || res?.orders || 0);
      const aov = orders > 0 ? revenue / orders : 0;
      const topProducts = Array.isArray(res?.topProducts)
        ? res.topProducts
        : [];

      setData({
        totalRevenue: revenue,
        orderCount: orders,
        averageOrderValue: aov,
        topProducts,
      });
    } catch (err) {
      // If backend returns 404 route not found, format a clear, developer-friendly message
      if (err?.response?.status === 404) {
        setError(
          'Notice: Backend endpoint GET /api/v1/admin/reports is not yet registered on the server router. Once the backend mounts this route, live aggregations will populate automatically.'
        );
      } else {
        setError(
          getErrorMessage(err, 'Failed to fetch business reports from server')
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(fromDate, toDate);
  }, [fetchReports, fromDate, toDate]);

  const selectPreset = (presetId) => {
    setActivePreset(presetId);
    const range = getDateRangeByPreset(presetId);
    setFromDate(range.from);
    setToDate(range.to);
  };

  const handleCustomDateChange = (from, to) => {
    setActivePreset('custom');
    setFromDate(from);
    setToDate(to);
  };

  return {
    activePreset,
    fromDate,
    toDate,
    data,
    loading,
    error,
    selectPreset,
    handleCustomDateChange,
    refresh: () => fetchReports(fromDate, toDate),
  };
}
