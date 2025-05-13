import type React from "react"
import { useState } from "react"
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  Home,
  GraduationCap,
  ChevronLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  gender: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  program: string
  previousSchool: string
  educationLevel: string
  personalStatement: string
}

const initialFormData: FormData = {
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
}

const StudentApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [activeTab, setActiveTab] = useState("personal")
  const [applicationId, setApplicationId] = useState("")

  const programOptions = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Psychology",
    "Medicine",
    "Education",
    "Arts and Humanities",
    "Social Sciences",
    "Natural Sciences",
    "Mathematics",
  ]

  const educationLevelOptions = [
    "High School",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Other",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone ||
        !formData.birthDate ||
        !formData.gender
      ) {
        setErrorMessage("Please fill in all required personal information fields")
        return false
      }
      return true
    } else if (step === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
        setErrorMessage("Please fill in all required address fields")
        return false
      }
      return true
    } else if (step === 3) {
      if (!formData.program || !formData.previousSchool || !formData.educationLevel) {
        setErrorMessage("Please fill in all required education fields")
        return false
      }
      return true
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setErrorMessage("")
      setCurrentStep(currentStep + 1)

      if (currentStep === 1) setActiveTab("address")
      else if (currentStep === 2) setActiveTab("education")
      else if (currentStep === 3) setActiveTab("review")
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)

    if (currentStep === 2) setActiveTab("personal")
    else if (currentStep === 3) setActiveTab("address")
    else if (currentStep === 4) setActiveTab("education")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random application ID
      const newApplicationId = `APP-${Math.floor(100000 + Math.random() * 900000)}`
      setApplicationId(newApplicationId)

      // Simulate successful submission
      setSubmissionStatus("success")
    } catch (error) {
      setSubmissionStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    if (value === "personal") setCurrentStep(1)
    else if (value === "address") setCurrentStep(2)
    else if (value === "education") setCurrentStep(3)
    else if (value === "review") setCurrentStep(4)
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${
                  currentStep >= step
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-gray-300 text-gray-400"
                }`}
            >
              {step}
            </div>
            <div className="text-xs mt-2 text-gray-600">
              {step === 1
                ? "Personal"
                : step === 2
                  ? "Address"
                  : step === 3
                    ? "Education"
                    : "Review"}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderSuccessPage = () => {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6 text-center">
              Thank you for submitting your application. Your application ID is{" "}
              <span className="font-bold">{applicationId}</span>. We will review your application and get back to you
              soon.
            </p>

            <div className="bg-gray-50 p-4 rounded-md w-full max-w-md mb-6">
              <h3 className="font-medium mb-2">What happens next?</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Our admissions team will review your application</li>
                <li>You may be contacted for an interview or additional information</li>
                <li>You will receive a decision via email within 2-3 weeks</li>
                <li>If approved, you'll receive instructions for enrollment and registration</li>
              </ol>
            </div>

            <Button onClick={() => window.location.reload()}>Return to Home</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (submissionStatus === "success") {
    return renderSuccessPage()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Student Application Form</CardTitle>
          <CardDescription>
            Please fill out the form below to apply for admission. All fields marked with * are required.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {renderStepIndicator()}

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>

              {/* Step 1: Personal Information */}
              <TabsContent value="personal" className={currentStep === 1 ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 absolute ml-3" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 absolute ml-3" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">
                        Date of Birth <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 absolute ml-3" />
                        <Input
                          id="birthDate"
                          name="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange("gender", value)}
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
                  </div>
                </div>
              </TabsContent>

              {/* Step 2: Address Information */}
              <TabsContent value="address" className={currentStep === 2 ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Address Information</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Street Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">
                        State/Province <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter your state or province"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">
                        Zip/Postal Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="Enter your zip or postal code"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Enter your country"
                        required
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Step 3: Education Information */}
              <TabsContent value="education" className={currentStep === 3 ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Education Information</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program">
                      Desired Program <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.program} onValueChange={(value) => handleSelectChange("program", value)}>
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

                  <div className="space-y-2">
                    <Label htmlFor="previousSchool">
                      Previous School <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="previousSchool"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleInputChange}
                      placeholder="Enter your previous school name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">
                      Highest Education Level <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.educationLevel}
                      onValueChange={(value) => handleSelectChange("educationLevel", value)}
                    >
                      <SelectTrigger id="educationLevel">
                        <SelectValue placeholder="Select your highest education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevelOptions.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personalStatement">Personal Statement</Label>
                    <Textarea
                      id="personalStatement"
                      name="personalStatement"
                      value={formData.personalStatement}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and why you want to join this program"
                      rows={5}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Step 4: Review and Submit */}
              <TabsContent value="review" className={currentStep === 4 ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Review Your Application</h3>
                  </div>

                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Please Review Carefully</AlertTitle>
                    <AlertDescription>
                      Make sure all information is correct before submitting. You won't be able to edit your application
                      after submission.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Personal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p>
                            {formData.firstName} {formData.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p>{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p>{formData.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p>{formData.birthDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p>{formData.gender}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Address</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>{formData.address}</p>
                        <p>
                          {formData.city}, {formData.state} {formData.zipCode}
                        </p>
                        <p>{formData.country}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Education</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                        <div>
                          <p className="text-sm text-gray-500">Desired Program</p>
                          <p>{formData.program}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Previous School</p>
                          <p>{formData.previousSchool}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Highest Education Level</p>
                          <p>{formData.educationLevel}</p>
                        </div>
                      </div>

                      {formData.personalStatement && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Personal Statement</p>
                          <p className="bg-gray-50 p-4 rounded-md mt-1">{formData.personalStatement}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
              )}

              {currentStep < 4 ? (
                <Button type="button" className="ml-auto" onClick={nextStep}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Application
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentApplicationForm