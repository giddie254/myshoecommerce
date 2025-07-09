// src/admin/pages/AdminMpesaPayments.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';

const AdminMpesaPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/mpesa-transactions', {
        params: { search, status },
      });
      setPayments(data);
    } catch (err) {
      console.error('Failed to load MPESA payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [search, status]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">MPESA Payments</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4 max-w-4xl">
        <Input
          placeholder="Search by phone or MPESA code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Phone</TableHeaderCell>
                <TableHeaderCell>MPESA Code</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-6 text-muted">No payments found.</TableCell>
                </TableRow>
              ) : (
                payments.map((txn) => (
                  <TableRow key={txn._id}>
                    <TableCell>{formatDate(txn.createdAt)}</TableCell>
                    <TableCell>{txn.phone}</TableCell>
                    <TableCell>{txn.mpesaCode}</TableCell>
                    <TableCell>KES {txn.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={
                        txn.status === 'success'
                          ? 'text-green-600'
                          : txn.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }>
                        {txn.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminMpesaPayments;
