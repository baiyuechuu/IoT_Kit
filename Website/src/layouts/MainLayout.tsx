import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ModeToggle } from "@/components/ModeToggle";

export default function MainLayout() {
	return (
		<div className="relative">
			<Navbar />
			<Outlet />
			<div className="fixed bottom-3 right-3">
				<ModeToggle />
			</div>
		</div>
	);
}
