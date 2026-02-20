import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Mail, Phone, Globe } from "lucide-react";

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
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
}

const VENDORS_DATA: Record<number, Vendor> = {
  1: {
    id: 1,
    name: "Elegant Photography",
    category: "Photography",
    rating: 4.9,
    reviews: 127,
    price: "$2,500 - $5,000",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    verified: true,
    description: "Professional wedding photography with artistic vision and attention to detail.",
    email: "hello@elegantphoto.com",
    phone: "(555) 123-4567",
    website: "www.elegantphoto.com",
  },
  2: {
    id: 2,
    name: "Grand Ballroom Venue",
    category: "Venue",
    rating: 4.8,
    reviews: 89,
    price: "$3,000 - $8,000",
    location: "Manhattan, NY",
    image: "https://images.unsplash.com/photo-1519167758481-83f19106c6b6?w=600&h=400&fit=crop",
    verified: true,
    description: "Luxurious venue with stunning architecture and world-class amenities.",
    email: "events@grandballroom.com",
    phone: "(555) 234-5678",
    website: "www.grandballroom.com",
  },
};

interface VendorDetailsProps {
  vendorId: number;
  onNavigate: (page: "marketplace" | "inquiries") => void;
}

export default function VendorDetails({ vendorId, onNavigate }: VendorDetailsProps) {
  const vendor = VENDORS_DATA[vendorId] || VENDORS_DATA[1];
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("inquiries");
    if (saved) {
      setInquiries(JSON.parse(saved));
    }
  }, []);

  const handleSendInquiry = () => {
    if (!inquiryMessage.trim()) return;

    const newInquiry = {
      id: Date.now(),
      vendorId: vendor.id,
      vendorName: vendor.name,
      message: inquiryMessage,
      date: new Date().toLocaleDateString(),
      status: "pending",
    };

    const updated = [...inquiries, newInquiry];
    setInquiries(updated);
    localStorage.setItem("inquiries", JSON.stringify(updated));
    setInquiryMessage("");
    setShowInquiryForm(false);
    alert("Inquiry sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate("marketplace")}
            className="p-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-pink-600">Vendor Details</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Vendor Image */}
        <div className="mb-8">
          <img
            src={vendor.image}
            alt={vendor.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Vendor Info */}
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold mb-2">{vendor.name}</h2>
              <p className="text-gray-600 text-lg">{vendor.category}</p>
            </div>
            {vendor.verified && (
              <Badge className="bg-blue-100 text-blue-800 text-base">Verified</Badge>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(vendor.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{vendor.rating}</span>
            <span className="text-gray-600">({vendor.reviews} reviews)</span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Price Range</p>
              <p className="text-xl font-semibold text-pink-600">{vendor.price}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Location</p>
              <p className="text-xl font-semibold">{vendor.location}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">{vendor.description}</p>

          {/* Contact Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              {vendor.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-pink-600" />
                  <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline">
                    {vendor.email}
                  </a>
                </div>
              )}
              {vendor.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-pink-600" />
                  <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:underline">
                    {vendor.phone}
                  </a>
                </div>
              )}
              {vendor.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-pink-600" />
                  <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {vendor.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => setShowInquiryForm(!showInquiryForm)}
              className="bg-pink-600 hover:bg-pink-700 flex-1"
            >
              {showInquiryForm ? "Cancel" : "Send Inquiry"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("inquiries")}
              className="flex-1"
            >
              View My Inquiries
            </Button>
          </div>
        </Card>

        {/* Inquiry Form */}
        {showInquiryForm && (
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Send Inquiry</h3>
            <textarea
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              placeholder="Tell the vendor about your needs..."
              className="w-full p-4 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-600"
              rows={5}
            />
            <Button
              onClick={handleSendInquiry}
              className="bg-pink-600 hover:bg-pink-700 w-full"
            >
              Send Inquiry
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
