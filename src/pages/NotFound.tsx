import { Link } from "react-router-dom";
import { Home, Search, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant border-0 animate-scale-in">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="animate-float mb-8">
            <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
          </div>
          
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          
          <div className="flex gap-3">
            <Link to="/dashboard">
              <Button className="btn-primary">
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Lost? Try searching for what you need from the dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
