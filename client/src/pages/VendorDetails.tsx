import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, DollarSign, Star, Phone, Globe, Mail, ArrowLeft, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function VendorDetails() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/vendor/:id");
  const vendorId = params?.id ? parseInt(params.id) : null;

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { data: vendor, isLoading: vendorLoading } = trpc.marketplace.getVendor.useQuery(vendorId || 0, {
    enabled: !!vendorId,
  });

  const { data: reviews } = trpc.marketplace.getVendorReviews.useQuery(vendorId || 0, {
    enabled: !!vendorId,
  });

  const { data: savedVendors } = trpc.marketplace.getSavedVendors.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createInquiryMutation = trpc.inquiries.create.useMutation({
    onSuccess: () => {
      toast.success("Inquiry sent successfully!");
      setInquiryMessage("");
      setIsInquiryOpen(false);
    },
    onError: () => {
      toast.error("Failed to send inquiry");
    },
  });

  const submitReviewMutation = trpc.marketplace.submitReview.useMutation({
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setReviewTitle("");
      setReviewContent("");
      setReviewRating(5);
      setIsReviewOpen(false);
    },
    onError: () => {
      toast.error("Failed to submit review");
    },
  });

  const saveVendorMutation = trpc.marketplace.saveVendor.useMutation();
  const unsaveVendorMutation = trpc.marketplace.unsaveVendor.useMutation();

  const isSaved = savedVendors?.some(v => v.id === vendorId);

  const handleToggleSave = () => {
    if (isSaved) {
      unsaveVendorMutation.mutate(vendorId!);
    } else {
      saveVendorMutation.mutate(vendorId!);
    }
  };

  const handleSendInquiry = () => {
    if (!inquiryMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    createInquiryMutation.mutate({
      vendorId: vendorId!,
      message: inquiryMessage,
    });
  };

  const handleSubmitReview = () => {
    if (!reviewTitle.trim() || !reviewContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    submitReviewMutation.mutate({
      vendorId: vendorId!,
      rating: reviewRating,
      title: reviewTitle,
      content: reviewContent,
    });
  };

  if (authLoading || vendorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-pink-600 w-8 h-8" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/marketplace") as any}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Vendor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/marketplace") as any}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Vendor Header */}
        <Card className="mb-6 bg-white overflow-hidden">
          {vendor.image && (
            <div className="h-64 bg-gray-200 overflow-hidden">
              <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
          )}
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl">{vendor.name}</CardTitle>
                <p className="text-lg text-gray-600 mt-2">
                  {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
                </p>
              </div>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleToggleSave}
                  className={isSaved ? "text-red-600" : ""}
                >
                  <Heart className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {vendor.description && (
              <p className="text-gray-700">{vendor.description}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-xl font-semibold">{vendor.rating || "0"}</span>
              <span className="text-gray-600">({vendor.reviewCount || 0} reviews)</span>
            </div>

            {/* Verification Badge */}
            {vendor.isVerified && (
              <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Verified Vendor
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
              {vendor.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{vendor.location}</p>
                  </div>
                </div>
              )}

              {(vendor.priceMin || vendor.priceMax) && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Price Range</p>
                    <p className="font-medium">
                      {vendor.priceMin && `$${vendor.priceMin}`}
                      {vendor.priceMin && vendor.priceMax && " - "}
                      {vendor.priceMax && `$${vendor.priceMax}`}
                    </p>
                  </div>
                </div>
              )}

              {vendor.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{vendor.phone}</p>
                  </div>
                </div>
              )}

              {vendor.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{vendor.email}</p>
                  </div>
                </div>
              )}

              {vendor.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isAuthenticated && (
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1">Send Inquiry</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Inquiry to {vendor.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Tell the vendor about your wedding and what you're looking for..."
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        rows={5}
                      />
                      <Button
                        onClick={handleSendInquiry}
                        disabled={createInquiryMutation.isPending}
                        className="w-full"
                      >
                        {createInquiryMutation.isPending ? "Sending..." : "Send Inquiry"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">Leave Review</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Leave a Review for {vendor.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating (1-5 stars)</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="text-2xl"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= reviewRating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <Input
                        placeholder="Review title"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                      />
                      <Textarea
                        placeholder="Share your experience..."
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        rows={4}
                      />
                      <Button
                        onClick={handleSubmitReview}
                        disabled={submitReviewMutation.isPending}
                        className="w-full"
                      >
                        {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Customer Reviews ({reviews?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
