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
import { Switch } from "@/components/ui/switch";
import { GraduationCap, Save, Calendar } from "lucide-react";
import { getUsersByRole, saveAttendance, getCurrentUser, AttendanceRecord } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export default function TeacherAttendance() {
  const currentUser = getCurrentUser();
  const students = getUsersByRole("student");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const filteredStudents = selectedClass 
    ? students.filter(s => s.class === selectedClass)
    : students;

  const classes = [...new Set(students.map(s => s.class).filter(Boolean))];

  const handleToggle = (studentId: string, isPresent: boolean) => {
    setAttendance(prev => ({ ...prev, [studentId]: isPresent }));
  };

  const handleSave = () => {
    if (!selectedClass) {
      toast({
        title: "Select Class",
        description: "Please select a class first.",
        variant: "destructive",
      });
      return;
    }

    const records: AttendanceRecord[] = filteredStudents.map(student => ({
      studentId: student.id,
      date: selectedDate,
      status: attendance[student.id] ? "present" : "absent",
      markedBy: currentUser?.id || "",
    }));

    saveAttendance(records);
    
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${filteredStudents.length} students has been saved.`,
    });
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = filteredStudents.length - presentCount;

  return (
    <DashboardLayout title="Mark Attendance">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters */}
        <Card className="lg:col-span-1 animate-fade-in h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Select Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls!}>
                      Class {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClass && (
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{filteredStudents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-success">Present:</span>
                  <span className="font-medium text-success">{presentCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-destructive">Absent:</span>
                  <span className="font-medium text-destructive">{absentCount}</span>
                </div>
              </div>
            )}

            <Button 
              onClick={handleSave} 
              className="w-full gradient-primary text-primary-foreground"
              disabled={!selectedClass}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Attendance
            </Button>
          </CardContent>
        </Card>

        {/* Student List */}
        <Card className="lg:col-span-3 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">
              Students {selectedClass && `- Class ${selectedClass}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedClass ? (
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Please select a class to mark attendance</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No students found in this class</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredStudents.map((student) => {
                  const isPresent = attendance[student.id] ?? true;
                  return (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        isPresent 
                          ? "bg-success/5 border-success/30" 
                          : "bg-destructive/5 border-destructive/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isPresent ? "bg-success/20" : "bg-destructive/20"
                        }`}>
                          <GraduationCap className={`h-5 w-5 ${
                            isPresent ? "text-success" : "text-destructive"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className={`text-sm ${isPresent ? "text-success" : "text-destructive"}`}>
                            {isPresent ? "Present" : "Absent"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isPresent}
                        onCheckedChange={(checked) => handleToggle(student.id, checked)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
