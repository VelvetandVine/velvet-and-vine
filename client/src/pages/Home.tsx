import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Heart, MessageSquare, Calendar } from "lucide-react";

interface HomeProps {
  onNavigate: (page: "marketplace" | "inquiries", vendorId?: number) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-pink-600">Velvet & Vine</h1>
          <p className="text-gray-600 mt-2">Wedding Planner & Vendor Marketplace</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Plan Your Perfect Wedding
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover and book the best wedding vendors all in one place
          </p>
          <Button
            onClick={() => onNavigate("marketplace")}
            size="lg"
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg"
          >
            Browse Vendors
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <ShoppingBag className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Browse Vendors</h3>
            <p className="text-gray-600">
              Explore hundreds of wedding vendors in your area
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Save Favorites</h3>
            <p className="text-gray-600">
              Save your favorite vendors for easy access
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageSquare className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Send Inquiries</h3>
            <p className="text-gray-600">
              Contact vendors directly and track responses
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Calendar className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Plan Timeline</h3>
            <p className="text-gray-600">
              Organize your wedding planning with ease
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Find Your Vendors?</h3>
          <p className="text-lg mb-6 opacity-90">
            Start exploring our marketplace of trusted wedding professionals
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => onNavigate("marketplace")}
              className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-2"
            >
              Browse Vendors
            </Button>
            <Button
              onClick={() => onNavigate("inquiries")}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-pink-600 px-8 py-2"
            >
              My Inquiries
            </Button>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2026 Velvet & Vine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
