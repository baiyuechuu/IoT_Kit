import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Mainfest from "./components/Mainfest";
import Waitlist from "./components/Waitlist";

export default function Dashboard() {
	const isDevelopment = import.meta.env.DEV;

  // only work in development
	if (isDevelopment) {
		const DevPage = React.lazy(() => import("./dev/DevPage"));
		return <DevPage />;
	}

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
					<Tabs className="space-y-6" defaultValue="waitlist">
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

						<TabsContent
							value="waitlist"
							className="space-y-6 w-[400px] h-[500px]"
						>
							<Waitlist />
						</TabsContent>
						<TabsContent
							value="mainfest"
							className="space-y-6 w-[400px] h-[500px]"
						>
							<Mainfest />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
