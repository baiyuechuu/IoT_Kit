import { Card } from "@/components/ui/card";
import { Zap, Users, BarChart3, Settings } from "lucide-react";

export default function Mainfest() {
	return (
		<Card className="bg-card/50 backdrop-blur-sm border-border/50 w-[350px] md:w-[400px] h-[450px] flex flex-col items-center justify-center">
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
	);
}
