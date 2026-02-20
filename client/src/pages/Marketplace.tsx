import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, DollarSign, Star, Heart, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const VENDOR_CATEGORIES = [
  "photographer",
  "videographer",
  "venue",
  "catering",
  "florist",
  "decorator",
  "dj",
  "band",
  "planner",
  "makeup",
  "transportation",
  "other",
];

export default function Marketplace() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [category, setCategory] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [location, setLocation_] = useState<string>("");

  const { data: vendors, isLoading } = trpc.marketplace.searchVendors.useQuery({
    category: category || undefined,
    keyword: keyword || undefined,
    location: location || undefined,
    limit: 50,
  });

  const { data: savedVendors } = trpc.marketplace.getSavedVendors.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const saveVendorMutation = trpc.marketplace.saveVendor.useMutation();
  const unsaveVendorMutation = trpc.marketplace.unsaveVendor.useMutation();

  const savedVendorIds = new Set(savedVendors?.map(v => v.id) || []);

  const handleToggleSave = (vendorId: number) => {
    if (savedVendorIds.has(vendorId)) {
      unsaveVendorMutation.mutate(vendorId);
    } else {
      saveVendorMutation.mutate(vendorId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-pink-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/") as any}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Marketplace</h1>
          <p className="text-gray-600 mt-2">Find and connect with the perfect vendors for your wedding</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-9">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {VENDOR_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Search vendors..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <Input
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation_(e.target.value)}
            />

            <Button
              onClick={() => {
                setCategory("");
                setKeyword("");
                setLocation_("");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-pink-600 w-8 h-8" />
          </div>
        ) : vendors && vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor: any) => (
              <Card key={vendor.id} className="bg-white hover:shadow-lg transition-shadow overflow-hidden">
                {vendor.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
                      </p>
                    </div>
                    {isAuthenticated && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleSave(vendor.id)}
                        className={savedVendorIds.has(vendor.id) ? "text-red-600" : ""}
                      >
                        <Heart className={`w-5 h-5 ${savedVendorIds.has(vendor.id) ? "fill-current" : ""}`} />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vendor.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{vendor.description}</p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{vendor.rating || "0"}</span>
                    <span className="text-sm text-gray-600">({vendor.reviewCount || 0} reviews)</span>
                  </div>

                  {/* Location */}
                  {vendor.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {vendor.location}
                    </div>
                  )}

                  {/* Price */}
                  {(vendor.priceMin || vendor.priceMax) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      {vendor.priceMin && `$${vendor.priceMin}`}
                      {vendor.priceMin && vendor.priceMax && " - "}
                      {vendor.priceMax && `$${vendor.priceMax}`}
                    </div>
                  )}

                  {/* Verification Badge */}
                  {vendor.isVerified && (
                    <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      ✓ Verified
                    </div>
                  )}

                  {/* View Details Button */}
                  <Button
                    onClick={() => setLocation(`/vendor/${vendor.id}`) as any}
                    className="w-full mt-4"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No vendors found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
