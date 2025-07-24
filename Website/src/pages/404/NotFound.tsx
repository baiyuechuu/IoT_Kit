import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<Card className="p-8 max-w-md w-full mx-4 text-center">
				<div className="mb-6">
					<h1 className="text-9xl font-bold text-primary">404</h1>
					<h2 className="text-2xl font-semibold text-foreground mb-2">
						Page not found
					</h2>
					<p className="text-muted-foreground">
						Sorry, the page you are looking for does not exist or has been moved.
					</p>
				</div>
				<div className="space-y-4">
					<Button asChild className="w-full">
						<Link to="/">
							Back to Home
						</Link>
					</Button>
					<Button variant="outline" asChild className="w-full">
						<Link to="/dashboard">
							Go to Dashboard
						</Link>
					</Button>
				</div>
			</Card>
		</div>
	);
} 