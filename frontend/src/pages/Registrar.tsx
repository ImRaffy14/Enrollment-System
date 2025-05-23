import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, Loader2, FileText } from "lucide-react"
import { 
  useStudents, 
  useUpdateStudent,
  useUpdateStudentStatus
} from "@/hooks/studentHooks"
import { format } from "date-fns"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Documents = {
  name: string
  required: boolean
  submitted: boolean
}

type Student = {
  id: string;
  studentName: string;
  email: string;
  studentId: string;
  program: string;
  status: "ENROLLED" | "PENDING" | "DROPPED";
  createdAt: string;
  academicYear: string;
  semester: string;
  documents: Documents[];
  subjects: string[];
  avatar: string;
};

type Subject = {
  code: string;
  name: string;
  units: number;
  schedule: string;
};

type EnrollmentData = {
  status: "ENROLLED" | "PENDING" | "DROPPED" | "";
  subjects: string[];
  academicYear: string;
  semester: string;
};

const mockSubjects: Subject[] = [
  { code: "CS101", name: "Introduction to Computer Science", units: 3, schedule: "MWF 9:00-10:30 AM" },
  { code: "MATH201", name: "Calculus I", units: 4, schedule: "TTh 10:30-12:00 PM" },
  { code: "ENG101", name: "English Composition", units: 3, schedule: "MWF 1:00-2:30 PM" },
  { code: "BA101", name: "Introduction to Business", units: 3, schedule: "TTh 8:00-9:30 AM" },
  { code: "ECON201", name: "Microeconomics", units: 3, schedule: "MWF 11:00-12:30 PM" },
  { code: "MKT101", name: "Principles of Marketing", units: 3, schedule: "TTh 1:00-2:30 PM" },
  { code: "PHYS201", name: "Physics I", units: 4, schedule: "MWF 8:00-9:30 AM" },
  { code: "MATH301", name: "Linear Algebra", units: 3, schedule: "TTh 3:00-4:30 PM" },
  { code: "MED101", name: "Introduction to Medicine", units: 3, schedule: "MWF 10:00-11:30 AM" },
  { code: "BIO201", name: "Human Anatomy", units: 4, schedule: "TTh 9:00-10:30 AM" },
  { code: "CHEM301", name: "Organic Chemistry", units: 4, schedule: "MWF 2:00-3:30 PM" },
]

