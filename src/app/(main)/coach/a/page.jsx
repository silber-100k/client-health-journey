"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Switch } from "@/app/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Plus, X, Settings, Heart, Activity, TrendingUp, Clock, FileText, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"

export default function HealthManagementApp() {
  // Profile data
  const [profileData, setProfileData] = useState({
    gender: "Male",
    age: "51 years",
    weight: "165 lbs",
    height: "78 in",
    activityLevel: "Moderate",
    goal: "Maintenance",
    dietaryPreference: "No Restrictions",
    foodAllergies: "Dairy",
  })

  // Health conditions
  const [healthConditions, setHealthConditions] = useState([
    {
      id: "1",
      name: "Arthritis",
      severity: "moderate",
      description: "Personal custom condition - tracking for personal use",
    },
    { id: "2", name: "Diverticulitis", severity: "moderate" },
    { id: "3", name: "Crohns Disease", severity: "moderate" },
  ])

  // Custom condition requests
  const [customRequests] = useState([
    { id: "1", name: "Arthritis", status: "approved", submittedDate: "7/2/2025", researchConfidence: 88 },
    { id: "2", name: "PCOS", status: "approved", submittedDate: "7/2/2025", researchConfidence: 88 },
  ])

  // Coaching preferences
  const [coachingPrefs, setCoachingPrefs] = useState({
    dailyTips: true,
    foodWarnings: true,
    symptomReminders: true,
    coachingIntensity: "Intensive - Detailed coaching",
    preferredTipTime: "09:00 AM",
  })

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [editableProfile, setEditableProfile] = useState({
    gender: "Male",
    age: "51",
    weight: "165",
    height: "78",
    activityLevel: "Moderate (exercise 3-5 days/week)",
    goal: "Maintenance",
    dietaryPreference: "No dietary restrictions",
    foodAllergies: "Dairy",
    units: "Imperial (lbs/in)",
  })

  const [isAddConditionModalOpen, setIsAddConditionModalOpen] = useState(false)
  const [newCondition, setNewCondition] = useState({
    condition: "",
    severity: "Moderate",
    diagnosisDate: "",
    notes: "",
  })

  const [isAddCustomConditionModalOpen, setIsAddCustomConditionModalOpen] = useState(false)
  const [customCondition, setCustomCondition] = useState({
    name: "",
    description: "",
  })

  const removeCondition = (id) => {
    setHealthConditions((prev) => prev.filter((condition) => condition.id !== id))
  }

  const togglePreference = (key) => {
    setCoachingPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const openProfileModal = () => {
    setIsProfileModalOpen(true)
  }

  const closeProfileModal = () => {
    setIsProfileModalOpen(false)
  }

  const openAddConditionModal = () => {
    setIsAddConditionModalOpen(true)
  }

  const closeAddConditionModal = () => {
    setIsAddConditionModalOpen(false)
    setNewCondition({
      condition: "",
      severity: "Moderate",
      diagnosisDate: "",
      notes: "",
    })
  }

  const openAddCustomConditionModal = () => {
    setIsAddCustomConditionModalOpen(true)
  }

  const closeAddCustomConditionModal = () => {
    setIsAddCustomConditionModalOpen(false)
    setCustomCondition({
      name: "",
      description: "",
    })
  }

  const handleAddCondition = () => {
    if (newCondition.condition) {
      const newHealthCondition = {
        id: Date.now().toString(),
        name: newCondition.condition,
        severity: newCondition.severity.toLowerCase(),
        description: newCondition.notes || undefined,
      }
      setHealthConditions((prev) => [...prev, newHealthCondition])
      closeAddConditionModal()
    }
  }

  const handleAddCustomCondition = () => {
    if (customCondition.name) {
      const newHealthCondition = {
        id: Date.now().toString(),
        name: customCondition.name,
        severity: "moderate",
        description: customCondition.description || undefined,
      }
      setHealthConditions((prev) => [...prev, newHealthCondition])
      closeAddCustomConditionModal()
    }
  }

  const updateNewCondition = (field, value) => {
    setNewCondition((prev) => ({ ...prev, [field]: value }))
  }

  const updateCustomCondition = (field, value) => {
    setCustomCondition((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfileSave = () => {
    // Update the main profile data
    setProfileData({
      gender: editableProfile.gender,
      age: editableProfile.age + " years",
      weight: editableProfile.weight + " lbs",
      height: editableProfile.height + " in",
      activityLevel: editableProfile.activityLevel.split(" (")[0],
      goal: editableProfile.goal,
      dietaryPreference: editableProfile.dietaryPreference,
      foodAllergies: editableProfile.foodAllergies,
    })
    closeProfileModal()
  }

  const updateEditableProfile = (field, value) => {
    setEditableProfile((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Settings Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your personal information and preferences</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={openProfileModal}>
              <Settings className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Gender</Label>
                    <p className="text-gray-900">{profileData.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Age</Label>
                    <p className="text-gray-900">{profileData.age}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Weight</Label>
                    <p className="text-gray-900">{profileData.weight}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Height</Label>
                    <p className="text-gray-900">{profileData.height}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Activity Level</Label>
                    <p className="text-gray-900">{profileData.activityLevel}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Goal</Label>
                    <p className="text-gray-900">{profileData.goal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
                <CardDescription>Your dietary restrictions and food allergies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Dietary Preference</Label>
                  <p className="text-gray-900">{profileData.dietaryPreference}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Food Allergies</Label>
                  <p className="text-gray-900">{profileData.foodAllergies}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Health Profile Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Health Profile</h1>
              <p className="text-gray-600">Manage your health conditions and coaching preferences</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={openAddConditionModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Condition
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Custom Condition Requests
              </CardTitle>
              <CardDescription>Track the status of your custom condition requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{request.name}</h3>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Submitted {request.submittedDate}</p>
                      <p className="text-sm text-gray-600">Research confidence: {request.researchConfidence}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  My Health Conditions
                </CardTitle>
                <CardDescription>Conditions you're managing with personalized nutrition guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthConditions.map((condition) => (
                  <div key={condition.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{condition.name}</h3>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {condition.severity}
                          </Badge>
                        </div>
                        {condition.description && <p className="text-sm text-gray-600">{condition.description}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(condition.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full bg-transparent" onClick={openAddCustomConditionModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Condition
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Coaching Preferences
                </CardTitle>
                <CardDescription>Customize how you receive nutrition guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Daily Tips</Label>
                      <p className="text-sm text-gray-600">Receive daily nutrition tips based on your conditions</p>
                    </div>
                    <Switch checked={coachingPrefs.dailyTips} onCheckedChange={() => togglePreference("dailyTips")} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Food Warnings</Label>
                      <p className="text-sm text-gray-600">
                        Get alerts when logging foods that may affect your conditions
                      </p>
                    </div>
                    <Switch
                      checked={coachingPrefs.foodWarnings}
                      onCheckedChange={() => togglePreference("foodWarnings")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Symptom Reminders</Label>
                      <p className="text-sm text-gray-600">Reminders to track symptoms and food reactions</p>
                    </div>
                    <Switch
                      checked={coachingPrefs.symptomReminders}
                      onCheckedChange={() => togglePreference("symptomReminders")}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Coaching Intensity</Label>
                    <Select
                      value={coachingPrefs.coachingIntensity}
                      onValueChange={(value) => setCoachingPrefs((prev) => ({ ...prev, coachingIntensity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Minimal - Key tips only"
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                        >Minimal - Key tips only</SelectItem>
                        <SelectItem value="Moderate - Regular guidance"
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                        >Moderate - Regular guidance</SelectItem>
                        <SelectItem
                          value="Intensive - Detailed coaching"
                          className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                        >
                          Intensive - Detailed coaching
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Preferred Tip Time</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value="09:00"
                        onChange={(e) =>
                          setCoachingPrefs((prev) => ({ ...prev, preferredTipTime: e.target.value + " AM" }))
                        }
                        className="flex-1"
                      />
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Symptom Tracker Section
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Symptom Tracker</h1>
              <p className="text-gray-600">Track symptoms to identify patterns with food and lifestyle</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Log Symptom
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Symptoms
              </CardTitle>
              <CardDescription>Your recent symptom logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No symptoms logged yet</h3>
                <p className="text-gray-600">Start tracking to identify patterns</p>
              </div>
            </CardContent>
          </Card>
        </section> */}

        {/* Profile Update Modal */}
        <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Your Profile Information</DialogTitle>
              <p className="text-sm text-gray-600">Complete your profile to get accurate nutrition recommendations</p>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <p className="text-sm text-gray-600">
                Your profile information is used to calculate personalized nutrition recommendations. This information
                is required for both personalized and custom goal settings.
              </p>

              <div>
                <Label className="text-sm font-medium">Units</Label>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-teal-600">{editableProfile.units}</span>
                  <Switch defaultChecked />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Gender</Label>
                <Select
                  value={editableProfile.gender}
                  onValueChange={(value) => updateEditableProfile("gender", value)}
                >
                  <SelectTrigger className="mt-1 border-teal-500 focus:border-teal-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Male"
                      className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >
                      Male
                    </SelectItem>
                    <SelectItem value="Female"
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Age (years)</Label>
                <Input
                  type="number"
                  value={editableProfile.age}
                  onChange={(e) => updateEditableProfile("age", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Weight (lbs)</Label>
                <Input
                  type="number"
                  value={editableProfile.weight}
                  onChange={(e) => updateEditableProfile("weight", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Height (in)</Label>
                <Input
                  type="number"
                  value={editableProfile.height}
                  onChange={(e) => updateEditableProfile("height", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Activity Level</Label>
                <Select
                  value={editableProfile.activityLevel}
                  onValueChange={(value) => updateEditableProfile("activityLevel", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedentary (little or no exercise)"
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="Light (exercise 1-3 days/week)"
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >Light (exercise 1-3 days/week)</SelectItem>
                    <SelectItem
                      value="Moderate (exercise 3-5 days/week)"
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >
                      Moderate (exercise 3-5 days/week)
                    </SelectItem>
                    <SelectItem value="Active (exercise 6-7 days/week)"
                   className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >Active (exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="Very Active (physical job or 2x training)"
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >
                      Very Active (physical job or 2x training)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Goal</Label>
                <Select value={editableProfile.goal} onValueChange={(value) => updateEditableProfile("goal", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Dietary Preference</Label>
                <Select
                  value={editableProfile.dietaryPreference}
                  onValueChange={(value) => updateEditableProfile("dietaryPreference", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No dietary restrictions">No dietary restrictions</SelectItem>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                    <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
                    <SelectItem value="Keto/Low-Carb">Keto/Low-Carb</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Food Allergies (separate with commas)</Label>
                <Input
                  value={editableProfile.foodAllergies}
                  onChange={(e) => updateEditableProfile("foodAllergies", e.target.value)}
                  className="mt-1"
                  placeholder="Enter allergies or type 'none'"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your food allergies separated by commas, or type "none" if you have no allergies.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={closeProfileModal} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleProfileSave} className="flex-1 bg-teal-600 hover:bg-teal-700">
                  Save Profile
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Health Condition Modal */}
        <Dialog open={isAddConditionModalOpen} onOpenChange={setIsAddConditionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add Health Condition</DialogTitle>
              <p className="text-sm text-gray-600">
                Add a health condition to receive personalized nutrition coaching.
              </p>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-sm font-medium">Health Condition</Label>
                <Select
                  value={newCondition.condition}
                  onValueChange={(value) => updateNewCondition("condition", value)}
                >
                  <SelectTrigger className="mt-1 border-teal-500 focus:border-teal-600">
                    <SelectValue placeholder="Select a condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cancer Treatment Support">Cancer Treatment Support</SelectItem>
                    <SelectItem value="Fibromyalgia">Fibromyalgia</SelectItem>
                    <SelectItem value="Hashimoto's">Hashimoto's</SelectItem>
                    <SelectItem value="Myasthenia Gravis">Myasthenia Gravis</SelectItem>
                    <SelectItem value="PCOS">PCOS</SelectItem>
                    <SelectItem value="Type 2 Diabetes">Type 2 Diabetes</SelectItem>
                    <SelectItem value="Arthritis">Arthritis</SelectItem>
                    <SelectItem value="Diverticulitis">Diverticulitis</SelectItem>
                    <SelectItem value="Crohns Disease">Crohn's Disease</SelectItem>
                    <SelectItem value="IBS">IBS</SelectItem>
                    <SelectItem value="Celiac Disease">Celiac Disease</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Severity Level</Label>
                <Select value={newCondition.severity} onValueChange={(value) => updateNewCondition("severity", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                    <SelectItem value="Well Controlled">Well Controlled</SelectItem>
                    <SelectItem value="Remission">Remission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Diagnosis Date (Optional)</Label>
                <Input
                  type="date"
                  value={newCondition.diagnosisDate}
                  onChange={(e) => updateNewCondition("diagnosisDate", e.target.value)}
                  className="mt-1"
                  placeholder="mm/dd/yyyy"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Notes (Optional)</Label>
                <textarea
                  value={newCondition.notes}
                  onChange={(e) => updateNewCondition("notes", e.target.value)}
                  className="mt-1 w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Additional notes about your condition..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={closeAddConditionModal} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCondition}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={!newCondition.condition}
                >
                  Add Condition
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Custom Health Condition Modal */}
        <Dialog open={isAddCustomConditionModalOpen} onOpenChange={setIsAddCustomConditionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add Custom Health Condition</DialogTitle>
              <p className="text-sm text-gray-600">
                Don't see your condition listed? Add it to your profile immediately and we'll research evidence-based
                dietary guidance for everyone.
              </p>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-sm font-medium">Condition Name</Label>
                <Input
                  value={customCondition.name}
                  onChange={(e) => updateCustomCondition("name", e.target.value)}
                  className="mt-1 border-teal-500 focus:border-teal-600"
                  placeholder="e.g., PCOS, Hashimoto's Disease, etc."
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Description (Optional)</Label>
                <textarea
                  value={customCondition.description}
                  onChange={(e) => updateCustomCondition("description", e.target.value)}
                  className="mt-1 w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Additional details about your condition or specific dietary concerns..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Condition is immediately added to your profile for tracking</li>
                      <li>• AI generates evidence-based research for the condition</li>
                      <li>• Medical professionals review it for addition to global conditions list</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={closeAddCustomConditionModal} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCustomCondition}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={!customCondition.name}
                >
                  Add Condition
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
