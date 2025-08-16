import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Headphones } from "lucide-react";
import { Button } from "../../components/ui/button";

export function HomePage() {
    const features = [
        {
            icon: Truck,
            title: "Free Shipping",
            description: "Free shipping on orders over $50",
        },
        {
            icon: Shield,
            title: "Secure Payment",
            description: "Your payment information is safe with us",
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            description: "Get help whenever you need it",
        },
    ];

    return (
        <div className="">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Welcome to Nolly
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Discover amazing products at unbeatable prices
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/products">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-gray-100"
                                >
                                    Shop Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Why Choose Nolly?
                        </h2>
                        <p className="text-lg text-gray-600">
                            We're committed to providing you with the best
                            shopping experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <feature.icon className="h-8 w-8 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Start Shopping?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Browse our collection of high-quality products
                    </p>
                    <Link to="/products">
                        <Button size="lg">
                            View All Products
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
