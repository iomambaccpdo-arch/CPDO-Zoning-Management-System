import { useState, useEffect } from "react"
import { useAuthStore } from "~/store/auth"
import { ProfileService } from "~/api/ProfileService"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { toast } from "sonner"
import { Loader2, Edit2, X } from "lucide-react"

export default function ProfilePage() {
    const { user, setUser } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        designation: "",
        section: "",
        password: "",
        password_confirmation: "",
    })

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                middle_name: user.middle_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                designation: user.designation || "",
                section: user.section || "",
                password: "",
                password_confirmation: "",
            })
        }
    }, [user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const updatedUser = await ProfileService.updateProfile(formData)
            setUser(updatedUser)
            toast.success("Profile updated successfully")
            setFormData((prev) => ({ ...prev, password: "", password_confirmation: "" }))
            setIsEditing(false)
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to update profile"
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <div className="flex flex-col h-full bg-zinc-50 border-t border-zinc-200">
            <div className="px-5 py-3 border-b bg-white shrink-0">
                <h1 className="text-[16px] font-bold text-[#1a202c] tracking-tight uppercase leading-none mt-1">
                    Profile Management
                </h1>
            </div>
            <div className="flex-1 p-5 overflow-auto flex justify-center">
                <div className="w-full max-w-3xl">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div className="space-y-1 mt-1.5 pt-0">
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    View or update your account's profile information and email address.
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant={isEditing ? "outline" : "default"}
                                className={!isEditing ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                                onClick={() => {
                                    setIsEditing(!isEditing)
                                    // Reset form data if canceling
                                    if (isEditing && user) {
                                        setFormData({
                                            first_name: user.first_name || "",
                                            middle_name: user.middle_name || "",
                                            last_name: user.last_name || "",
                                            email: user.email || "",
                                            designation: user.designation || "",
                                            section: user.section || "",
                                            password: "",
                                            password_confirmation: "",
                                        })
                                    }
                                }}
                            >
                                {isEditing ? <><X className="mr-2 h-4 w-4" /> Cancel</> : <><Edit2 className="mr-2 h-4 w-4" /> Edit Profile</>}
                            </Button>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="middle_name">Middle Name</Label>
                                        <Input
                                            id="middle_name"
                                            name="middle_name"
                                            value={formData.middle_name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="designation">Designation</Label>
                                        <Input
                                            id="designation"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="section">Section</Label>
                                        <Input
                                            id="section"
                                            name="section"
                                            value={formData.section}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            required
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="pt-4 border-t mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="password">New Password</Label>
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Leave blank to keep current"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    type="password"
                                                    value={formData.password_confirmation}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            {isEditing && (
                                <CardFooter className="flex justify-end mt-5">
                                    <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            )}
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
