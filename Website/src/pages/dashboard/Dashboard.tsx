import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Users,
	BarChart3,
	Settings,
	Bell,
	Mail,
	CheckCircle,
	Clock,
	TrendingUp,
	Activity,
	Target,
	Zap,
} from "lucide-react";

export default function Dashboard() {
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (email) {
			setIsSubscribed(true);
			setEmail("");
			// Here you would typically send the email to your backend
			setTimeout(() => setIsSubscribed(false), 3000);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			<div className="flex flex-col items-center justify-center">
				{/* Header */}
				<div className="text-center mb-8 mt-32">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
						IoT Kit Dashboard
					</h1>
					<p className="text-muted-foreground text-lg">
						Your gateway to the future of IoT development
					</p>
				</div>

				{/* Main Content */}
				<div className="max-w-6xl flex flex-col justify-center">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="space-y-6"
					>
						<TabsList className="mx-auto rounded-full">
							<TabsTrigger
								value="waitlist"
								className="flex items-center gap-2 rounded-full"
							>
								Waitlist
							</TabsTrigger>
							<TabsTrigger
								value="mainfest"
								className="flex items-center rounded-full"
							>
								Mainfest
							</TabsTrigger>
						</TabsList>

						{/* Waitlist Tab */}
						<TabsContent value="waitlist" className="space-y-6 w-[350px] h-[400px] mx-auto">
							<Card className="bg-card/50 backdrop-blur-sm border-border/50 w-[350px] h-[400px] flex flex-col items-center justify-center">
								<CardHeader className="text-center w-full">
									<div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
										<Bell className="w-8 h-8 text-primary" />
									</div>
									<CardTitle className="text-2xl">Join the Waitlist</CardTitle>
									<CardDescription className="text-lg">
										Be among the first to experience the future of IoT
										development
									</CardDescription>
								</CardHeader>
								<h3 className="text-lg font-semibold text-center">
									Get Early Access
								</h3>
								<CardContent className="space-y-6">
									{/* Email Subscription */}
									<div className="space-y-4">
										<form onSubmit={handleSubscribe} className="space-y-4">
											<div className="flex gap-2 p-3 rounded-full bg-muted/30">
												<Input
													type="email"
													placeholder="Enter your email"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													className="rounded-full"
													required
												/>
												<Button type="submit" className="px-4 rounded-full">
													Subscribe
												</Button>
											</div>
										</form>

										{isSubscribed && (
											<div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
												<CheckCircle className="w-5 h-5 text-green-500" />
												<span className="text-green-700 dark:text-green-400">
													Successfully subscribed! We'll notify you when we
													launch.
												</span>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="mainfest" className="space-y-6 w-[350px] h-[400px] mx-auto">
							<Card className="bg-card/50 backdrop-blur-sm border-border/50 w-[350px] h-[400px] flex flex-col items-center justify-center">
								{/* Features Preview */}
								<div className="space-y-4 px-5">
									<h3 className="text-lg font-semibold">What's Coming</h3>
									<div className="grid grid-cols-1 gap-4">
										<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
											<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
												<Zap className="w-4 h-4 text-primary" />
											</div>
											<div>
												<h4 className="font-medium">Real-time Monitoring</h4>
											</div>
										</div>
										<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
											<div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
												<Users className="w-4 h-4 text-blue-500" />
											</div>
											<div>
												<h4 className="font-medium">Team Collaboration</h4>
											</div>
										</div>
										<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
											<div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
												<BarChart3 className="w-4 h-4 text-green-500" />
											</div>
											<div>
												<h4 className="font-medium">Advanced Analytics</h4>
											</div>
										</div>
										<div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
											<div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
												<Settings className="w-4 h-4 text-purple-500" />
											</div>
											<div>
												<h4 className="font-medium">Custom Integrations</h4>
											</div>
										</div>
									</div>
								</div>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
