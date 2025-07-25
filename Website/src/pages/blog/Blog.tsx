import { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { componentSections } from "../../content";
import { RiCodeSSlashLine } from "react-icons/ri";

export default function Blog() {
	const { section } = useParams();
	const navigate = useNavigate();
	const [activeSection, setActiveSection] = useState<string>("test");

	// Handle URL section parameter
	useEffect(() => {
		if (section) {
			setActiveSection(section);
		} else {
			// Default to first section if no section in URL
			const firstSection = componentSections[0];
			if (firstSection && firstSection.id !== activeSection) {
				setActiveSection(firstSection.id);
				navigate(`/blog/${firstSection.id}`, { replace: true });
			}
		}
	}, [section, navigate]);

	// Listen for custom section change events from search
	useEffect(() => {
		const handleSectionChange = (event: CustomEvent) => {
			const newSection = event.detail;
			setActiveSection(newSection);
			navigate(`/blog/${newSection}`);
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
	}, [navigate]);

	// Get the active section data
	const activeComponentSection = componentSections.find(
		(section) => section.id === activeSection,
	);

	const DocumentationComponent = activeComponentSection?.documentation;

	return (
		<div className="h-screen bg-background flex">
			{/* Sidebar - Fixed height with independent scroll */}
			<div className="w-14 lg:w-64 border-r border-border h-screen overflow-y-auto py-6 flex-shrink-0">
				<div className="pt-14">
					{/* Group sections by category */}
					{(() => {
						const groupedSections = componentSections.reduce(
							(acc, section) => {
								if (!acc[section.category]) {
									acc[section.category] = [];
								}
								acc[section.category].push(section);
								return acc;
							},
							{} as Record<string, typeof componentSections>,
						);

						const categoryOrder = ["components", "docs"] as const;
						const categoryTitles = {
							components: "Components",
							docs: "Docs",
						};

						return categoryOrder.map((category) => {
							const sections = groupedSections[category];
							if (!sections || sections.length === 0) return null;

							return (
								<div key={category} className="mb-3">
									<h2 className="text-xl font-semibold mb-3 hidden lg:block px-3">
										{categoryTitles[category]}
									</h2>
									<div className="space-y-1">
										{sections.map((section) => (
											<Link
												key={section.id}
												to={`/blog/${section.id}`}
												className={`w-fit lg:w-full flex items-center justify-center lg:justify-start lg:text-left px-3 mx-auto py-2 transition-colors ${
													activeSection === section.id
														? "bg-primary text-primary-foreground"
														: "hover:bg-muted"
												}`}
												title={section.title}
											>
												<span className="lg:mr-3 lg:hidden">
													<RiCodeSSlashLine className="w-5 h-5" />
												</span>
												<span className="hidden lg:inline">
													{section.title}
												</span>
											</Link>
										))}
									</div>
								</div>
							);
						});
					})()}
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
										<div className="text-muted-foreground">
											Loading documentation...
										</div>
									</div>
								}
							>
								<DocumentationComponent />
							</Suspense>
						) : (
							<div className="text-center p-8">
								<h2 className="text-2xl font-semibold mb-4">
									{activeComponentSection?.title ||
										"Welcome To The My Team Blog!"}
								</h2>
								<p className="text-muted-foreground mb-6">
									{activeComponentSection?.description || (
										<span>
											This is a blog about my team and my work. I'm writing
											about my experiences, challenges, and successes. I hope
											you enjoy reading it!
										</span>
									)}
								</p>
								<div className="text-muted-foreground">
									Details about the blog can be found on the{" "}
									<a
										href="https://github.com/baiyuechuu/IoT_Kit"
										target="_blank"
										rel="noreferrer"
										className="text-blue-500"
									>
										GitHub repository
									</a>{" "}
									and info about{" "}
									<a href="/about" rel="noreferrer" className="text-blue-500">
										My team
									</a>
									.
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
