import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, Star } from "lucide-react";

interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  image: string;
  verified: boolean;
}

const SAMPLE_VENDORS: Vendor[] = [
  {
    id: 1,
    name: "Elegant Photography",
    category: "Photography",
    rating: 4.9,
    reviews: 127,
    price: "$2,500 - $5,000",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    verified: true,
  },
  {
    id: 2,
    name: "Grand Ballroom Venue",
    category: "Venue",
    rating: 4.8,
    reviews: 89,
    price: "$3,000 - $8,000",
    location: "Manhattan, NY",
    image: "https://images.unsplash.com/photo-1519167758481-83f19106c6b6?w=400&h=300&fit=crop",
    verified: true,
  },
  {
    id: 3,
    name: "Sweet Delights Catering",
    category: "Catering",
    rating: 4.7,
    reviews: 156,
    price: "$75 - $150 per person",
    location: "Brooklyn, NY",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400&h=300&fit=crop",
    verified: true,
  },
  {
    id: 4,
    name: "Bloom & Petals Florist",
    category: "Flowers",
    rating: 4.9,
    reviews: 203,
    price: "$1,500 - $3,500",
    location: "Queens, NY",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=300&fit=crop",
    verified: true,
  },
  {
    id: 5,
    name: "Harmony Music & DJ",
    category: "Entertainment",
    rating: 4.6,
    reviews: 98,
    price: "$1,000 - $2,500",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop",
    verified: false,
  },
  {
    id: 6,
    name: "Glamour Beauty Studio",
    category: "Beauty",
    rating: 4.8,
    reviews: 142,
    price: "$200 - $500",
    location: "Manhattan, NY",
    image: "https://images.unsplash.com/photo-1487412912498-71f79b5f3569?w=400&h=300&fit=crop",
    verified: true,
  },
];

interface MarketplaceProps {
  onNavigate: (page: "home" | "vendor", vendorId?: number) => void;
}

export default function Marketplace({ onNavigate }: MarketplaceProps) {
  const [vendors] = useState<Vendor[]>(SAMPLE_VENDORS);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(SAMPLE_VENDORS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedVendors, setSavedVendors] = useState<number[]>([]);

  const categories = ["All", "Photography", "Venue", "Catering", "Flowers", "Entertainment", "Beauty"];

  useEffect(() => {
    const saved = localStorage.getItem("savedVendors");
    if (saved) {
      setSavedVendors(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let filtered = vendors;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((v) => v.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVendors(filtered);
  }, [searchTerm, selectedCategory, vendors]);

  const toggleSaveVendor = (vendorId: number) => {
    const updated = savedVendors.includes(vendorId)
      ? savedVendors.filter((id) => id !== vendorId)
      : [...savedVendors, vendorId];
    setSavedVendors(updated);
    localStorage.setItem("savedVendors", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate("home")}
              className="p-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-pink-600">Vendor Marketplace</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 w-full"
          />

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-pink-600" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Vendors Grid */}
        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <Card
                key={vendor.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveVendor(vendor.id);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        savedVendors.includes(vendor.id)
                          ? "fill-pink-600 text-pink-600"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{vendor.name}</h3>
                      <p className="text-sm text-gray-600">{vendor.category}</p>
                    </div>
                    {vendor.verified && (
                      <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(vendor.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{vendor.rating}</span>
                    <span className="text-sm text-gray-600">({vendor.reviews})</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{vendor.location}</p>
                  <p className="font-semibold text-pink-600 mb-4">{vendor.price}</p>

                  <Button
                    onClick={() => onNavigate("vendor", vendor.id)}
                    className="w-full bg-pink-600 hover:bg-pink-700"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No vendors found</p>
          </div>
        )}
      </main>
    </div>
  );
}
