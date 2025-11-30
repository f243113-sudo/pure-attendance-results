import { ReactNode } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  FileText,
  GraduationCap
} from "lucide-react";
import { getCurrentUser, logout, UserRole } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const roleNavItems: Record<UserRole, { label: string; path: string; icon: typeof LayoutDashboard }[]> = {
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Manage Users", path: "/admin/users", icon: Users },
  ],
  teacher: [
    { label: "Dashboard", path: "/teacher", icon: LayoutDashboard },
    { label: "Attendance", path: "/teacher/attendance", icon: ClipboardCheck },
    { label: "Results", path: "/teacher/results", icon: FileText },
  ],
  student: [
    { label: "Dashboard", path: "/student", icon: LayoutDashboard },
    { label: "Attendance", path: "/student/attendance", icon: ClipboardCheck },
    { label: "Results", path: "/student/results", icon: FileText },
  ],
};

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    navigate("/");
    return null;
  }

  const navItems = roleNavItems[user.role];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">EduPortal</h1>
              <p className="text-xs text-muted-foreground capitalize">{user.role} Dashboard</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden sticky top-16 z-40 flex overflow-x-auto border-b bg-card px-4 py-2 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground animate-fade-in">{title}</h2>
        </div>
        {children}
      </main>
    </div>
  );
}
