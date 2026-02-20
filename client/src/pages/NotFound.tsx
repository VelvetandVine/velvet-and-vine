import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <Button
          onClick={() => setLocation("/") as any}
          className="bg-pink-600 hover:bg-pink-700"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
