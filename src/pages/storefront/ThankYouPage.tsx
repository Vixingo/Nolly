import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Home, Package } from "lucide-react";
import { Button } from "../../components/ui/button";

export function ThankYouPage() {
    const location = useLocation();
    const orderId = location.state?.orderId;

    useEffect(() => {
        // Track order completion for analytics
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "purchase", {
                transaction_id: orderId,
                value: 0, // You can pass the actual value here
                currency: "USD",
            });
        }

        // Facebook Pixel tracking
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "Purchase", {
                value: 0, // You can pass the actual value here
                currency: "USD",
            });
        }
    }, [orderId]);

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green-100 rounded-full">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                </div>

                {/* Thank You Message */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Thank You for Your Order!
                </h1>

                <p className="text-lg text-gray-600 mb-8">
                    Your order has been successfully placed and is being
                    processed.
                </p>

                {/* Order Details */}
                {orderId && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Order Details
                        </h2>
                        <p className="text-gray-600">
                            Order ID:{" "}
                            <span className="font-mono font-medium">
                                {orderId}
                            </span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            You will receive a confirmation email shortly with
                            your order details.
                        </p>
                    </div>
                )}

                {/* What's Next */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        What happens next?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                            <div className="flex justify-center mb-2">
                                <Package className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">
                                Order Processing
                            </h3>
                            <p className="text-gray-600">
                                We'll prepare your items for shipping
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        2
                                    </span>
                                </div>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">
                                Shipping
                            </h3>
                            <p className="text-gray-600">
                                Your order will be shipped within 1-2 business
                                days
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        3
                                    </span>
                                </div>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">
                                Delivery
                            </h3>
                            <p className="text-gray-600">
                                Enjoy your new products!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/">
                        <Button size="lg" className="w-full sm:w-auto">
                            <Home className="mr-2 h-5 w-5" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link to="/products">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            Continue Shopping
                        </Button>
                    </Link>
                </div>

                {/* Contact Info */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Questions about your order? Contact us at{" "}
                        <a
                            href="mailto:support@nolly.com"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            support@nolly.com
                        </a>{" "}
                        or call{" "}
                        <a
                            href="tel:+15551234567"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            +1 (555) 123-4567
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
