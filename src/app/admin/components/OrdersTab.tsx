// Update the OrdersTab component in /src/app/admin/components/OrdersTab.tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { OrderStatus, PaymentStatus } from '@/types/orders';
import { Order } from '@/types/orders';
import { OrderInfoModal } from './OrderInfoModal';
import { OrderStatusModal } from './OrderStatusModal';
import { useToast } from '@/components/hooks/use-toast';
import axios from 'axios';
import { AdminTableSkeleton } from './AdminTableSkeleton';

const ITEMS_PER_PAGE = 10;

export default function OrdersTab() {
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [selectedInfoOrder, setSelectedInfoOrder] = useState<Order | null>(null);
    const [selectedMoreOrder, setSelectedMoreOrder] = useState<Order | null>(null);
    const [isModalOrderInfoOpen, setIsModalOrderInfoOpen] = useState(false);
    const [isModalMoreOpen, setIsModalMoreOpen] = useState(false);
    
    const { data, isLoading, error, refetch } = useOrders(ITEMS_PER_PAGE * currentPage, statusFilter);

    const { toast } = useToast();
    
    const toastRef = useRef(toast);
    
    // Keep toast ref updated
    useEffect(() => {
        toastRef.current = toast;
    }, [toast]);

    // Add these handler functions
    const handleViewOrderInfoModal = (order: Order) => {
        setSelectedInfoOrder(order);
        setIsModalOrderInfoOpen(true);
    };

    const handleCloseOrderInfoModal = () => {
        setIsModalOrderInfoOpen(false);
        setSelectedInfoOrder(null);
    };

    const handleViewMoreInfoModal = (order: Order) => {
        setSelectedMoreOrder(order);
        setIsModalMoreOpen(true);
    };

    const handleCloseMoreInfoModal = () => {
        setIsModalMoreOpen(false);
        setSelectedMoreOrder(null);
    };

    const handlePaymentStatusUpdate = async (trackingNumber: string, status: PaymentStatus) => {
        try {
            const response = await axios.patch(`/api/orders/${trackingNumber}?scope=payment-status`, { status: status });
            if (response.status === 200) {
                await refetch();
                toastRef.current({
                    title: "Success",
                    description: "Payment status updated successfully",
                });
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            toastRef.current({
                title: "Error",
                description: "Failed to update payment status",
                variant: "destructive",
            });
        }
    };

    const handleOrderStatusUpdate = async (trackingNumber: string, status: OrderStatus) => {
        try {
            const response = await axios.patch(`/api/orders/${trackingNumber}?scope=status`, { status });
            if (response.data.success) {

                await refetch();
                toastRef.current({
                    title: "Success",
                    description: "Order status updated successfully",
                });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toastRef.current({
                title: "Error",
                description: "Failed to update order status",
                variant: "destructive",
            });
        }
    };

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value as OrderStatus | 'all');
        setCurrentPage(1);
    };

    const orders = data?.data || [];
    const { total = 0 } = data?.pagination || {};
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    if (isLoading) {
        return <AdminTableSkeleton rows={10} withImage={false} withSearch={false} withAddButton={false} columns={6} />;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-[var(--destructive)] mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[var(--destructive)]">Error loading orders. Please try again later.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-[var(--foreground)]">Recent Orders</h2>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="appearance-none bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="out-for-delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="failed-delivery">Failed Delivery</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--foreground)]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-[var(--foreground)]">No orders</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">No orders found for the selected status.</p>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            preparing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
            'out-for-delivery': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            'failed-delivery': 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400'
        };

        const statusLabels = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            preparing: 'Preparing',
            'out-for-delivery': 'Out for Delivery',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
            'failed-delivery': 'Failed Delivery'
        };

        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status as keyof typeof statusClasses] || 'bg-[var(--muted)] text-[var(--foreground)]'
                }`}>
                {statusLabels[status as keyof typeof statusLabels] || status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedOrders = orders.slice(startItem, startItem + ITEMS_PER_PAGE);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-[var(--foreground)]">Recent Orders</h2>
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="appearance-none bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="failed-delivery">Failed Delivery</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--foreground)]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--card)] shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border)]">
                        <thead className="bg-[var(--secondary)]">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                                    Total
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                            {paginatedOrders.map((order) => (
                                <tr key={order.orderId} className="hover:bg-[var(--secondary)]">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--foreground)]">
                                        {order.orderId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]">
                                        {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]">
                                        <div>{order.shipping.name}</div>
                                        <div className="text-[var(--muted-foreground)]">{order.shipping.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {(order.total ? order.total / 100 : 0).toFixed(2)} RON
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleViewOrderInfoModal(order)}
                                            className="text-[var(--primary)] hover:text-[var(--foreground)] mr-4 cursor-pointer"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleViewMoreInfoModal(order)}
                                            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                                        >
                                            More
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-[var(--card)] px-4 py-3 flex items-center justify-between border-t border-[var(--border)] sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-md text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage >= totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-md text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-[var(--foreground)]">
                                Showing <span className="font-medium">{startItem + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(startItem + ITEMS_PER_PAGE, total)}
                                </span>{' '}
                                of <span className="font-medium">{total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                    ? 'z-10 bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]'
                                                    : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <OrderInfoModal
                isOpen={isModalOrderInfoOpen}
                onClose={handleCloseOrderInfoModal}
                order={selectedInfoOrder}
                onStatusChange={handlePaymentStatusUpdate}
            />

            <OrderStatusModal
                isOpen={isModalMoreOpen}
                onClose={handleCloseMoreInfoModal}
                order={selectedMoreOrder!}
                onStatusChange={(status) => {
                    if (selectedMoreOrder) {
                        handleOrderStatusUpdate(selectedMoreOrder.trackingNumber, status);
                    }
                }}
            />
        </div>
    );
}