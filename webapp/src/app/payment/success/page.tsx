
import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export default function PaymentSuccessPage() {

    return (<Suspense fallback={<div>Đang tải...</div>}>
        <SuccessContent />
    </Suspense>
    );
}