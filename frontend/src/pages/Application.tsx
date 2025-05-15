import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, Edit, Eye, Loader2, FileText, Check, X } from "lucide-react"

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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getStudentApplications, editStudentApplication } from "@/api/studentApplication"


interface Document {
  name: string
  required: boolean
  submitted: boolean
}

interface Application {
  id: string;
  appId: string;
  studentName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  gender: string;
  status: string;
  educationLevel: string;
  program: string;
  documents: Document[];
  createdAt: string;
  avatar?: string;
  previousSchool?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  personalStatement?: string;
}

const ApplicationRegistration = () => {  
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddApplicationOpen, setIsAddApplicationOpen] = useState(false)
  const [isViewApplicationOpen, setIsViewApplicationOpen] = useState(false)
  const [isEditApplicationOpen, setIsEditApplicationOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  const { data: applications, isLoading } = useQuery<Application[], Error>({
    queryKey: ["applications"],
    queryFn: getStudentApplications,
    staleTime: 60000,
    gcTime: 300000,
  })

  const editMutation = useMutation({
    mutationFn: ({ data, id }: { data: Partial<Application>, id: string }) => 
      editStudentApplication(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const [newApplication, setNewApplication] = useState({
    appId: "",
    studentName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    program: "",
    previousSchool: "",
    educationLevel: "",
    personalStatement: "",
    documents: [
      { name: "Transcript", required: true, submitted: false },
      { name: "ID", required: true, submitted: false },
      { name: "Recommendation Letter", required: false, submitted: false },
    ],
    status: "PENDING"
  })

  const applicationsPerPage = 5

  // Filter applications based on search term and status
  const filteredApplications = applications?.filter((app) => {
    const matchesSearch =
      (app.firstName?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (app.email?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (app.appId?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All" || app.status === selectedStatus

    return matchesSearch && matchesStatus
  }) ?? []

  // Pagination logic
  const indexOfLastApplication = currentPage * applicationsPerPage
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication)
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleAddApplication = () => {
    // Simulate API call
    setTimeout(() => {
      setIsAddApplicationOpen(false)
      resetForm()
    }, 1000)
  }

  const handleEditApplication = () => {
    if (!selectedApplication) return

    editMutation.mutate({
      id: selectedApplication.id,
      data: {
        ...newApplication,
        studentName: `${newApplication.firstName} ${newApplication.lastName}`,
        status: newApplication.status
      }
    });

    setIsEditApplicationOpen(false)
    resetForm()
  }

  const handleStatusChange = (status: string) => {
    setNewApplication(prev => ({
      ...prev,
      status: status
    }));
  }

  const handleDeleteApplication = () => {
    // Simulate API call
    setTimeout(() => {
      setIsConfirmationOpen(false)
    }, 1000)
  }

  const resetForm = () => {
    setNewApplication({
      appId: "",
      studentName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      program: "",
      previousSchool: "",
      educationLevel: "",
      personalStatement: "",
      documents: [
        { name: "Transcript", required: true, submitted: false },
        { name: "ID", required: true, submitted: false },
        { name: "Recommendation Letter", required: false, submitted: false },
      ],
      status: "PENDING"
    })
  }

  const openViewModal = (application: Application) => {
    setSelectedApplication(application)
    setIsViewApplicationOpen(true)
  }

  const openEditModal = (application: Application) => {
    setSelectedApplication(application)
    setNewApplication({
      appId: application.appId || "",
      studentName: application.studentName || "",
      firstName: application.firstName || "",
      lastName: application.lastName || "",
      email: application.email || "",
      phone: application.phone || "",
      birthDate: application.birthDate || "",
      gender: application.gender || "",
      address: application.address || "",
      city: application.city || "",
      state: application.state || "",
      zipCode: application.zipCode || "",
      country: application.country || "",
      program: application.program || "",
      previousSchool: application.previousSchool || "",
      educationLevel: application.educationLevel || "",
      personalStatement: application.personalStatement || "",
      documents: application.documents || [
        { name: "Transcript", required: true, submitted: false },
        { name: "ID", required: true, submitted: false },
        { name: "Recommendation Letter", required: false, submitted: false },
      ],
      status: application.status || "PENDING",
    })
    setIsEditApplicationOpen(true)
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
                  <TableCell>{application.appId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={application.avatar || "/placeholder.svg"} alt="avatar" />
                        <AvatarFallback>{application.firstName?.charAt(0) || "A"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{`${application.firstName} ${application.lastName}`}</div>
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
                  <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
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
                      type="text"
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
                  <AvatarFallback>{selectedApplication.studentName?.charAt(0) || "A"}</AvatarFallback>
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
                  <p>{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Program</Label>
                  <p>{selectedApplication.program}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-500">Documents</Label>
                <div className="grid gap-2 mt-2">
                  {selectedApplication.documents?.map((doc, index) => (
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
                <Button variant="outline" onClick={() => setIsViewApplicationOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Application Modal */}
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
                    <Label htmlFor="edit-firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-firstName"
                      value={newApplication.firstName}
                      onChange={(e) => setNewApplication({ ...newApplication, firstName: e.target.value })}
                      placeholder="John"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-lastName"
                      value={newApplication.lastName}
                      onChange={(e) => setNewApplication({ ...newApplication, lastName: e.target.value })}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label>Application Status</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={newApplication.status === "APPROVED" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("APPROVED")}
                      type="button"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant={newApplication.status === "REJECTED" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("REJECTED")}
                      type="button"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant={newApplication.status === "PENDING" ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("PENDING")}
                      type="button"
                    >
                      Pending
                    </Button>
                  </div>
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
                    Previous School
                  </Label>
                  <Input
                    id="edit-previousSchool"
                    value={newApplication.previousSchool || ""}
                    onChange={(e) => setNewApplication({ ...newApplication, previousSchool: e.target.value })}
                    placeholder="Enter previous school name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-educationLevel">
                    Education Level
                  </Label>
                  <Input
                    id="edit-educationLevel"
                    value={newApplication.educationLevel || ""}
                    onChange={(e) => setNewApplication({ ...newApplication, educationLevel: e.target.value })}
                    placeholder="Enter education level"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-personalStatement">
                    Personal Statement
                  </Label>
                  <Textarea
                    id="edit-personalStatement"
                    value={newApplication.personalStatement || ""}
                    onChange={(e) => setNewApplication({ ...newApplication, personalStatement: e.target.value })}
                    placeholder="Enter personal statement"
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
              <Button disabled={editMutation.isPending} type="submit">
                {editMutation.isPending && <Loader2 className="animate-spin mr-2" />}
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