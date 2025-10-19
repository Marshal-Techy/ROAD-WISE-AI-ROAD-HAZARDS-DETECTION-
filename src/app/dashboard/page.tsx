import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Dashboard Access & Contact</h1>
        <p className="text-muted-foreground mt-2">Connect with the project or access your dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Login Section */}
        <div className="space-y-8">
            <h2 className="text-2xl font-headline font-semibold text-center">Login Portals</h2>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Authority Dashboard</CardTitle>
                    <CardDescription>For city planners and road maintenance authorities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full tech-gradient text-white">Login as Authority</Button>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Driver Dashboard</CardTitle>
                    <CardDescription>For registered drivers to view trip history and stats.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" variant="secondary">Sign In as Driver</Button>
                </CardContent>
            </Card>
        </div>

        {/* Contact Form Section */}
        <div>
          <h2 className="text-2xl font-headline font-semibold text-center mb-8">Get In Touch</h2>
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Project by Team Integrated Innovators BLR.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your Name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="your@email.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Your message..." />
                    </div>
                    <Button type="submit" className="w-full">Send Message</Button>
                </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
