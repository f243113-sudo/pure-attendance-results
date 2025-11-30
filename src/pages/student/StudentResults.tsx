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
import { Award, FileText, TrendingUp } from "lucide-react";
import { 
  getCurrentUser, 
  getStudentResults, 
  calculateTotalAndGrade,
  calculateGrade
} from "@/lib/storage";

export default function StudentResults() {
  const currentUser = getCurrentUser();
  const results = currentUser ? getStudentResults(currentUser.id) : [];
  const { total, maxTotal, percentage, grade } = calculateTotalAndGrade(results);

  const getGradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "bg-success/10 text-success";
    if (grade === "B") return "bg-primary/10 text-primary";
    if (grade === "C") return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  };

  const getGradeTextColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "text-success";
    if (grade === "B") return "text-primary";
    if (grade === "C") return "text-warning";
    return "text-destructive";
  };

  return (
    <DashboardLayout title="My Results">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary Cards */}
        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getGradeColor(grade)}`}>
                <Award className={`h-7 w-7 ${getGradeTextColor(grade)}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Grade</p>
                <p className={`text-3xl font-bold ${getGradeTextColor(grade)}`}>
                  {grade || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Percentage</p>
                <p className="text-3xl font-bold text-primary">{percentage}%</p>
              </div>
            </div>
            <Progress value={percentage} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                <FileText className="h-7 w-7 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="text-3xl font-bold text-foreground">
                  {total}<span className="text-lg text-muted-foreground">/{maxTotal}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="mt-6 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Subject-wise Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No results found</p>
              <p className="text-sm mt-2">Your results will appear here once uploaded by teachers</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Marks Obtained</TableHead>
                  <TableHead className="text-center">Max Marks</TableHead>
                  <TableHead className="text-center">Percentage</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => {
                  const subjectPercentage = Math.round((result.marks / result.maxMarks) * 100);
                  const subjectGrade = calculateGrade(subjectPercentage);
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.subject}</TableCell>
                      <TableCell className="text-center font-medium">{result.marks}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{result.maxMarks}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Progress value={subjectPercentage} className="w-20 h-2" />
                          <span className="text-sm font-medium">{subjectPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getGradeColor(subjectGrade)}>{subjectGrade}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Total Row */}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-center">{total}</TableCell>
                  <TableCell className="text-center">{maxTotal}</TableCell>
                  <TableCell className="text-center">{percentage}%</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getGradeColor(grade)}>{grade}</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
