import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, Loader2, FileText } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

// Define the document status interface
interface DocumentStatus {
  name: string
  required: boolean
  submitted: boolean
}

interface Application {
  id: string
  studentName: string
  email: string
  phone: string
  program: string
  status: string
  submittedAt: string
  documents: DocumentStatus[]
  previousSchool?: string
  gender?: string
  avatar: string
  birthDate?: string
  address?: string
}

// Mock data for applications
const mockApplications: Application[] = [
  {
    id: "APP001",
    studentName: "John Smith",
    email: "john.smith@example.com",
    phone: "123-456-7890",
    program: "Computer Science",
    status: "PENDING",
    submittedAt: "2025-05-01T10:30:00Z",
    documents: [
      { name: "Transcript", required: true, submitted: true },
      { name: "ID", required: true, submitted: true },
      { name: "Recommendation Letter", required: false, submitted: true },
    ],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "APP002",
    studentName: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "234-567-8901",
    program: "Business Administration",
    status: "APPROVED",
    submittedAt: "2025-05-02T09:15:00Z",
    documents: [
      { name: "Transcript", required: true, submitted: true },
      { name: "ID", required: true, submitted: true },
      { name: "Birth Certificate", required: true, submitted: false },
    ],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "APP003",
    studentName: "David Johnson",
    email: "david.johnson@example.com",
    phone: "345-678-9012",
    program: "Engineering",
    status: "REJECTED",
    submittedAt: "2025-05-03T14:45:00Z",
    documents: [
      { name: "Transcript", required: true, submitted: true },
      { name: "ID", required: true, submitted: true },
      { name: "Portfolio", required: false, submitted: true },
    ],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "APP004",
    studentName: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "456-789-0123",
    program: "Psychology",
    status: "PENDING",
    submittedAt: "2025-05-04T11:20:00Z",
    documents: [
      { name: "Transcript", required: true, submitted: true },
      { name: "ID", required: true, submitted: true },
      { name: "Essay", required: false, submitted: true },
      { name: "Birth Certificate", required: true, submitted: false },
    ],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "APP005",
    studentName: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "567-890-1234",
    program: "Medicine",
    status: "PENDING",
    submittedAt: "2025-05-05T16:10:00Z",
    documents: [
      { name: "Transcript", required: true, submitted: false },
      { name: "ID", required: true, submitted: true },
      { name: "Medical Certificate", required: true, submitted: false },
    ],
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const ApplicationRegistration = () => {
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false)
  const [isViewApplicationOpen, setIsViewApplicationOpen] = useState(false)
  const [isEditApplicationOpen, setIsEditApplicationOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [newApplication, setNewApplication] = useState({
    studentName: "",
    email: "",
    phone: "",
    program: "Computer Science",
    address: "",
    birthDate: "",
    gender: "",
    previousSchool: "",
    documents: [
      { name: "Transcript of Records", required: true, submitted: false },
      { name: "Valid ID", required: true, submitted: false },
      { name: "Birth Certificate", required: true, submitted: false },
      { name: "Medical Certificate", required: false, submitted: false }
    ] as DocumentStatus[]
  })

  const applicationsPerPage = 5

  // Filter applications based on search term and status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All" || app.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const indexOfLastApplication = currentPage * applicationsPerPage
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication)
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage)

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber)
  }

  const handleAddApplication = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const newId = `APP${(applications.length + 1).toString().padStart(3, '0')}`
      const newApplicationData = {
        ...newApplication,
        id: newId,
        status: "PENDING",
        submittedAt: new Date().toISOString(),
        avatar: "/placeholder.svg?height=40&width=40"
      }
      
      setApplications([...applications, newApplicationData])
      setIsAddApplicationOpen(false)
      resetForm()
      setIsLoading(false)
    }, 1000)
  }

  const handleEditApplication = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedApplications = applications.map((app) =>
        app.id === selectedApplication?.id ? { ...app, ...newApplication } : app,
      )

      setApplications(updatedApplications)
      setIsEditApplicationOpen(false)
      resetForm()
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteApplication = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedApplications = applications.filter((app) => app.id !== selectedApplication?.id)
      setApplications(updatedApplications)
      setIsConfirmationOpen(false)
      setIsLoading(false)
    }, 1000)
  }

  const resetForm = () => {
    setNewApplication({
      studentName: "",
      email: "",
      phone: "",
      program: "Computer Science",
      address: "",
      birthDate: "",
      gender: "",
      previousSchool: "",
      documents: [
        { name: "Transcript of Records", required: true, submitted: false },
        { name: "Valid ID", required: true, submitted: false },
        { name: "Birth Certificate", required: true, submitted: false },
        { name: "Medical Certificate", required: false, submitted: false }
      ]
    })
  }

  const openViewModal = (application: Application) => {
    setSelectedApplication(application)
    setIsViewApplicationOpen(true)
  }

  const openEditModal = (application: Application) => {
    setSelectedApplication(application)
    setNewApplication({
      studentName: application.studentName,
      email: application.email,
      phone: application.phone,
      program: application.program,
      address: application.address || "",
      birthDate: application.birthDate || "",
      gender: application.gender || "",
      previousSchool: application.previousSchool || "",
      documents: application.documents || [],
    })
    setIsEditApplicationOpen(true)
  }

  const openConfirmationModal = (application: Application) => {
    setSelectedApplication(application)
    setIsConfirmationOpen(true)
  }

  const statusOptions = ["All", "PENDING", "APPROVED", "REJECTED"]
  const programOptions = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Psychology",
    "Medicine",
    "Education",
  ]

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  return (
    <div className="space-y-6">
      {/* Header and Add Application Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Application & Registration</h2>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down application list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
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

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Applications</CardTitle>
              <CardDescription>{filteredApplications.length} applications found</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={application.avatar || "/placeholder.svg"} alt="avatar" />
                        <AvatarFallback>{application.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{application.studentName}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.program}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        application.status === "APPROVED"
                          ? "default"
                          : application.status === "REJECTED"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(application.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => openViewModal(application)}>
                          <Eye size={16} />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => openEditModal(application)}>
                          <Edit size={16} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-red-600"
                          onClick={() => openConfirmationModal(application)}
                        >
                          <Trash2 size={16} />
                          Delete
                        </DropdownMenuItem>
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
            Showing {Math.min((currentPage - 1) * applicationsPerPage + 1, filteredApplications.length)} to{" "}
            {Math.min(currentPage * applicationsPerPage, filteredApplications.length)} of {filteredApplications.length}{" "}
            applications
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

      {/* Add Application Modal */}
      <Dialog
        open={isAddApplicationOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm()
          }
          setIsAddApplicationOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>New Application</DialogTitle>
            <DialogDescription>Fill in the details to create a new student application.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAddApplication()
            }}
          >
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="academic">Academic Info</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="studentName"
                      value={newApplication.studentName}
                      onChange={(e) => setNewApplication({ ...newApplication, studentName: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newApplication.email}
                      onChange={(e) => setNewApplication({ ...newApplication, email: e.target.value })}
                      placeholder="student@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      value={newApplication.phone}
                      onChange={(e) => setNewApplication({ ...newApplication, phone: e.target.value })}
                      placeholder="123-456-7890"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={newApplication.birthDate}
                      onChange={(e) => setNewApplication({ ...newApplication, birthDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={newApplication.gender}
                    onValueChange={(value) => setNewApplication({ ...newApplication, gender: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    value={newApplication.address}
                    onChange={(e) => setNewApplication({ ...newApplication, address: e.target.value })}
                    placeholder="Enter your full address"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="program">
                    Program <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newApplication.program}
                    onValueChange={(value) => setNewApplication({ ...newApplication, program: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programOptions.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousSchool">
                    Previous School <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="previousSchool"
                    value={newApplication.previousSchool}
                    onChange={(e) => setNewApplication({ ...newApplication, previousSchool: e.target.value })}
                    placeholder="Enter previous school name"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Required Documents</Label>
                  <div className="grid gap-2">
                    {newApplication.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span>{doc.name}</span>
                          <Badge variant={doc.required ? "default" : "outline"} className="ml-2">
                            {doc.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`doc-${index}`} className={`text-sm ${doc.submitted ? "text-green-600 font-medium" : "text-gray-500"}`}>
                            {doc.submitted ? "Submitted" : "Not Submitted"}
                          </Label>
                          <Switch
                            id={`doc-${index}`}
                            checked={doc.submitted}
                            onCheckedChange={(checked) => {
                              const updatedDocs = [...newApplication.documents];
                              updatedDocs[index] = { ...doc, submitted: checked };
                              setNewApplication({ ...newApplication, documents: updatedDocs });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Toggle the switches for documents that have already been submitted.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddApplicationOpen(false)
                  resetForm()
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Submit Application
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Application Modal */}
      <Dialog
        open={isViewApplicationOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplication(null)
          }
          setIsViewApplicationOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>View detailed information about this application.</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedApplication.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedApplication.studentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedApplication.studentName}</h3>
                  <p className="text-sm text-gray-500">{selectedApplication.email}</p>
                  <p className="text-sm text-gray-500">{selectedApplication.phone}</p>
                </div>
                <Badge
                  className="ml-auto"
                  variant={
                    selectedApplication.status === "APPROVED"
                      ? "default"
                      : selectedApplication.status === "REJECTED"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {selectedApplication.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label className="text-gray-500">Application ID</Label>
                  <p>{selectedApplication.id}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Submitted Date</Label>
                  <p>{new Date(selectedApplication.submittedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Program</Label>
                  <p>{selectedApplication.program}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-500">Documents</Label>
                <div className="grid gap-2 mt-2">
                  {selectedApplication.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span>{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={doc.required ? "default" : "outline"} className="mr-2">
                          {doc.required ? "Required" : "Optional"}
                        </Badge>
                        <Badge variant={doc.submitted ? "default" : "destructive"}>
                          {doc.submitted ? "Submitted" : "Missing"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <div>
                  {selectedApplication.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm">
                        Reject
                      </Button>
                      <Button variant="default" size="sm">
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
                <Button variant="outline" onClick={() => setIsViewApplicationOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Application Modal - Similar to Add but with pre-filled data */}
      <Dialog
        open={isEditApplicationOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplication(null)
            resetForm()
          }
          setIsEditApplicationOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>Update application details.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleEditApplication()
            }}
          >
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="academic">Academic Info</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-studentName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-studentName"
                      value={newApplication.studentName}
                      onChange={(e) => setNewApplication({ ...newApplication, studentName: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={newApplication.email}
                      onChange={(e) => setNewApplication({ ...newApplication, email: e.target.value })}
                      placeholder="student@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-phone"
                      value={newApplication.phone}
                      onChange={(e) => setNewApplication({ ...newApplication, phone: e.target.value })}
                      placeholder="123-456-7890"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-birthDate">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-birthDate"
                      type="date"
                      value={newApplication.birthDate}
                      onChange={(e) => setNewApplication({ ...newApplication, birthDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={newApplication.gender}
                    onValueChange={(value) => setNewApplication({ ...newApplication, gender: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="edit-male" />
                      <Label htmlFor="edit-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="edit-female" />
                      <Label htmlFor="edit-female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="edit-other" />
                      <Label htmlFor="edit-other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-address">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="edit-address"
                    value={newApplication.address}
                    onChange={(e) => setNewApplication({ ...newApplication, address: e.target.value })}
                    placeholder="Enter your full address"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-program">
                    Program <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newApplication.program}
                    onValueChange={(value) => setNewApplication({ ...newApplication, program: value })}
                  >
                    <SelectTrigger id="edit-program">
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programOptions.map((program) => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-previousSchool">
                    Previous School <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-previousSchool"
                    value={newApplication.previousSchool}
                    onChange={(e) => setNewApplication({ ...newApplication, previousSchool: e.target.value })}
                    placeholder="Enter previous school name"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Required Documents</Label>
                  <div className="grid gap-2">
                    {newApplication.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span>{doc.name}</span>
                          <Badge variant={doc.required ? "default" : "outline"} className="ml-2">
                            {doc.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`edit-doc-${index}`} className={`text-sm ${doc.submitted ? "text-green-600 font-medium" : "text-gray-500"}`}>
                            {doc.submitted ? "Submitted" : "Not Submitted"}
                          </Label>
                          <Switch
                            id={`edit-doc-${index}`}
                            checked={doc.submitted}
                            onCheckedChange={(checked) => {
                              const updatedDocs = [...newApplication.documents];
                              updatedDocs[index] = { ...doc, submitted: checked };
                              setNewApplication({ ...newApplication, documents: updatedDocs });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditApplicationOpen(false)
                  resetForm()
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog
        open={isConfirmationOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplication(null)
          }
          setIsConfirmationOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteApplication} disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin mr-2" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationRegistration;
