import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getStudentAdmissions, updateStudentAdmission } from '../api/studentAdmissionAPI'
import toast from "react-hot-toast"

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
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
  birthdate: string;
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
  interviewDate?: string | null;
  interviewScore?: number | null;
  admissionNotes?: string;
}

const Admission = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [isViewApplicantOpen, setIsViewApplicantOpen] = useState(false)
  const [isEvaluateOpen, setIsEvaluateOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  // Fetch admissions data
  const { data: applications = [], isLoading: isFetching } = useQuery<Application[]>({
    queryKey: ['admissions'],
    queryFn: getStudentAdmissions,
  })

  // Update admission mutation
  const updateAdmissionMutation = useMutation({
    mutationFn: ({ data, id }: { data: Partial<Application>; id: string }) => updateStudentAdmission(data, id),
    onSuccess: () => {
      toast.success("Updated Applicant")
      queryClient.invalidateQueries({ queryKey: ['admissions'] })
    },
  })

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

  const applicationsPerPage = 5

  // Filter applications based on search term and status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.appId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All" || app.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const indexOfLastApplication = currentPage * applicationsPerPage
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication)
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleEvaluateApplication = () => {
    if (!selectedApplication) return

    const updateData: Partial<Application> = {
      ...selectedApplication,
      status: evaluationData.status,
    };

    updateAdmissionMutation.mutate({ data: updateData, id: selectedApplication.id }, {
      onSuccess: () => {
        setIsEvaluateOpen(false)
        resetForm()
      }
    })
  }

  const resetForm = () => {
    setEvaluationData({
      status: "",
      interviewDate: "",
      interviewScore: "",
      admissionNotes: "",
    })
  }

  const openViewModal = (application: Application) => {
    setSelectedApplication(application)
    setIsViewApplicantOpen(true)
  }

  const openEvaluateModal = (application: Application) => {
    setSelectedApplication(application)
    setEvaluationData({
      status: application.status,
      interviewDate: application.interviewDate ? new Date(application.interviewDate).toISOString().split("T")[0] : "",
      interviewScore: application.interviewScore ? application.interviewScore.toString() : "",
      admissionNotes: application.admissionNotes || "",
    })
    setIsEvaluateOpen(true)
  }

  const statusOptions = ["All", "PENDING", "INTERVIEW", "APPROVED", "REJECTED"]

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
          {isFetching ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-8 w-8" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Status</TableHead>
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
                          <AvatarFallback>
                            {application.firstName?.charAt(0)}{application.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{`${application.firstName} ${application.lastName}`}</div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          application.status === "APPROVED"
                            ? "default"
                            : application.status === "REJECTED"
                              ? "destructive"
                              : application.status === "INTERVIEW"
                                ? "default"
                                : "outline"
                        }
                      >
                        {application.status}
                      </Badge>
                    </TableCell>
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
                          <DropdownMenuItem className="gap-2" onClick={() => openEvaluateModal(application)}>
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
          )}
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

      {/* View Application Modal */}
      <Dialog
        open={isViewApplicantOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplication(null)
          }
          setIsViewApplicantOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>View detailed information about this application.</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedApplication.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedApplication.firstName?.charAt(0)}{selectedApplication.lastName?.charAt(0)}
                  </AvatarFallback>
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
                        : selectedApplication.status === "INTERVIEW"
                          ? "default"
                          : "outline"
                  }
                >
                  {selectedApplication.status}
                </Badge>
              </div>

              <Tabs defaultValue="application" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="application">Application Info</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="application" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Application ID</Label>
                      <p className="font-medium">{selectedApplication.appId}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Submitted Date</Label>
                      <p className="font-medium">{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Program</Label>
                      <p className="font-medium">{selectedApplication.program}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Education Level</Label>
                      <p className="font-medium">{selectedApplication.educationLevel}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Gender</Label>
                      <p className="font-medium">{selectedApplication.gender}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Birth Date</Label>
                      <p className="font-medium">{selectedApplication.birthdate}</p>
                    </div>
                    {selectedApplication.previousSchool && (
                      <div>
                        <Label className="text-gray-500">Previous School</Label>
                        <p className="font-medium">{selectedApplication.previousSchool}</p>
                      </div>
                    )}
                    {selectedApplication.personalStatement && (
                      <div className="col-span-2">
                        <Label className="text-gray-500">Personal Statement</Label>
                        <p className="mt-1 p-2 border rounded-md min-h-[100px]">
                          {selectedApplication.personalStatement}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Submitted Documents</Label>
                    <div className="grid gap-2">
                      {selectedApplication.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between gap-2 p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText size={16} />
                            <span>{doc.name} ({doc.type})</span>
                          </div>
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between mt-4">
                <div>
                  {selectedApplication.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsViewApplicantOpen(false)
                          openEvaluateModal(selectedApplication)
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

      {/* Evaluate Application Modal */}
      <Dialog
        open={isEvaluateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplication(null)
            resetForm()
          }
          setIsEvaluateOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Evaluate Application</DialogTitle>
            <DialogDescription>Update admission status for {selectedApplication?.studentName}.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleEvaluateApplication()
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
              <Button disabled={updateAdmissionMutation.isPending} type="submit">
                {updateAdmissionMutation.isPending && <Loader2 className="animate-spin mr-2" />}
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