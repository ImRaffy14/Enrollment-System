
import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, Edit, Eye, CheckCircle, XCircle, Loader2, FileText } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Add these interfaces at the top of the file, after the imports

interface Applicant {
  id: string
  studentName: string
  email: string
  phone: string
  program: string
  status: string
  submittedAt: string
  documents: string[]
  interviewDate: string | null
  interviewScore: number | null
  admissionNotes: string
  avatar: string
}

// Update the mock data declaration
const mockApplicants: Applicant[] = [
  {
    id: "APP001",
    studentName: "John Smith",
    email: "john.smith@example.com",
    phone: "123-456-7890",
    program: "Computer Science",
    status: "PENDING",
    submittedAt: "2025-05-01T10:30:00Z",
    documents: ["Transcript", "ID", "Recommendation Letter"],
    interviewDate: null,
    interviewScore: null,
    admissionNotes: "",
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
    documents: ["Transcript", "ID"],
    interviewDate: "2025-05-10T14:00:00Z",
    interviewScore: 92,
    admissionNotes: "Excellent candidate with strong academic background.",
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
    documents: ["Transcript", "ID", "Portfolio"],
    interviewDate: "2025-05-11T10:00:00Z",
    interviewScore: 65,
    admissionNotes: "Did not meet minimum requirements for the program.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "APP004",
    studentName: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "456-789-0123",
    program: "Psychology",
    status: "INTERVIEW",
    submittedAt: "2025-05-04T11:20:00Z",
    documents: ["Transcript", "ID", "Essay"],
    interviewDate: "2025-05-15T13:30:00Z",
    interviewScore: null,
    admissionNotes: "Scheduled for interview.",
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
    documents: ["Transcript", "ID", "Medical Certificate"],
    interviewDate: null,
    interviewScore: null,
    admissionNotes: "",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const Admission = () => {
  // Update the state declaration
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [isViewApplicantOpen, setIsViewApplicantOpen] = useState(false)
  const [isEvaluateOpen, setIsEvaluateOpen] = useState(false)
  // Update the selectedApplicant state
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Update the evaluationData state
  interface EvaluationData {
    status: string
    interviewDate: string
    interviewScore: string
    admissionNotes: string
  }

  const [evaluationData, setEvaluationData] = useState<EvaluationData>({
    status: "",
    interviewDate: "",
    interviewScore: "",
    admissionNotes: "",
  })

  const applicantsPerPage = 5

  // Filter applicants based on search term and status
  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All" || app.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const indexOfLastApplicant = currentPage * applicantsPerPage
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage
  const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant)
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage)

  // Update the handlePageChange function
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleEvaluateApplicant = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedApplicants = applicants.map((app) =>
        app.id === selectedApplicant?.id
          ? {
              ...app,
              status: evaluationData.status,
              interviewDate: evaluationData.interviewDate || app.interviewDate,
              interviewScore: evaluationData.interviewScore
                ? Number.parseInt(evaluationData.interviewScore)
                : app.interviewScore,
              admissionNotes: evaluationData.admissionNotes,
            }
          : app,
      )

      setApplicants(updatedApplicants)
      setIsEvaluateOpen(false)
      resetForm()
      setIsLoading(false)
    }, 1000)
  }

  const resetForm = () => {
    setEvaluationData({
      status: "",
      interviewDate: "",
      interviewScore: "",
      admissionNotes: "",
    })
  }

  // Update the openViewModal, openEvaluateModal functions
  const openViewModal = (applicant: Applicant) => {
    setSelectedApplicant(applicant)
    setIsViewApplicantOpen(true)
  }

  const openEvaluateModal = (applicant: Applicant) => {
    setSelectedApplicant(applicant)
    setEvaluationData({
      status: applicant.status,
      interviewDate: applicant.interviewDate ? new Date(applicant.interviewDate).toISOString().split("T")[0] : "",
      interviewScore: applicant.interviewScore ? applicant.interviewScore.toString() : "",
      admissionNotes: applicant.admissionNotes || "",
    })
    setIsEvaluateOpen(true)
  }

  const statusOptions = ["All", "PENDING", "INTERVIEW", "APPROVED", "REJECTED"]

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admission</h2>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down applicant list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applicants..."
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

      {/* Applicants Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Applicants</CardTitle>
              <CardDescription>{filteredApplicants.length} applicants found</CardDescription>
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
                <TableHead>Interview Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentApplicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell>{applicant.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={applicant.avatar || "/placeholder.svg"} alt="avatar" />
                        <AvatarFallback>{applicant.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{applicant.studentName}</div>
                        <div className="text-sm text-gray-500">{applicant.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{applicant.program}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        applicant.status === "APPROVED"
                          ? "default"
                          : applicant.status === "REJECTED"
                            ? "destructive"
                            : applicant.status === "INTERVIEW"
                              ? "default"
                              : "outline"
                      }
                    >
                      {applicant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {applicant.interviewDate ? new Date(applicant.interviewDate).toLocaleDateString() : "Not scheduled"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => openViewModal(applicant)}>
                          <Eye size={16} />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => openEvaluateModal(applicant)}>
                          <Edit size={16} />
                          Evaluate
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
            Showing {Math.min((currentPage - 1) * applicantsPerPage + 1, filteredApplicants.length)} to{" "}
            {Math.min(currentPage * applicantsPerPage, filteredApplicants.length)} of {filteredApplicants.length}{" "}
            applicants
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

      {/* View Applicant Modal */}
      <Dialog
        open={isViewApplicantOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplicant(null)
          }
          setIsViewApplicantOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Applicant Details</DialogTitle>
            <DialogDescription>View detailed information about this applicant.</DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedApplicant.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedApplicant.studentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedApplicant.studentName}</h3>
                  <p className="text-sm text-gray-500">{selectedApplicant.email}</p>
                  <p className="text-sm text-gray-500">{selectedApplicant.phone}</p>
                </div>
                <Badge
                  className="ml-auto"
                  variant={
                    selectedApplicant.status === "APPROVED"
                      ? "default"
                      : selectedApplicant.status === "REJECTED"
                        ? "destructive"
                        : selectedApplicant.status === "INTERVIEW"
                          ? "default"
                          : "outline"
                  }
                >
                  {selectedApplicant.status}
                </Badge>
              </div>

              <Tabs defaultValue="application" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="application">Application Info</TabsTrigger>
                  <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="application" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Application ID</Label>
                      <p className="font-medium">{selectedApplicant.id}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Submitted Date</Label>
                      <p className="font-medium">{new Date(selectedApplicant.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Program</Label>
                      <p className="font-medium">{selectedApplicant.program}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="evaluation" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Interview Date</Label>
                      <p className="font-medium">
                        {selectedApplicant.interviewDate
                          ? new Date(selectedApplicant.interviewDate).toLocaleDateString()
                          : "Not scheduled"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Interview Score</Label>
                      <p className="font-medium">
                        {selectedApplicant.interviewScore !== null
                          ? `${selectedApplicant.interviewScore}/100`
                          : "Not evaluated"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-500">Admission Notes</Label>
                    <p className="mt-1 p-2 border rounded-md min-h-[100px]">
                      {selectedApplicant.admissionNotes || "No notes available."}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Submitted Documents</Label>
                    <div className="grid gap-2">
                      {selectedApplicant.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText size={16} />
                            <span>{doc}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} className="mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between mt-4">
                <div>
                  {selectedApplicant.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsViewApplicantOpen(false)
                          openEvaluateModal(selectedApplicant)
                        }}
                      >
                        Schedule Interview
                      </Button>
                    </div>
                  )}
                </div>
                <Button variant="outline" onClick={() => setIsViewApplicantOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Evaluate Applicant Modal */}
      <Dialog
        open={isEvaluateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplicant(null)
            resetForm()
          }
          setIsEvaluateOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Evaluate Applicant</DialogTitle>
            <DialogDescription>Update admission status for {selectedApplicant?.studentName}.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleEvaluateApplicant()
            }}
          >
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">
                  Admission Status <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={evaluationData.status === "PENDING" ? "default" : "outline"}
                    className="justify-start gap-2"
                    onClick={() => setEvaluationData({ ...evaluationData, status: "PENDING" })}
                  >
                    <div className="size-4 rounded-full border border-current" />
                    Pending
                  </Button>
                  <Button
                    type="button"
                    variant={evaluationData.status === "INTERVIEW" ? "default" : "outline"}
                    className="justify-start gap-2"
                    onClick={() => setEvaluationData({ ...evaluationData, status: "INTERVIEW" })}
                  >
                    <div className="size-4 rounded-full border border-current" />
                    Interview
                  </Button>
                  <Button
                    type="button"
                    variant={evaluationData.status === "APPROVED" ? "default" : "outline"}
                    className="justify-start gap-2"
                    onClick={() => setEvaluationData({ ...evaluationData, status: "APPROVED" })}
                  >
                    <CheckCircle size={16} />
                    Approved
                  </Button>
                  <Button
                    type="button"
                    variant={evaluationData.status === "REJECTED" ? "destructive" : "outline"}
                    className="justify-start gap-2"
                    onClick={() => setEvaluationData({ ...evaluationData, status: "REJECTED" })}
                  >
                    <XCircle size={16} />
                    Rejected
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewDate">Interview Date</Label>
                <Input
                  id="interviewDate"
                  type="date"
                  value={evaluationData.interviewDate}
                  onChange={(e) => setEvaluationData({ ...evaluationData, interviewDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewScore">Interview Score (0-100)</Label>
                <Input
                  id="interviewScore"
                  type="number"
                  min="0"
                  max="100"
                  value={evaluationData.interviewScore}
                  onChange={(e) => setEvaluationData({ ...evaluationData, interviewScore: e.target.value })}
                  placeholder="Enter score"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionNotes">Admission Notes</Label>
                <Textarea
                  id="admissionNotes"
                  value={evaluationData.admissionNotes}
                  onChange={(e) => setEvaluationData({ ...evaluationData, admissionNotes: e.target.value })}
                  placeholder="Enter notes about the applicant"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEvaluateOpen(false)
                  resetForm()
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Save Evaluation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Admission
