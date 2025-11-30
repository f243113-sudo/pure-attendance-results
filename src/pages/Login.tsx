import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, Lock, AlertCircle } from "lucide-react";
import { login, initializeStorage, getCurrentUser } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeStorage();
    const user = getCurrentUser();
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = login(username, password);
    
    if (user) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      navigate(`/${user.role}`);
    } else {
      setError("Invalid username or password");
      toast({
        title: "Invalid Login",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">EduPortal</h1>
          <p className="text-muted-foreground mt-2">Student Attendance & Result Portal</p>
        </div>

        <Card className="border-border/50 shadow-lg animate-fade-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
              <div className="grid gap-1 text-xs text-muted-foreground">
                <p><span className="font-medium">Admin:</span> admin / admin123</p>
                <p><span className="font-medium">Teacher:</span> teacher1 / teacher123</p>
                <p><span className="font-medium">Student:</span> student1 / student123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
