import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, FileText, TrendingUp, ArrowRight, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  getCurrentUser, 
  getStudentResults, 
  calculateAttendancePercentage,
  calculateTotalAndGrade 
} from "@/lib/storage";

export default function StudentDashboard() {
  const currentUser = getCurrentUser();
  const results = currentUser ? getStudentResults(currentUser.id) : [];
  const attendancePercentage = currentUser ? calculateAttendancePercentage(currentUser.id) : 0;
  const { percentage: resultPercentage, grade } = calculateTotalAndGrade(results);

  const getGradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "text-success";
    if (grade === "B") return "text-primary";
    if (grade === "C") return "text-warning";
    return "text-destructive";
  };

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="mb-6">
        <p className="text-muted-foreground">
          Welcome back, <span className="font-medium text-foreground">{currentUser?.name}</span>! 
          You are in <span className="font-medium text-primary">Class {currentUser?.class}</span>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Attendance"
          value={`${attendancePercentage}%`}
          icon={ClipboardCheck}
          variant={attendancePercentage >= 75 ? "success" : "warning"}
          description={attendancePercentage >= 75 ? "Good standing" : "Needs improvement"}
        />
        <StatCard
          title="Overall Grade"
          value={grade || "N/A"}
          icon={Award}
          variant="primary"
          description={results.length > 0 ? `${resultPercentage}% average` : "No results yet"}
        />
        <StatCard
          title="Subjects"
          value={results.length}
          icon={FileText}
          description="Results available"
        />
      </div>

      <div className="grid gap-6 mt-8 lg:grid-cols-2">
        {/* Quick Overview */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Attendance</span>
                <span className={`font-medium ${attendancePercentage >= 75 ? "text-success" : "text-warning"}`}>
                  {attendancePercentage}%
                </span>
              </div>
              <Progress 
                value={attendancePercentage} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Academic Performance</span>
                <span className={`font-medium ${getGradeColor(grade)}`}>
                  {resultPercentage}%
                </span>
              </div>
              <Progress 
                value={resultPercentage} 
                className="h-2"
              />
            </div>

            {results.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Recent Subjects</span>
                </div>
                <div className="grid gap-2">
                  {results.slice(0, 3).map((result, index) => (
                    <div key={index} className="flex justify-between text-sm p-2 rounded bg-muted/50">
                      <span>{result.subject}</span>
                      <span className="font-medium">{result.marks}/{result.maxMarks}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/student/attendance" className="block">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                    <ClipboardCheck className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">View Attendance</p>
                    <p className="text-sm text-muted-foreground">Check your attendance record</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/student/results" className="block">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">View Results</p>
                    <p className="text-sm text-muted-foreground">Check your exam results and grades</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
