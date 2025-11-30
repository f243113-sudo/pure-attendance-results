import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus, GraduationCap, UserCheck } from "lucide-react";
import { getUsers, createUser, deleteUser, UserRole } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState(getUsers());
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "student" as UserRole,
    class: "",
    subject: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser = createUser({
      name: formData.name,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      class: formData.role === "student" ? formData.class : undefined,
      subject: formData.role === "teacher" ? formData.subject : undefined,
    });

    setUsers(getUsers());
    setFormData({ name: "", username: "", password: "", role: "student", class: "", subject: "" });
    
    toast({
      title: "User Created",
      description: `${newUser.name} has been successfully registered.`,
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (id === "1") {
      toast({
        title: "Cannot Delete",
        description: "The admin account cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    deleteUser(id);
    setUsers(getUsers());
    toast({
      title: "User Deleted",
      description: `${name} has been removed from the system.`,
    });
  };

  const roleColors: Record<UserRole, string> = {
    admin: "bg-destructive/10 text-destructive",
    teacher: "bg-success/10 text-success",
    student: "bg-primary/10 text-primary",
  };

  return (
    <DashboardLayout title="Manage Users">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create User Form */}
        <Card className="lg:col-span-1 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Create New User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={formData.class}
                    onValueChange={(value) => setFormData({ ...formData, class: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10-A">10-A</SelectItem>
                      <SelectItem value="10-B">10-B</SelectItem>
                      <SelectItem value="11-A">11-A</SelectItem>
                      <SelectItem value="11-B">11-B</SelectItem>
                      <SelectItem value="12-A">12-A</SelectItem>
                      <SelectItem value="12-B">12-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.role === "teacher" && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Mathematics"
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full gradient-primary text-primary-foreground">
                Create User
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            user.role === "student" ? "bg-primary/20" : "bg-success/20"
                          }`}>
                            {user.role === "student" ? (
                              <GraduationCap className="h-4 w-4 text-primary" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-success" />
                            )}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">@{user.username}</TableCell>
                      <TableCell>
                        <Badge className={roleColors[user.role]} variant="secondary">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.class || user.subject || "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={user.id === "1"}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
