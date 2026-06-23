import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface VerificationBadgeProps {
  status?: 'pending' | 'verified' | 'rejected';
  showText?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status = 'pending', showText = true }) => {
  if (status === 'verified') {
    return (
      <div className="inline-flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        {showText && <span>Verified Business</span>}
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-full text-xs font-medium">
        <Clock className="w-3.5 h-3.5" />
        {showText && <span>Verification Pending</span>}
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="inline-flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full text-xs font-medium">
        <XCircle className="w-3.5 h-3.5" />
        {showText && <span>Verification Rejected</span>}
      </div>
    );
  }

  return null;
};
