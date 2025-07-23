import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="h-screen flex flex-col items-center justify-center relative gap-6 overflow-hidden">
			<div
				className="absolute inset-0 z-0"
				style={{
					background: "transparent",
					backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.1) 1px, transparent 1px)
      `,
					backgroundSize: "33px 33px",
				}}
			/>
			<div className="absolute -top-20 -left-30 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/15 dark:to-purple-500/15 rounded-full blur-3xl"></div>
			<div className="absolute top-1/2 right-10 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-rose-400/20 dark:from-pink-500/15 dark:to-rose-500/15 rounded-full blur-3xl"></div>
			<div className="absolute bottom-10 left-1/4 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 dark:from-cyan-500/15 dark:to-teal-500/15 rounded-full blur-3xl"></div>
			<div className="absolute top-1/2 left-1/2 -translate-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 dark:from-indigo-500/15 dark:to-blue-500/15 rounded-full blur-3xl"></div>
			<div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-br from-violet-400/20 to-purple-400/20 dark:from-violet-500/15 dark:to-purple-500/15 rounded-full blur-3xl"></div>
			<div className="flex flex-col items-center justify-center z-10 max-w-4xl">
				<h1 className="font-geist font-bold text-5xl mb-5 text-center">
					UI Kit for IoT & ESP32 Dashboard
				</h1>
				<p className="font-geist text-xl text-center max-w-2xl text-gray-600 dark:text-gray-300">
					Build sleek, real-time dashboards to monitor and control your ESP32.
					Fast setup, responsive design, and ready-to-use components for any
					smart project
				</p>
			</div>
			<div className="flex flex-col md:flex-row items-center justify-center gap-5">
				<Link to="/uikit">
					<RainbowButton>Explore UI Kit</RainbowButton>
				</Link>
				<Link to="/dashboard">
					<RainbowButton variant={"reverse"}>Browse Dashboard</RainbowButton>
				</Link>
			</div>
		</div>
	);
}
