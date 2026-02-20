import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Heart, Store, MessageSquare } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Loader2 className="animate-spin text-pink-600 w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="text-center max-w-md">
          <Heart className="w-16 h-16 text-pink-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wedding Planner</h1>
          <p className="text-gray-600 mb-8">
            Plan your perfect wedding with ease. Browse vendors, manage your wedding details, and connect with service providers all in one place.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-600" />
            <h1 className="text-2xl font-bold text-gray-900">Wedding Planner</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                setLocation("/") as any;
              }}
              className="text-gray-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <Card className="mb-8 bg-white border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-600">Welcome to Your Wedding Planning Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Start planning your wedding by exploring our vendor marketplace, managing your guest list, and tracking your budget. Everything you need in one place!
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/marketplace") as any}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                Vendor Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                Browse and discover wedding vendors in your area. View ratings, reviews, and pricing.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Explore Vendors
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/my-inquiries") as any}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                My Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                Track your vendor inquiries and responses. Manage your communications in one place.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                View Inquiries
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Saved Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">
                Keep track of your favorite vendors. Save them for easy access later.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                View Saved
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
