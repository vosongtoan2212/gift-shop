import { Suspense } from 'react';
import AuthCallbackClient from './AuthCallbackClient';

export default function Page() {
  return (
    <Suspense fallback={<p>Đang xử lý đăng nhập...</p>}>
      <AuthCallbackClient />
    </Suspense>
  );
}
