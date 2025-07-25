import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { componentSections } from "./components";

export default function UIKit() {
	const [searchParams] = useSearchParams();
	const [activeSection, setActiveSection] = useState<string>("mdx-setup");

	// Handle URL section parameter
	useEffect(() => {
		const sectionParam = searchParams.get("section");
		if (sectionParam) {
			setActiveSection(sectionParam);
		}
	}, [searchParams]);

	// Listen for custom section change events from search
	useEffect(() => {
		const handleSectionChange = (event: CustomEvent) => {
			setActiveSection(event.detail);
		};

		window.addEventListener(
			"uikit-section-change",
			handleSectionChange as EventListener,
		);
		return () =>
			window.removeEventListener(
				"uikit-section-change",
				handleSectionChange as EventListener,
			);
	}, []);

	// Get the active section data
	const activeComponentSection = componentSections.find(
		(section) => section.id === activeSection
	);

	const DocumentationComponent = activeComponentSection?.documentation;

	return (
		<div className="h-screen bg-background flex">
			{/* Sidebar - Fixed height with independent scroll */}
			<div className="w-16 lg:w-64 border-r border-border h-screen overflow-y-auto px-2 lg:px-4 py-6 flex-shrink-0">
				<div className="pt-14">
					<h2 className="text-xl font-semibold mb-4 hidden lg:block">
						Components
					</h2>
					<div className="space-y-2">
						{componentSections.map((section) => (
							<button
								key={section.id}
								onClick={() => setActiveSection(section.id)}
								className={`w-full flex items-center justify-center lg:justify-start lg:text-left px-2 lg:px-3 py-2 rounded-md transition-colors ${
									activeSection === section.id
										? "bg-primary text-primary-foreground"
										: "hover:bg-muted"
								}`}
								title={section.title}
							>
								<span className="lg:mr-3">{section.icon}</span>
								<span className="hidden lg:inline">{section.title}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Main Content - Fixed height with independent scroll */}
			<div className="flex-1 h-screen overflow-y-auto">
				<div className="px-4 py-6 pt-20 max-w-4xl mx-auto">
					<div className="wrapper z-10 prose prose-neutral dark:prose-invert">
						{DocumentationComponent ? (
							<Suspense 
								fallback={
									<div className="flex items-center justify-center p-8">
										<div className="text-muted-foreground">Loading documentation...</div>
									</div>
								}
							>
								<DocumentationComponent />
							</Suspense>
						) : (
							<div className="text-center p-8">
								<h2 className="text-2xl font-semibold mb-4">
									{activeComponentSection?.title || "Component"}
								</h2>
								<p className="text-muted-foreground mb-6">
									{activeComponentSection?.description || "No description available."}
								</p>
								<div className="text-muted-foreground">
									Documentation coming soon...
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
