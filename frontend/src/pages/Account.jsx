"use client"

import { useState } from "react"
import { 
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../components/ui"
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Settings,
  Shield,
  Truck,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Gift,
  ShoppingBag,
  Camera,
} from "lucide-react"
import { useToast } from "../hooks/use-toast"

// Mock data - replace with your actual data
const mockUser = {
  id: "1",
  email: "sarah.johnson@gmail.com",
  name: "Sarah Johnson",
  picture: "/placeholder.svg?height=100&width=100",
  phone: "+1 (555) 123-4567",
  joinDate: "2023-03-15",
  loyaltyPoints: 2450,
  totalOrders: 28,
  totalSpent: 3420.5,
}

const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-20",
    status: "delivered",
    total: 129.99,
    items: 3,
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-18",
    status: "shipped",
    total: 89.5,
    items: 2,
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-15",
    status: "processing",
    total: 245.0,
    items: 5,
    trackingNumber: null,
  },
]

const mockAddresses = [
  {
    id: "1",
    type: "home",
    name: "Sarah Johnson",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    name: "Sarah Johnson",
    street: "456 Business Ave",
    city: "New York",
    state: "NY",
    zip: "10002",
    country: "United States",
    isDefault: false,
  },
]

const mockPaymentMethods = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2027",
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: "08",
    expiryYear: "2026",
    isDefault: false,
  },
]

const mockWishlist = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 199.99,
    image: "/placeholder.svg?height=80&width=80",
    inStock: true,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 299.99,
    image: "/placeholder.svg?height=80&width=80",
    inStock: false,
  },
]

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [user, setUser] = useState(mockUser)
  const { toast } = useToast()

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCardIcon = (type) => {
    switch (type) {
      case "visa":
        return "💳"
      case "mastercard":
        return "💳"
      case "amex":
        return "💳"
      default:
        return "💳"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-2">Manage your orders, addresses, and account settings</p>
            </div>
            <Button variant="outline" className="bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Overview */}
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-medium">{new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Loyalty Points</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Gift className="h-3 w-3 mr-1" />
                      {user.loyaltyPoints}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Order Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Orders</span>
                    <span className="text-2xl font-bold">{user.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Spent</span>
                    <span className="text-2xl font-bold">${user.totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Order</span>
                    <span className="text-lg font-semibold">${(user.totalSpent / user.totalOrders).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("orders")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Track an Order
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("wishlist")}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    View Wishlist
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("addresses")}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Manage Addresses
                  </Button>
                  <Button
                    className="w-full justify-start bg-blue-50 border-blue-200 text-blue-700"
                    variant="outline"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest purchases and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <span className="font-semibold">${order.total}</span>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track all your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{order.id}</h3>
                          <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Amount</p>
                          <p className="font-semibold">${order.total}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Items</p>
                          <p className="font-semibold">{order.items} items</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tracking Number</p>
                          <p className="font-semibold">{order.trackingNumber || "N/A"}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {order.trackingNumber && (
                            <Button size="sm" variant="outline">
                              <Truck className="h-4 w-4 mr-1" />
                              Track
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Shipping Addresses</CardTitle>
                  <CardDescription>Manage your delivery addresses</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockAddresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={address.type === "home" ? "default" : "secondary"}>{address.type}</Badge>
                          {address.isDefault && (
                            <Badge variant="outline" className="text-green-700 border-green-200">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{address.name}</p>
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state} {address.zip}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your saved payment methods</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPaymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getCardIcon(method.type)}</div>
                        <div>
                          <p className="font-medium">•••• •••• •••• {method.last4}</p>
                          <p className="text-sm text-gray-600">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                        {method.isDefault && (
                          <Badge variant="outline" className="text-green-700 border-green-200">
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>Items you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockWishlist.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <h3 className="font-medium mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold">${item.price}</span>
                        <Badge variant={item.inStock ? "default" : "secondary"}>
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1" disabled={!item.inStock}>
                          Add to Cart
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="mb-2 bg-transparent">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Sarah" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Johnson" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                    <p className="text-sm text-gray-500">
                      This email will be used for order confirmations and updates.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue={user.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Date of Birth</Label>
                    <Input id="birthdate" type="date" />
                  </div>
                </div>

                <Separator />

                {/* Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select id="language" className="w-full p-2 border rounded-md">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select id="currency" className="w-full p-2 border rounded-md">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    onClick={() =>
                      toast({ title: "Profile updated", description: "Your profile has been successfully updated." })
                    }
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
