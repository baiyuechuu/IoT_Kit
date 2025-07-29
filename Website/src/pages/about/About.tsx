import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function About() {
	const teamMembers = [
		{
			name: "Tran Duc Tai",
			role: "Web Developer",
			avatar: "/tai.jpg",
			github: "https://github.com/baiyuechuu",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
			color:
				"bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-300 dark:border-pink-700/60",
		},
		{
			name: "Nguyen Dinh Thong",
			role: "Embedded Systems Engineer",
			avatar: "/thong.jpeg",
			github: "https://github.com/ichima28",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
			color:
				"bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/60",
		},
		{
			name: "Luu Phuc Khang",
			role: "Embedded Systems Engineer",
			avatar: "/khang.jpeg",
			github: "https://github.com/Cloudydesuu",
			linkedin: "https://linkedin.com",
			twitter: "https://twitter.com",
			color:
				"bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/60",
		},
		{
			name: "Bui Quang Tan",
			role: "Embedded Systems Engineer",
			avatar: "/tan.jpg",
			github: "https://github.com/buiTannn",
			linkedin: "https://www.linkedin.com/in/tan-bui-quang-963682345/",
			twitter: "https://twitter.com",
			color:
				"bg-yellow-100 dark:bg-yellow-900/30 text-green-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/60",
		},
	];

	return (
		<div className="min-h-screen bg-background flex justify-center md:pt-24">
			{/* Background Effects */}
			<div
				className="fixed inset-0 z-0"
				style={{
					background: "transparent",
					backgroundImage: `
						linear-gradient(to right, rgba(75, 85, 99, 0.05) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(75, 85, 99, 0.05) 1px, transparent 1px)
					`,
					backgroundSize: "33px 33px",
				}}
			/>
			<div className="fixed -top-20 -left-30 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl z-0"></div>
			<div className="fixed top-1/2 right-10 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-rose-400/10 dark:from-pink-500/10 dark:to-rose-500/10 rounded-full blur-3xl z-0"></div>

			<div className="relative z-10 px-4 max-w-7xl mx-auto pt-24 md:py-0">
				{/* Team Section */}
				<section className="mb-16 flex flex-col items-center justify-center">
					<div className="text-center mb-5">
						<h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
						<p className="text-lg text-muted-foreground">
							The individuals behind this project
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-8 w-full">
						{teamMembers.map((member, index) => (
							<div
								key={index}
								className="relative flex flex-col items-center gap-3 justify-center rounded-lg"
							>
								<div
									className={`flex items-center justify-center py-1 px-3 border rounded-full ${member.color}`}
								>
									{member.role}
								</div>
								<div className="flex items-center justify-center p-2 border rounded-lg bg-background relative shadow-md overflow-hidden">
									<div className="flex items-center gap-2 absolute bottom-0 right-0 border-t border-l rounded-tl-lg p-2 bg-background">
										{member.github && (
											<a
												href={member.github}
												target="_blank"
												rel="noreferrer"
												className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
											>
												<FaGithub className="h-6 w-6" />
											</a>
										)}
										{member.linkedin && (
											<a
												href={member.linkedin}
												target="_blank"
												rel="noreferrer"
												className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
											>
												<FaLinkedin className="h-6 w-6" />
											</a>
										)}
										{member.twitter && (
											<a
												href={member.twitter}
												target="_blank"
												rel="noreferrer"
												className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
											>
												<FaTwitter className="h-6 w-6" />
											</a>
										)}
									</div>

									<img
										src={member.avatar}
										alt="thong"
										className="rounded-[5px] w-40 h-40 shadow-md ring-2 ring-secondary"
									/>
									<div className="w-[200px] p-3 flex flex-col items-center justify-center relative">
										<h2 className="font-bitcnt text-[17px]">{member.name}</h2>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
