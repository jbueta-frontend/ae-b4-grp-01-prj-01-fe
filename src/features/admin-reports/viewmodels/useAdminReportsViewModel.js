import { useState, useEffect, useCallback } from 'react';
import { getAdminReportsOverview } from '../../../services/adminService';
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

      // 6. Executive BI Dashboard Overview endpoint GET /admin/reports/overview
      const res = await getAdminReportsOverview(params);

      const revenue = Number(res?.totalRevenue ?? res?.revenue ?? 0);
      const orders = Number(
        res?.orderCount ??
        res?.orders ??
        res?.orderMetrics?.total ??
        0
      );
      const aov = Number(res?.averageOrderValue ?? (orders > 0 ? revenue / orders : 0));
      const activeProductsCount = Number(
        res?.activeProductsCount ??
        res?.activeProducts ??
        res?.productCount ??
        0
      );
      const lowStockAlerts = Array.isArray(res?.lowStockAlerts)
        ? res.lowStockAlerts
        : Array.isArray(res?.lowStock)
          ? res.lowStock
          : [];
      const orderMetrics = res?.orderMetrics || {
        total: orders,
        confirmed: Number(res?.confirmedOrders || 0),
        processing: Number(res?.processingOrders || 0),
        delivered: Number(res?.deliveredOrders || 0),
        cancelled: Number(res?.cancelledOrders || 0),
      };
      const topProducts = Array.isArray(res?.topProducts)
        ? res.topProducts
        : [];

      setData({
        totalRevenue: revenue,
        orderCount: orders,
        averageOrderValue: aov,
        activeProductsCount,
        lowStockAlerts,
        orderMetrics,
        topProducts,
      });
    } catch (err) {
      setError(
        getErrorMessage(err, 'Failed to fetch executive business reports from database')
      );
      setData(INITIAL_REPORTS_STATE);
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
