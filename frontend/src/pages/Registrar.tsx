import type React from "react"
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, FileText, Check, X } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PaginationControls from "@/components/PaginationControls"
import { ConfirmationModal } from "@/components/ConfirmationModal"

const RegistrarManagement = () => {
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Mock data
  const records = [
    {
      id: 1,
      studentName: "Juan Dela Cruz",
      studentId: "2023-001",
      gradeLevel: "Grade 7",
      status: "Registered",
      registrationDate: "2023-06-01",
      documents: ["Birth Certificate", "Form 137"]
    },
    {
      id: 2,
      studentName: "Maria Santos",
      studentId: "2023-002",
      gradeLevel: "Grade 11",
      status: "Pending Documents",
      registrationDate: "2023-06-02",
      documents: ["Birth Certificate"]
    },
    // Add more mock data...
  ]

  const statuses = ["All", "Registered", "Pending Documents", "Incomplete"]

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || record.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const currentItems = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage)

  const openViewModal = (record: any) => {
    setSelectedRecord(record)
    setIsViewOpen(true)
  }

  const openConfirmationModal = (record: any) => {
    setSelectedRecord(record)
    setIsConfirmationOpen(true)
  }

  const handleStatusChange = (id: number, newStatus: string) => {
    // In a real app, you would update the status via API
    console.log(`Changing status of record ${id} to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Registrar Management</h2>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down student records</CardDescription>
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

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
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

      {/* Records Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Student Records</CardTitle>
              <CardDescription>{filteredRecords.length} records found</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Grade Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.studentName}</TableCell>
                  <TableCell>{record.studentId}</TableCell>
                  <TableCell>{record.gradeLevel}</TableCell>
                  <TableCell>
                    <Badge variant={
                      record.status === "Registered" ? "default" : 
                      record.status === "Pending Documents" ? "secondary" : "destructive"
                    }>
                      {record.status}
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
                        <DropdownMenuItem className="gap-2" onClick={() => openViewModal(record)}>
                          <Eye size={16} />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => handleStatusChange(record.id, "Registered")}>
                          <Check size={16} />
                          Mark as Registered
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600" onClick={() => openConfirmationModal(record)}>
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
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredRecords.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
          </div>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </CardFooter>
      </Card>

      {/* View Record Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Record Details</DialogTitle>
            <DialogDescription>View detailed information about this student record.</DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Student Name</Label>
                    <p>{selectedRecord.studentName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Student ID</Label>
                    <p>{selectedRecord.studentId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Grade Level</Label>
                    <p>{selectedRecord.gradeLevel}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Registration Date</Label>
                    <p>{selectedRecord.registrationDate}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-500">Status</Label>
                  <Badge variant={
                    selectedRecord.status === "Registered" ? "default" : 
                    selectedRecord.status === "Pending Documents" ? "secondary" : "destructive"
                  }>
                    {selectedRecord.status}
                  </Badge>
                </div>

                <div>
                  <Label className="text-gray-500">Documents Submitted</Label>
                  <div className="mt-2 space-y-2">
                    {selectedRecord.documents.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-500" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => {
          console.log(`Deleting record ${selectedRecord?.id}`)
          setIsConfirmationOpen(false)
        }}
        itemName={selectedRecord?.studentName}
        isLoading={false}
        title="Delete Student Record"
        description="Are you sure you want to delete this student record?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default RegistrarManagement