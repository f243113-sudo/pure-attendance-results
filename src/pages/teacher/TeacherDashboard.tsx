import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCheck, FileText, ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { getUsersByRole, getAttendance, getResults, getCurrentUser } from "@/lib/storage";

export default function TeacherDashboard() {
  const currentUser = getCurrentUser();
  const students = getUsersByRole("student");
  const attendance = getAttendance();
  const results = getResults();

  const myAttendance = attendance.filter(a => a.markedBy === currentUser?.id);
  const myResults = results.filter(r => r.uploadedBy === currentUser?.id);

  const todayDate = new Date().toISOString().split("T")[0];
  const todayAttendance = myAttendance.filter(a => a.date === todayDate);

  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="mb-6">
        <p className="text-muted-foreground">
          Welcome back, <span className="font-medium text-foreground">{currentUser?.name}</span>! 
          You teach <span className="font-medium text-primary">{currentUser?.subject}</span>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={Users}
          variant="primary"
          description="In the system"
        />
        <StatCard
          title="Today's Attendance"
          value={todayAttendance.length}
          icon={ClipboardCheck}
          variant="success"
          description="Marked today"
        />
        <StatCard
          title="Results Uploaded"
          value={myResults.length}
          icon={FileText}
          variant="warning"
          description="By you"
        />
      </div>

      <div className="grid gap-6 mt-8 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/teacher/attendance" className="block">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                    <ClipboardCheck className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Mark Attendance</p>
                    <p className="text-sm text-muted-foreground">Record daily student attendance</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/teacher/results" className="block">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Upload Results</p>
                    <p className="text-sm text-muted-foreground">Enter marks and grades for students</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Student List */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Students Overview</CardTitle>
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
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No students found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
