import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, UserCheck, ClipboardCheck } from "lucide-react";
import { getUsersByRole, getAttendance, getResults } from "@/lib/storage";

export default function AdminDashboard() {
  const teachers = getUsersByRole("teacher");
  const students = getUsersByRole("student");
  const attendance = getAttendance();
  const results = getResults();

  const todayAttendance = attendance.filter(
    a => a.date === new Date().toISOString().split("T")[0]
  );

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={GraduationCap}
          variant="primary"
          description="Registered students"
        />
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          icon={UserCheck}
          variant="success"
          description="Active teachers"
        />
        <StatCard
          title="Today's Attendance"
          value={todayAttendance.length}
          icon={ClipboardCheck}
          variant="warning"
          description="Records marked today"
        />
        <StatCard
          title="Total Results"
          value={results.length}
          icon={Users}
          description="Results uploaded"
        />
      </div>

      <div className="grid gap-6 mt-8 lg:grid-cols-2">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Recent Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teachers.slice(0, 5).map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">@{teacher.username}</span>
                </div>
              ))}
              {teachers.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No teachers registered</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Recent Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.slice(0, 5).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Class {student.class}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">@{student.username}</span>
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No students registered</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
