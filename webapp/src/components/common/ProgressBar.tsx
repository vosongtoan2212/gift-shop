'use client';
import NextTopLoader from 'nextjs-toploader';

export default function ProgressBar() {
  return (
    <div>
      <NextTopLoader showSpinner={false} color="#FA9BAB" />
    </div>
  );
}
