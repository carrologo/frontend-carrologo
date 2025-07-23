import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { getCompletedTransactionsByMonth, MonthlyCompletedTransactions } from '../../../services/transaction-stats.service';

const CompletedTransactionsChart: React.FC = () => {
  const [data, setData] = useState<MonthlyCompletedTransactions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const chartData = await getCompletedTransactionsByMonth(6);
        setData(chartData);
      } catch (error) {
        console.error('Error al cargar datos del gráfico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label: _label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #ccc',
            borderRadius: 1,
            padding: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {data.monthName} {data.year}
          </Typography>
          <Typography variant="body2" color="primary">
            Transacciones: {payload[0].value}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', minHeight: 300 }}>
        <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', minHeight: 300 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
          Transacciones Completadas (Últimos 6 Meses)
        </Typography>
        
        <Box sx={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="monthName" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#1976d2"
                radius={[4, 4, 0, 0]}
                name="Transacciones"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        
        {data.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No hay datos disponibles
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedTransactionsChart;