const Registrar = () => {
  const { data: students = [], isLoading: isFetching } = useStudents()
  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent()
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateStudentStatus()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [isViewStudentOpen, setIsViewStudentOpen] = useState(false)
  const [isEditEnrollmentOpen, setIsEditEnrollmentOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
    status: "",
    subjects: [],
    academicYear: "",
    semester: "",
  })

  const studentsPerPage = 5

  // Filter students based on search term and status
  const filteredStudents = students.filter((student: any) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All" || student.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleEditEnrollment = () => {
    if (!selectedStudent) return
    
    updateStudent({
      id: selectedStudent.id,
      data: {
        status: enrollmentData.status,
        subjects: enrollmentData.subjects,
        academicYear: enrollmentData.academicYear,
        semester: enrollmentData.semester
      }
    }, {
      onSuccess: () => {
        setIsEditEnrollmentOpen(false)
        resetForm()
      }
    })
  }

  const handleDropEnrollment = () => {
    if (!selectedStudent) return
    
    updateStatus({
      id: selectedStudent.id,
      status: "DROPPED"
    }, {
      onSuccess: () => {
        setIsConfirmationOpen(false)
      }
    })
  }

  const resetForm = () => {
    setEnrollmentData({
      status: "",
      subjects: [],
      academicYear: "",
      semester: "",
    })
  }

  const openViewModal = (student: Student) => {
    setSelectedStudent(student)
    setIsViewStudentOpen(true)
  }

  const openEditModal = (student: Student) => {
    setSelectedStudent(student)
    setEnrollmentData({
      status: student.status,
      subjects: student.subjects || [],
      academicYear: student.academicYear || "2025-2026",
      semester: student.semester || "First",
    })
    setIsEditEnrollmentOpen(true)
  }

  const openConfirmationModal = (student: Student) => {
    setSelectedStudent(student)
    setIsConfirmationOpen(true)
  }

  const statusOptions = ["All", "ENROLLED", "PENDING", "DROPPED"]
  const academicYearOptions = ["2024-2025", "2025-2026", "2026-2027"]
  const semesterOptions = ["First", "Second", "Summer"]

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Registrar</h2>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down student list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-start gap-2">
                  <Filter size={16} />
                  Status: {selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statusOptions.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setSearchTerm("")
                setSelectedStatus("All")
              }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Students</CardTitle>
              <CardDescription>{filteredStudents.length} students found</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStudents.map((student: any) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} alt="avatar" />
                        <AvatarFallback>{student.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.studentName}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.program}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "ENROLLED"
                          ? "default"
                          : student.status === "DROPPED"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(student.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => openViewModal(student)}>
                          <Eye size={16} />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => openEditModal(student)}>
                          <Edit size={16} />
                          Edit Enrollment
                        </DropdownMenuItem>
                        {student.status !== "DROPPED" && (
                          <DropdownMenuItem
                            className="gap-2 text-red-600"
                            onClick={() => openConfirmationModal(student)}
                          >
                            <Trash2 size={16} />
                            Drop Enrollment
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * studentsPerPage + 1, filteredStudents.length)} to{" "}
            {Math.min(currentPage * studentsPerPage, filteredStudents.length)} of {filteredStudents.length} students
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* View Student Modal */}
      <Dialog open={isViewStudentOpen} onOpenChange={setIsViewStudentOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>View detailed information about this student.</DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedStudent.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedStudent.studentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.studentName}</h3>
                  <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                  <p className="text-sm font-medium">{selectedStudent.studentId}</p>
                </div>
                <Badge
                  className="ml-auto"
                  variant={
                    selectedStudent.status === "ENROLLED"
                      ? "default"
                      : selectedStudent.status === "DROPPED"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {selectedStudent.status}
                </Badge>
              </div>

              <Tabs defaultValue="enrollment" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="enrollment">Enrollment Info</TabsTrigger>
                  <TabsTrigger value="subjects">Enrolled Subjects</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="enrollment" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Program</Label>
                      <p className="font-medium">{selectedStudent.program}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Registration Date</Label>
                      <p className="font-medium">{format(new Date(selectedStudent.createdAt), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Academic Year</Label>
                      <p className="font-medium">{selectedStudent.academicYear}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Semester</Label>
                      <p className="font-medium">{selectedStudent.semester}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="subjects" className="space-y-4 mt-4">
                  {selectedStudent.subjects && selectedStudent.subjects.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead>Schedule</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.subjects.map((subjectCode) => {
                          const subject = mockSubjects.find((s) => s.code === subjectCode)
                          return subject ? (
                            <TableRow key={subject.code}>
                              <TableCell>{subject.code}</TableCell>
                              <TableCell>{subject.name}</TableCell>
                              <TableCell>{subject.units}</TableCell>
                              <TableCell>{subject.schedule}</TableCell>
                            </TableRow>
                          ) : null
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">No subjects enrolled</div>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Submitted Documents</Label>
                    <div className="grid gap-2">
                      {selectedStudent.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText size={16} />
                            <span>{doc.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setIsViewStudentOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Enrollment Modal */}
      <Dialog open={isEditEnrollmentOpen} onOpenChange={setIsEditEnrollmentOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Enrollment</DialogTitle>
            <DialogDescription>Update enrollment details for {selectedStudent?.studentName}.</DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleEditEnrollment()
          }}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Enrollment Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={enrollmentData.status}
                    onValueChange={(value) => setEnrollmentData({ ...enrollmentData, status: value as "ENROLLED" | "PENDING" | "DROPPED" })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENROLLED">Enrolled</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="DROPPED">Dropped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">
                    Academic Year <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={enrollmentData.academicYear}
                    onValueChange={(value) => setEnrollmentData({ ...enrollmentData, academicYear: value })}
                  >
                    <SelectTrigger id="academicYear">
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYearOptions.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">
                    Semester <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={enrollmentData.semester}
                    onValueChange={(value) => setEnrollmentData({ ...enrollmentData, semester: value })}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterOptions.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="border rounded-md p-4">
                  <div className="grid gap-2">
                    {mockSubjects.map((subject) => (
                      <div key={subject.code} className="flex items-center gap-2 p-2 border rounded-md">
                        <input
                          type="checkbox"
                          id={`subject-${subject.code}`}
                          checked={enrollmentData.subjects.includes(subject.code)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEnrollmentData({
                                ...enrollmentData,
                                subjects: [...enrollmentData.subjects, subject.code],
                              })
                            } else {
                              setEnrollmentData({
                                ...enrollmentData,
                                subjects: enrollmentData.subjects.filter((code) => code !== subject.code),
                              })
                            }
                          }}
                          className="mr-2"
                        />
                        <Label htmlFor={`subject-${subject.code}`} className="flex-1">
                          <div className="font-medium">
                            {subject.code}: {subject.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {subject.units} units | {subject.schedule}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditEnrollmentOpen(false)
                  resetForm()
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isUpdating} type="submit">
                {isUpdating && <Loader2 className="animate-spin mr-2" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Drop Enrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to drop the enrollment for {selectedStudent?.studentName}? This will remove all
              enrolled subjects.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDropEnrollment} 
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus && <Loader2 className="animate-spin mr-2" />}
              Drop Enrollment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Registrar