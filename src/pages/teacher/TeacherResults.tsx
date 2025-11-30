import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { FileText, Upload, GraduationCap } from "lucide-react";
import { 
  getUsersByRole, 
  saveResult, 
  getCurrentUser, 
  getStudentResults,
  calculateGrade,
  ResultRecord 
} from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export default function TeacherResults() {
  const currentUser = getCurrentUser();
  const students = getUsersByRole("student");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [subject, setSubject] = useState(currentUser?.subject || "");
  const [marks, setMarks] = useState<string>("");
  const [maxMarks, setMaxMarks] = useState<string>("100");

  const selectedStudentData = students.find(s => s.id === selectedStudent);
  const studentResults = selectedStudent ? getStudentResults(selectedStudent) : [];

  const handleUpload = () => {
    if (!selectedStudent || !subject || !marks || !maxMarks) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const marksNum = parseInt(marks);
    const maxMarksNum = parseInt(maxMarks);

    if (marksNum > maxMarksNum) {
      toast({
        title: "Invalid Marks",
        description: "Marks cannot exceed maximum marks.",
        variant: "destructive",
      });
      return;
    }

    const result: ResultRecord = {
      studentId: selectedStudent,
      subject,
      marks: marksNum,
      maxMarks: maxMarksNum,
      uploadedBy: currentUser?.id || "",
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    saveResult(result);
    
    toast({
      title: "Marks Uploaded",
      description: `${subject} marks for ${selectedStudentData?.name} have been saved.`,
    });

    setMarks("");
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "bg-success/10 text-success";
    if (grade === "B") return "bg-primary/10 text-primary";
    if (grade === "C") return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <DashboardLayout title="Upload Results">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Form */}
        <Card className="lg:col-span-1 animate-fade-in h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Enter Marks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.class})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marks Obtained</Label>
                <Input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="85"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Marks</Label>
                <Input
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  placeholder="100"
                  min="1"
                />
              </div>
            </div>

            {marks && maxMarks && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Percentage:</span>
                  <span className="font-medium">
                    {Math.round((parseInt(marks) / parseInt(maxMarks)) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Grade:</span>
                  <Badge className={getGradeColor(calculateGrade(Math.round((parseInt(marks) / parseInt(maxMarks)) * 100)))}>
                    {calculateGrade(Math.round((parseInt(marks) / parseInt(maxMarks)) * 100))}
                  </Badge>
                </div>
              </div>
            )}

            <Button 
              onClick={handleUpload} 
              className="w-full gradient-primary text-primary-foreground"
              disabled={!selectedStudent || !subject || !marks}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Marks
            </Button>
          </CardContent>
        </Card>

        {/* Results Preview */}
        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {selectedStudentData ? `${selectedStudentData.name}'s Results` : "Student Results"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedStudent ? (
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a student to view and upload results</p>
              </div>
            ) : studentResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for this student</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Marks</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentResults.map((result, index) => {
                    const percentage = Math.round((result.marks / result.maxMarks) * 100);
                    const grade = calculateGrade(percentage);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{result.subject}</TableCell>
                        <TableCell className="text-center">
                          {result.marks} / {result.maxMarks}
                        </TableCell>
                        <TableCell className="text-center">{percentage}%</TableCell>
                        <TableCell className="text-center">
                          <Badge className={getGradeColor(grade)}>{grade}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
