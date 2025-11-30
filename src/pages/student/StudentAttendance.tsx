import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Calendar, TrendingUp } from "lucide-react";
import { 
  getCurrentUser, 
  getStudentAttendance, 
  calculateAttendancePercentage 
} from "@/lib/storage";

export default function StudentAttendance() {
  const currentUser = getCurrentUser();
  const attendance = currentUser ? getStudentAttendance(currentUser.id) : [];
  const percentage = currentUser ? calculateAttendancePercentage(currentUser.id) : 0;

  const presentDays = attendance.filter(a => a.status === "present").length;
  const absentDays = attendance.filter(a => a.status === "absent").length;

  const sortedAttendance = [...attendance].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <DashboardLayout title="My Attendance">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary Cards */}
        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                percentage >= 75 ? "bg-success/20" : "bg-warning/20"
              }`}>
                <TrendingUp className={`h-7 w-7 ${
                  percentage >= 75 ? "text-success" : "text-warning"
                }`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className={`text-3xl font-bold ${
                  percentage >= 75 ? "text-success" : "text-warning"
                }`}>{percentage}%</p>
              </div>
            </div>
            <Progress value={percentage} className="mt-4 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {percentage >= 75 ? "Good standing ✓" : "Minimum 75% required"}
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present Days</p>
                <p className="text-3xl font-bold text-success">{presentDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-7 w-7 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent Days</p>
                <p className="text-3xl font-bold text-destructive">{absentDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card className="mt-6 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attendance.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No attendance records found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAttendance.map((record, index) => {
                  const date = new Date(record.date);
                  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
                  const formattedDate = date.toLocaleDateString("en-US", { 
                    year: "numeric", 
                    month: "short", 
                    day: "numeric" 
                  });
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{formattedDate}</TableCell>
                      <TableCell className="text-muted-foreground">{dayName}</TableCell>
                      <TableCell className="text-center">
                        {record.status === "present" ? (
                          <Badge className="bg-success/10 text-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Present
                          </Badge>
                        ) : (
                          <Badge className="bg-destructive/10 text-destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Absent
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
