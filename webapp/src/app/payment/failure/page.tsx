'use client';

import { Suspense } from 'react';
import FailureContent from './FailureContent';

export default function PaymentFailurePage() {

    return (<Suspense fallback={<div>Đang tải...</div>}>
        <FailureContent />
    </Suspense>
    );
}