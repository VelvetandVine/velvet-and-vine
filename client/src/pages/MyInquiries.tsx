import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  responded: "bg-blue-100 text-blue-800",
  booked: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

export default function MyInquiries() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: inquiries, isLoading } = trpc.inquiries.getMyInquiries.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-pink-600 w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/") as any}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Please log in to view your inquiries</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/") as any}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">My Inquiries</h1>
          <p className="text-gray-600 mt-2">Track your vendor inquiries and communications</p>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-pink-600 w-8 h-8" />
          </div>
        ) : inquiries && inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map(inquiry => (
              <Card key={inquiry.id} className="bg-white hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">Vendor Inquiry #{inquiry.id}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Sent on {new Date(inquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={STATUS_COLORS[inquiry.status as keyof typeof STATUS_COLORS]}>
                      {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Your Message */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Your Message:</p>
                    <p className="text-gray-700">{inquiry.message}</p>
                  </div>

                  {/* Vendor Response */}
                  {inquiry.vendorResponse && (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Vendor Response:</p>
                      <p className="text-blue-900">{inquiry.vendorResponse}</p>
                    </div>
                  )}

                  {/* Status Messages */}
                  {inquiry.status === "pending" && (
                    <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Waiting for vendor response...
                    </div>
                  )}
                  {inquiry.status === "responded" && (
                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      The vendor has responded to your inquiry.
                    </div>
                  )}
                  {inquiry.status === "booked" && (
                    <div className="bg-green-50 p-3 rounded text-sm text-green-800">
                      ✓ You have booked this vendor!
                    </div>
                  )}
                  {inquiry.status === "declined" && (
                    <div className="bg-red-50 p-3 rounded text-sm text-red-800">
                      The vendor declined your inquiry.
                    </div>
                  )}

                  {/* Last Updated */}
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(inquiry.updatedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No inquiries yet</p>
            <p className="text-gray-500 mt-2">
              Browse the marketplace and send inquiries to vendors to get started!
            </p>
            <Button
              onClick={() => setLocation("/marketplace") as any}
              className="mt-6"
            >
              Browse Vendors
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
