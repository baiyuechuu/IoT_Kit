import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import {
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

export default function Waitlist() {
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);
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
		<Card className="bg-card/50 backdrop-blur-sm border-border/50 w-[350px] h-[400px] flex flex-col items-center justify-center">
			<CardHeader className="text-center w-full">
				<div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
					<Bell className="w-8 h-8 text-primary" />
				</div>
				<CardTitle className="text-2xl">Join the Waitlist</CardTitle>
				<CardDescription className="text-lg">
					Be among the first to experience the future of IoT development
				</CardDescription>
			</CardHeader>
			<h3 className="text-lg font-semibold text-center">Get Early Access</h3>
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
								Successfully subscribed! We'll notify you when we launch.
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
