import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2 } from "lucide-react";

interface Inquiry {
  id: number;
  vendorId: number;
  vendorName: string;
  message: string;
  date: string;
  status: "pending" | "responded" | "booked" | "declined";
}

interface MyInquiriesProps {
  onNavigate: (page: "home") => void;
}

export default function MyInquiries({ onNavigate }: MyInquiriesProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("inquiries");
    if (saved) {
      setInquiries(JSON.parse(saved));
    }
  }, []);

  const handleDeleteInquiry = (id: number) => {
    const updated = inquiries.filter((i) => i.id !== id);
    setInquiries(updated);
    localStorage.setItem("inquiries", JSON.stringify(updated));
  };

  const handleUpdateStatus = (id: number, newStatus: string) => {
    const updated = inquiries.map((i) =>
      i.id === id ? { ...i, status: newStatus as any } : i
    );
    setInquiries(updated);
    localStorage.setItem("inquiries", JSON.stringify(updated));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
        return "bg-blue-100 text-blue-800";
      case "booked":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="p-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-pink-600">My Inquiries</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{inquiry.vendorName}</h3>
                    <p className="text-sm text-gray-600">{inquiry.date}</p>
                  </div>
                  <Badge className={getStatusColor(inquiry.status)}>
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-4">{inquiry.message}</p>

                <div className="flex gap-2">
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="responded">Responded</option>
                    <option value="booked">Booked</option>
                    <option value="declined">Declined</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteInquiry(inquiry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No inquiries yet</p>
            <p className="text-gray-500 mb-6">
              Start by browsing vendors and sending inquiries
            </p>
            <Button
              onClick={() => onNavigate("home")}
              className="bg-pink-600 hover:bg-pink-700"
            >
              Browse Vendors
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
