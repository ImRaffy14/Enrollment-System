"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, Edit, Eye, Download, Loader2, ShoppingCart } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define types
interface SupplyItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Agreement {
  id: string
  studentId: string
  studentName: string
  email: string
  program: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  items: SupplyItem[]
  paymentPlan: "FULL" | "INSTALLMENT"
  totalAmount: number
  paidAmount: number
  nextPaymentDate: string | null
  avatar: string
}

interface Supply {
  id: string
  name: string
  category: string
  price: number
  available: boolean
}

interface NewAgreement {
  studentId: string
  studentName: string
  email: string
  program: string
  items: string[]
  paymentPlan: "FULL" | "INSTALLMENT"
}

interface StatusData {
  status: "PENDING" | "APPROVED" | "REJECTED"
  notes: string
}

// Mock data for agreements
const mockAgreements: Agreement[] = [
  {
    id: "AGR001",
    studentId: "2025-CS-001",
    studentName: "John Smith",
    email: "john.smith@example.com",
    program: "Computer Science",
    status: "APPROVED",
    createdAt: "2025-05-01T10:30:00Z",
    items: [
      { id: "ITEM001", name: "Textbook: Introduction to Computer Science", quantity: 1, price: 75.0 },
      { id: "ITEM002", name: "Laptop", quantity: 1, price: 899.99 },
      { id: "ITEM003", name: "Scientific Calculator", quantity: 1, price: 29.99 },
    ],
    paymentPlan: "INSTALLMENT",
    totalAmount: 1004.98,
    paidAmount: 251.25,
    nextPaymentDate: "2025-06-01T00:00:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  // ... rest of the mock agreements
]

// Mock data for available supplies
const mockSupplies: Supply[] = [
  {
    id: "ITEM001",
    name: "Textbook: Introduction to Computer Science",
    category: "Books",
    price: 75.0,
    available: true,
  },
  // ... rest of the mock supplies
]

const SchoolSuppliesAgreement = () => {
  const [agreements, setAgreements] = useState<Agreement[]>(mockAgreements)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isViewAgreementOpen, setIsViewAgreementOpen] = useState<boolean>(false)
  const [isCreateAgreementOpen, setIsCreateAgreementOpen] = useState<boolean>(false)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState<boolean>(false)
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [newAgreement, setNewAgreement] = useState<NewAgreement>({
    studentId: "",
    studentName: "",
    email: "",
    program: "",
    items: [],
    paymentPlan: "FULL",
  })

  const [statusData, setStatusData] = useState<StatusData>({
    status: "PENDING",
    notes: "",
  })

  const agreementsPerPage = 5

  // Filter agreements based on search term and status
  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch =
      agreement.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All" || agreement.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const indexOfLastAgreement = currentPage * agreementsPerPage
  const indexOfFirstAgreement = indexOfLastAgreement - agreementsPerPage
  const currentAgreements = filteredAgreements.slice(indexOfFirstAgreement, indexOfLastAgreement)
  const totalPages = Math.ceil(filteredAgreements.length / agreementsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleCreateAgreement = () => {
    setIsLoading(true)

    // Calculate total amount
    const totalAmount = newAgreement.items.reduce((sum, itemId) => {
      const item = mockSupplies.find((supply) => supply.id === itemId)
      return sum + (item ? item.price : 0)
    }, 0)

    // Simulate API call
    setTimeout(() => {
      const newId = `AGR${(agreements.length + 1).toString().padStart(3, "0")}`
      const items = newAgreement.items.map((itemId) => {
        const item = mockSupplies.find((supply) => supply.id === itemId)
        return {
          id: item?.id || "",
          name: item?.name || "",
          quantity: 1,
          price: item?.price || 0,
        }
      }).filter(item => item.id) as SupplyItem[]

      const newAgreementData: Agreement = {
        id: newId,
        studentId: newAgreement.studentId,
        studentName: newAgreement.studentName,
        email: newAgreement.email,
        program: newAgreement.program,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        items: items,
        paymentPlan: newAgreement.paymentPlan,
        totalAmount: totalAmount,
        paidAmount: 0,
        nextPaymentDate:
          newAgreement.paymentPlan === "INSTALLMENT"
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : null,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      setAgreements([...agreements, newAgreementData])
      setIsCreateAgreementOpen(false)
      resetForm()
      setIsLoading(false)
    }, 1000)
  }

  const handleUpdateStatus = () => {
    if (!selectedAgreement) return
    
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedAgreements = agreements.map((agreement) =>
        agreement.id === selectedAgreement.id
          ? {
              ...agreement,
              status: statusData.status,
            }
          : agreement
      )

      setAgreements(updatedAgreements)
      setIsUpdateStatusOpen(false)
      setStatusData({ status: "PENDING", notes: "" })
      setIsLoading(false)
    }, 1000)
  }

  const resetForm = () => {
    setNewAgreement({
      studentId: "",
      studentName: "",
      email: "",
      program: "",
      items: [],
      paymentPlan: "FULL",
    })
  }

  const openViewModal = (agreement: Agreement) => {
    setSelectedAgreement(agreement)
    setIsViewAgreementOpen(true)
  }

  const openUpdateStatusModal = (agreement: Agreement) => {
    setSelectedAgreement(agreement)
    setStatusData({
      status: agreement.status,
      notes: "",
    })
    setIsUpdateStatusOpen(true)
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
  const paymentPlanOptions = [
    { value: "FULL", label: "Full Payment" },
    { value: "INSTALLMENT", label: "Installment Plan" },
  ]

  const calculateTotal = (): string => {
    return newAgreement.items
      .reduce((sum, itemId) => {
        const item = mockSupplies.find((supply) => supply.id === itemId)
        return sum + (item ? item.price : 0)
      }, 0)
      .toFixed(2)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  return (
    <div className="space-y-6">
      {/* Header and Create Agreement Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">School Supplies Agreement</h2>
        <Button className="gap-2" onClick={() => setIsCreateAgreementOpen(true)}>
          <ShoppingCart size={16} />
          New Agreement
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down agreements list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search agreements..."
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

      {/* Agreements Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Agreements</CardTitle>
              <CardDescription>{filteredAgreements.length} agreements found</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAgreements.map((agreement) => (
                <TableRow key={agreement.id}>
                  <TableCell>{agreement.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={agreement.avatar || "/placeholder.svg"} alt="avatar" />
                        <AvatarFallback>{agreement.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agreement.studentName}</div>
                        <div className="text-sm text-gray-500">{agreement.studentId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${agreement.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{agreement.paymentPlan === "FULL" ? "Full Payment" : "Installment"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        agreement.status === "APPROVED"
                          ? "default"
                          : agreement.status === "REJECTED"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {agreement.status}
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
                        <DropdownMenuItem className="gap-2" onClick={() => openViewModal(agreement)}>
                          <Eye size={16} />
                          View
                        </DropdownMenuItem>
                        {agreement.status === "PENDING" && (
                          <DropdownMenuItem className="gap-2" onClick={() => openUpdateStatusModal(agreement)}>
                            <Edit size={16} />
                            Update Status
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2">
                          <Download size={16} />
                          Download PDF
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
            Showing {Math.min((currentPage - 1) * agreementsPerPage + 1, filteredAgreements.length)} to{" "}
            {Math.min(currentPage * agreementsPerPage, filteredAgreements.length)} of {filteredAgreements.length}{" "}
            agreements
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

      {/* View Agreement Modal */}
      <Dialog
        open={isViewAgreementOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAgreement(null)
          }
          setIsViewAgreementOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Agreement Details</DialogTitle>
            <DialogDescription>View detailed information about this agreement.</DialogDescription>
          </DialogHeader>

          {selectedAgreement && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedAgreement.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedAgreement.studentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedAgreement.studentName}</h3>
                  <p className="text-sm text-gray-500">{selectedAgreement.email}</p>
                  <p className="text-sm font-medium">{selectedAgreement.studentId}</p>
                </div>
                <Badge
                  className="ml-auto"
                  variant={
                    selectedAgreement.status === "APPROVED"
                      ? "default"
                      : selectedAgreement.status === "REJECTED"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {selectedAgreement.status}
                </Badge>
              </div>

              <Tabs defaultValue="items" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="payment">Payment Details</TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="space-y-4 mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedAgreement.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="text-right font-bold">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ${selectedAgreement.totalAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Payment Plan</Label>
                      <p className="font-medium">
                        {selectedAgreement.paymentPlan === "FULL" ? "Full Payment" : "Installment Plan"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Agreement Date</Label>
                      <p className="font-medium">{new Date(selectedAgreement.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Total Amount</Label>
                      <p className="font-medium">${selectedAgreement.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Paid Amount</Label>
                      <p className="font-medium">${selectedAgreement.paidAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Remaining Balance</Label>
                      <p className="font-medium">
                        ${(selectedAgreement.totalAmount - selectedAgreement.paidAmount).toFixed(2)}
                      </p>
                    </div>
                    {selectedAgreement.nextPaymentDate && (
                      <div>
                        <Label className="text-gray-500">Next Payment Date</Label>
                        <p className="font-medium">
                          {new Date(selectedAgreement.nextPaymentDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedAgreement.paymentPlan === "INSTALLMENT" && (
                    <div className="mt-4">
                      <Label className="text-gray-500 mb-2 block">Payment Schedule</Label>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Payment #</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>{new Date(selectedAgreement.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>${(selectedAgreement.totalAmount * 0.25).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="default">Paid</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>2</TableCell>
                            <TableCell>
                              {selectedAgreement.nextPaymentDate
                                ? new Date(selectedAgreement.nextPaymentDate).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell>${(selectedAgreement.totalAmount * 0.25).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">Pending</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>3</TableCell>
                            <TableCell>
                              {selectedAgreement.nextPaymentDate
                                ? new Date(
                                    new Date(selectedAgreement.nextPaymentDate).getTime() + 30 * 24 * 60 * 60 * 1000,
                                  ).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell>${(selectedAgreement.totalAmount * 0.25).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">Pending</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>4</TableCell>
                            <TableCell>
                              {selectedAgreement.nextPaymentDate
                                ? new Date(
                                    new Date(selectedAgreement.nextPaymentDate).getTime() + 60 * 24 * 60 * 60 * 1000,
                                  ).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell>${(selectedAgreement.totalAmount * 0.25).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">Pending</Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setIsViewAgreementOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Agreement Modal */}
      <Dialog
        open={isCreateAgreementOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm()
          }
          setIsCreateAgreementOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>New Supplies Agreement</DialogTitle>
            <DialogDescription>Create a new school supplies agreement for a student.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCreateAgreement()
            }}
          >
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student Information</TabsTrigger>
                <TabsTrigger value="supplies">Select Supplies</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">
                      Student ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="studentId"
                      value={newAgreement.studentId}
                      onChange={(e) => setNewAgreement({ ...newAgreement, studentId: e.target.value })}
                      placeholder="e.g. 2025-CS-001"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="studentName"
                      value={newAgreement.studentName}
                      onChange={(e) => setNewAgreement({ ...newAgreement, studentName: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAgreement.email}
                      onChange={(e) => setNewAgreement({ ...newAgreement, email: e.target.value })}
                      placeholder="student@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program">
                      Program <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newAgreement.program}
                      onValueChange={(value) => setNewAgreement({ ...newAgreement, program: value })}
                    >
                      <SelectTrigger id="program">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentPlan">
                    Payment Plan <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newAgreement.paymentPlan}
                    onValueChange={(value: "FULL" | "INSTALLMENT") => 
                      setNewAgreement({ ...newAgreement, paymentPlan: value })
                    }
                  >
                    <SelectTrigger id="paymentPlan">
                      <SelectValue placeholder="Select payment plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentPlanOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="supplies" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Select Items</Label>
                    <div className="text-sm font-medium">Total: ${calculateTotal()}</div>
                  </div>

                  <div className="border rounded-md p-4 max-h-[400px] overflow-y-auto">
                    <div className="grid gap-2">
                      {mockSupplies.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 p-2 border rounded-md">
                          <Checkbox
                            id={`item-${item.id}`}
                            checked={newAgreement.items.includes(item.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewAgreement({
                                  ...newAgreement,
                                  items: [...newAgreement.items, item.id],
                                })
                              } else {
                                setNewAgreement({
                                  ...newAgreement,
                                  items: newAgreement.items.filter((id) => id !== item.id),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={`item-${item.id}`} className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.category}</div>
                          </Label>
                          <div className="font-medium">${item.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {newAgreement.paymentPlan === "INSTALLMENT" && (
                  <div className="p-4 border rounded-md bg-gray-50">
                    <h4 className="font-medium mb-2">Installment Plan Details</h4>
                    <p className="text-sm text-gray-600">
                      The total amount of ${calculateTotal()} will be divided into 4 equal payments:
                    </p>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>
                        Initial payment: ${(Number.parseFloat(calculateTotal()) * 0.25).toFixed(2)} (due at signing)
                      </li>
                      <li>3 monthly payments of ${(Number.parseFloat(calculateTotal()) * 0.25).toFixed(2)} each</li>
                    </ul>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateAgreementOpen(false)
                  resetForm()
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isLoading || newAgreement.items.length === 0} type="submit">
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                Create Agreement
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog
        open={isUpdateStatusOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAgreement(null)
            setStatusData({ status: "PENDING", notes: "" })
          }
          setIsUpdateStatusOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Agreement Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedAgreement?.studentName}'s agreement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={statusData.status}
                onValueChange={(value: "PENDING" | "APPROVED" | "REJECTED") =>
                  setStatusData({ ...statusData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={statusData.notes}
                onChange={(e) => setStatusData({ ...statusData, notes: e.target.value })}
                placeholder="Optional notes about the status change"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateStatusOpen(false)
                setStatusData({ status: "PENDING", notes: "" })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin mr-2" />}
              Update Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SchoolSuppliesAgreement