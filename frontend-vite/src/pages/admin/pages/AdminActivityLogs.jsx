// src/admin/pages/AdminActivityLogs.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHead, TableHeaderCell, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { Tooltip } from '@/components/ui/tooltip';

const ITEMS_PER_PAGE = 10;

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const lower = search.toLowerCase();
      const filtered = logs.filter(
        (log) =>
          log.action.toLowerCase().includes(lower) ||
          log.description.toLowerCase().includes(lower) ||
          log.performedBy?.name?.toLowerCase().includes(lower)
      );
      setFilteredLogs(filtered);
      setPage(1);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, logs]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/activity-logs');
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLogs(sorted);
      setFilteredLogs(sorted);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const paginatedLogs = filteredLogs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Activity Logs</h1>

      <Input
        placeholder="Search by action, description, or user"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-md"
      />

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>IP</TableHeaderCell>
                <TableHeaderCell>Meta</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-6 text-muted">
                    No logs found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="max-w-xs truncate" title={log.description}>
                      {log.description}
                    </TableCell>
                    <TableCell>{log.performedBy?.name || 'System'}</TableCell>
                    <TableCell>{log.ipAddress || '-'}</TableCell>
                    <TableCell>
                      {log.meta ? (
                        <Tooltip content={JSON.stringify(log.meta, null, 2)}>
                          <span className="cursor-help text-blue-600 underline text-xs">View</span>
                        </Tooltip>
                      ) : (
                        <span className="text-xs text-muted">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-4 items-center">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLogs;

