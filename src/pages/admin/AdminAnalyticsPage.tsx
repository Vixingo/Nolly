import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase/client";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Package,
} from "lucide-react";

interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    averageOrderValue: number;
    revenueGrowth: number;
    ordersGrowth: number;
    topProducts: Array<{
        name: string;
        sales: number;
        revenue: number;
    }>;
    revenueByMonth: Array<{
        month: string;
        revenue: number;
        orders: number;
    }>;
    ordersByStatus: Array<{
        status: string;
        count: number;
        percentage: number;
    }>;
}

export function AdminAnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        averageOrderValue: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        topProducts: [],
        revenueByMonth: [],
        ordersByStatus: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState("30"); // days

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);

            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(dateRange));

            // Fetch orders for the selected period
            const { data: orders } = await supabase
                .from("orders")
                .select("*")
                .gte("created_at", startDate.toISOString())
                .lte("created_at", endDate.toISOString());

            // Fetch all orders for comparison
            const { data: allOrders } = await supabase
                .from("orders")
                .select("*");

            // Fetch products count
            const { count: productsCount } = await supabase
                .from("products")
                .select("*", { count: "exact", head: true });

            // Fetch order items with products for top products analysis
            const { data: orderItems } = await supabase
                .from("order_items")
                .select(
                    `
          *,
          product:products(name),
          order:orders!inner(created_at)
        `
                )
                .gte("order.created_at", startDate.toISOString())
                .lte("order.created_at", endDate.toISOString());

            // Calculate metrics
            const totalRevenue =
                orders?.reduce((sum, order) => sum + order.total_amount, 0) ||
                0;
            const totalOrders = orders?.length || 0;
            const averageOrderValue =
                totalOrders > 0 ? totalRevenue / totalOrders : 0;

            // Calculate growth (comparing with previous period)
            const previousStartDate = new Date(startDate);
            previousStartDate.setDate(
                previousStartDate.getDate() - parseInt(dateRange)
            );

            const { data: previousOrders } = await supabase
                .from("orders")
                .select("*")
                .gte("created_at", previousStartDate.toISOString())
                .lt("created_at", startDate.toISOString());

            const previousRevenue =
                previousOrders?.reduce(
                    (sum, order) => sum + order.total_amount,
                    0
                ) || 0;
            const previousOrdersCount = previousOrders?.length || 0;

            const revenueGrowth =
                previousRevenue > 0
                    ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
                    : 0;
            const ordersGrowth =
                previousOrdersCount > 0
                    ? ((totalOrders - previousOrdersCount) /
                          previousOrdersCount) *
                      100
                    : 0;

            // Calculate top products
            const productSales = new Map();
            orderItems?.forEach((item) => {
                const productName = item.product?.name || "Unknown Product";
                const existing = productSales.get(productName) || {
                    sales: 0,
                    revenue: 0,
                };
                productSales.set(productName, {
                    sales: existing.sales + item.quantity,
                    revenue: existing.revenue + item.price * item.quantity,
                });
            });

            const topProducts = Array.from(productSales.entries())
                .map(([name, data]) => ({ name, ...data }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);

            // Calculate revenue by month (last 6 months)
            const revenueByMonth = [];
            for (let i = 5; i >= 0; i--) {
                const monthDate = new Date();
                monthDate.setMonth(monthDate.getMonth() - i);
                const monthStart = new Date(
                    monthDate.getFullYear(),
                    monthDate.getMonth(),
                    1
                );
                const monthEnd = new Date(
                    monthDate.getFullYear(),
                    monthDate.getMonth() + 1,
                    0
                );

                const monthOrders =
                    allOrders?.filter((order) => {
                        const orderDate = new Date(order.created_at);
                        return orderDate >= monthStart && orderDate <= monthEnd;
                    }) || [];

                revenueByMonth.push({
                    month: monthDate.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                    }),
                    revenue: monthOrders.reduce(
                        (sum, order) => sum + order.total_amount,
                        0
                    ),
                    orders: monthOrders.length,
                });
            }

            // Calculate orders by status
            const statusCounts = new Map();
            const totalOrdersForStatus = allOrders?.length || 0;

            allOrders?.forEach((order) => {
                statusCounts.set(
                    order.status,
                    (statusCounts.get(order.status) || 0) + 1
                );
            });

            const ordersByStatus = Array.from(statusCounts.entries()).map(
                ([status, count]) => ({
                    status,
                    count,
                    percentage:
                        totalOrdersForStatus > 0
                            ? (count / totalOrdersForStatus) * 100
                            : 0,
                })
            );

            setAnalytics({
                totalRevenue,
                totalOrders,
                totalProducts: productsCount || 0,
                averageOrderValue,
                revenueGrowth,
                ordersGrowth,
                topProducts,
                revenueByMonth,
                ordersByStatus,
            });
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        const sign = value >= 0 ? "+" : "";
        return `${sign}${value.toFixed(1)}%`;
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
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Total Revenue
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(analytics.totalRevenue)}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-500">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        {analytics.revenueGrowth >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                            className={`text-sm font-medium ${
                                analytics.revenueGrowth >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {formatPercentage(analytics.revenueGrowth)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                            vs previous period
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Total Orders
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics.totalOrders}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-500">
                            <ShoppingCart className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        {analytics.ordersGrowth >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                            className={`text-sm font-medium ${
                                analytics.ordersGrowth >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {formatPercentage(analytics.ordersGrowth)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                            vs previous period
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Avg Order Value
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(analytics.averageOrderValue)}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-500">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-sm text-gray-500">
                            Per order average
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                Total Products
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics.totalProducts}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-500">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-sm text-gray-500">
                            In catalog
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Month */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Revenue Trend (Last 6 Months)
                    </h3>
                    <div className="space-y-4">
                        {analytics.revenueByMonth.map((month, index) => {
                            const maxRevenue = Math.max(
                                ...analytics.revenueByMonth.map(
                                    (m) => m.revenue
                                )
                            );
                            const width =
                                maxRevenue > 0
                                    ? (month.revenue / maxRevenue) * 100
                                    : 0;

                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <div className="w-20 text-sm text-gray-600">
                                        {month.month}
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="bg-gray-200 rounded-full h-4 relative">
                                            <div
                                                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                                style={{ width: `${width}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-24 text-sm font-medium text-gray-900 text-right">
                                        {formatCurrency(month.revenue)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Top Products
                    </h3>
                    <div className="space-y-4">
                        {analytics.topProducts.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                No sales data available
                            </p>
                        ) : (
                            analytics.topProducts.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {product.sales} sold
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-900">
                                            {formatCurrency(product.revenue)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Orders by Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {analytics.ordersByStatus.map((status, index) => {
                        const colors = {
                            pending: "bg-yellow-100 text-yellow-800",
                            processing: "bg-blue-100 text-blue-800",
                            shipped: "bg-purple-100 text-purple-800",
                            delivered: "bg-green-100 text-green-800",
                            cancelled: "bg-red-100 text-red-800",
                        };

                        return (
                            <div key={index} className="text-center">
                                <div
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        colors[
                                            status.status as keyof typeof colors
                                        ] || "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    {status.status}
                                </div>
                                <div className="mt-2">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {status.count}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {status.percentage.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
