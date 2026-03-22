import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopNav from '@/components/layout/TopNav';
import AppSidebar from '@/components/layout/AppSidebar';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface Transaction {
  id: string;
  quest_id?: string;
  worker_id: string;
  amount: number;
  tx_hash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  expand?: {
    quest_id?: {
      title: string;
    };
  };
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  failed: XCircle,
};

const statusColors = {
  pending: 'text-kwestly-gold',
  confirmed: 'text-kwestly-green',
  failed: 'text-kwestly-red',
};

const Transactions: FC = () => {
  const { userId } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'earned' | 'paid'>('all');

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.getMyTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : filter === 'earned'
      ? transactions.filter(t => t.worker_id === userId)
      : transactions.filter(t => t.worker_id !== userId);

  const totalEarned = filteredTransactions
    .filter(t => t.status === 'confirmed' && t.worker_id === userId)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = filteredTransactions
    .filter(t => t.status === 'pending' && t.worker_id === userId)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground mb-6">
            Transaction History
          </h1>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownLeft className="w-4 h-4 text-kwestly-green" />
                <span className="font-mono text-xs text-muted-foreground">Total Earned</span>
              </div>
              <p className="font-mono text-2xl font-bold text-kwestly-green">${totalEarned.toFixed(2)}</p>
            </div>
            <div className="bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-kwestly-gold" />
                <span className="font-mono text-xs text-muted-foreground">Pending</span>
              </div>
              <p className="font-mono text-2xl font-bold text-kwestly-gold">${totalPending.toFixed(2)}</p>
            </div>
            <div className="bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">Total Transactions</span>
              </div>
              <p className="font-mono text-2xl font-bold text-primary">{filteredTransactions.length}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {(['all', 'earned', 'paid'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-mono font-bold border transition-all ${
                  filter === f
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'text-muted-foreground border-border hover:border-muted-foreground'
                }`}
              >
                {f === 'all' ? 'ALL' : f === 'earned' ? 'EARNED' : 'PAID OUT'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-20 font-mono text-muted-foreground border border-border">
              No transactions yet.
            </div>
          ) : (
            <div className="border border-border">
              <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-border font-mono text-xs text-muted-foreground uppercase">
                <span>Type</span>
                <span className="col-span-2">Quest</span>
                <span>Amount</span>
                <span>Status</span>
              </div>

              {filteredTransactions.map((tx, i) => {
                const StatusIcon = statusIcons[tx.status];
                const isEarned = tx.worker_id === userId;

                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-border last:border-0 items-center"
                  >
                    <div className="flex items-center gap-2">
                      {isEarned ? (
                        <ArrowDownLeft className="w-4 h-4 text-kwestly-green" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-primary" />
                      )}
                      <span className="font-mono text-xs text-muted-foreground">
                        {isEarned ? 'Earned' : 'Paid'}
                      </span>
                    </div>

                    <span className="col-span-2 font-mono text-sm text-foreground truncate">
                      {tx.expand?.quest_id?.title || 'Quest Payment'}
                    </span>

                    <span className={`font-mono text-sm font-bold ${isEarned ? 'text-kwestly-green' : 'text-foreground'}`}>
                      {isEarned ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>

                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${statusColors[tx.status]}`} />
                      <span className={`font-mono text-xs ${statusColors[tx.status]}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                      {tx.tx_hash && (
                        <a
                          href={`https://basescan.org/tx/${tx.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {filteredTransactions.length > 0 && (
            <p className="mt-4 font-mono text-xs text-muted-foreground text-center">
              {formatDistanceToNow(new Date(filteredTransactions[0]?.created_at), { addSuffix: true })} • Last updated
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Transactions;
