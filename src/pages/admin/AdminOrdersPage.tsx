import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase/client";
import type { Order, OrderItem } from "../../types";
import {
    Search,
    Eye,
    Package,
    Truck,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";

export function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [showModal, setShowModal] = useState(false);

    const statusOptions = [
        {
            value: "pending",
            label: "Pending",
            icon: Package,
            color: "bg-yellow-100 text-yellow-800",
        },
        {
            value: "processing",
            label: "Processing",
            icon: Package,
            color: "bg-blue-100 text-blue-800",
        },
        {
            value: "shipped",
            label: "Shipped",
            icon: Truck,
            color: "bg-purple-100 text-purple-800",
        },
        {
            value: "delivered",
            label: "Delivered",
            icon: CheckCircle,
            color: "bg-green-100 text-green-800",
        },
        {
            value: "cancelled",
            label: "Cancelled",
            icon: XCircle,
            color: "bg-red-100 text-red-800",
        },
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrderItems = async (orderId: string) => {
        try {
            const { data, error } = await supabase
                .from("order_items")
                .select(
                    `
          *,
          product:products(*)
        `
                )
                .eq("order_id", orderId);

            if (error) throw error;
            setOrderItems(data || []);
        } catch (error) {
            console.error("Error fetching order items:", error);
        }
    };

    const updateOrderStatus = async (
        orderId: string,
        newStatus:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
    ) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", orderId);

            if (error) throw error;
            await fetchOrders();

            // Update selected order if it's the one being updated
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Error updating order status. Please try again.");
        }
    };

    const viewOrderDetails = async (order: Order) => {
        setSelectedOrder(order);
        await fetchOrderItems(order.id);
        setShowModal(true);
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.customer_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            order.customer_phone.includes(searchTerm) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusConfig = (status: string) => {
        return (
            statusOptions.find((option) => option.value === status) ||
            statusOptions[0]
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <Button
                    onClick={fetchOrders}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search by customer name, phone, or order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Statuses</option>
                        {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const statusConfig = getStatusConfig(
                                        order.status
                                    );
                                    const StatusIcon = statusConfig.icon;

                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order.id.slice(0, 8)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.customer_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.customer_phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(
                                                    order.total_amount
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}
                                                    >
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {statusConfig.label}
                                                    </span>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) =>
                                                            updateOrderStatus(
                                                                order.id,
                                                                e.target
                                                                    .value as
                                                                    | "pending"
                                                                    | "processing"
                                                                    | "shipped"
                                                                    | "delivered"
                                                                    | "cancelled"
                                                            )
                                                        }
                                                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        {statusOptions.map(
                                                            (status) => (
                                                                <option
                                                                    key={
                                                                        status.value
                                                                    }
                                                                    value={
                                                                        status.value
                                                                    }
                                                                >
                                                                    {
                                                                        status.label
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        viewOrderDetails(order)
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 flex items-center"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Order Details - #
                                    {selectedOrder.id.slice(0, 8)}
                                </h3>
                                <Button
                                    onClick={() => setShowModal(false)}
                                    variant="outline"
                                >
                                    Close
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Customer Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        Customer Information
                                    </h4>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium">
                                                Name:
                                            </span>{" "}
                                            {selectedOrder.customer_name}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Phone:
                                            </span>{" "}
                                            {selectedOrder.customer_phone}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Address:
                                            </span>{" "}
                                            {selectedOrder.customer_address}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        Order Information
                                    </h4>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium">
                                                Order ID:
                                            </span>{" "}
                                            {selectedOrder.id}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Status:
                                            </span>
                                            <span
                                                className={`ml-2 inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                                    getStatusConfig(
                                                        selectedOrder.status
                                                    ).color
                                                }`}
                                            >
                                                {
                                                    getStatusConfig(
                                                        selectedOrder.status
                                                    ).label
                                                }
                                            </span>
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Total:
                                            </span>{" "}
                                            {formatCurrency(
                                                selectedOrder.total_amount
                                            )}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Date:
                                            </span>{" "}
                                            {formatDate(
                                                selectedOrder.created_at
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    Order Items
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Quantity
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {orderItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {item.product
                                                                ?.image_url && (
                                                                <img
                                                                    className="h-10 w-10 rounded-lg object-cover mr-4"
                                                                    src={
                                                                        item
                                                                            .product
                                                                            .image_url
                                                                    }
                                                                    alt={
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }
                                                                />
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {item
                                                                        .product
                                                                        ?.name ||
                                                                        "Product not found"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(
                                                            item.price *
                                                                item.quantity
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
