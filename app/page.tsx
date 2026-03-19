"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Clone,
	Environment,
	Html,
	OrbitControls,
	useGLTF,
} from "@react-three/drei";
import type { CSSProperties } from "react";
import type { Group } from "three";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

type Project = {
	title: string;
	tagline: string;
	description: string;
	skills: string[];
	accent: string;
	modelScale: number;
	spin: number;
};

const projects: Project[] = [
	{
		title: "Nebula Commerce",
		tagline: "Immersive storefront analytics and merchandising",
		description:
			"A concept platform that turns live commerce metrics into visual scenes, helping teams tune campaigns in real time while keeping the customer experience cinematic.",
		skills: ["Next.js", "TypeScript", "Design Systems", "Data Visualization"],
		accent: "#7dd3fc",
		modelScale: 1.3,
		spin: 0.2,
	},
	{
		title: "Orbit Ops Dashboard",
		tagline: "Mission control for distributed product teams",
		description:
			"A command-center style dashboard for release health, velocity, and incident awareness, designed for fast decisions during launch windows.",
		skills: ["Product Strategy", "React", "Node.js", "Observability"],
		accent: "#f9a8d4",
		modelScale: 1.45,
		spin: -0.16,
	},
	{
		title: "Pulse Media Engine",
		tagline: "Adaptive storytelling across channels",
		description:
			"A media pipeline prototype that personalizes content journeys based on behavior signals, balancing performance marketing with editorial quality.",
		skills: [
			"UX Architecture",
			"A/B Testing",
			"Performance",
			"Content Systems",
		],
		accent: "#c4b5fd",
		modelScale: 1.35,
		spin: 0.22,
	},
	{
		title: "Starlight Portfolio Lab",
		tagline: "Experimental interfaces for brand identity",
		description:
			"A playground for high-fidelity interactions and expressive visual systems, built to test bold concepts before they move into production.",
		skills: [
			"Creative Direction",
			"Three.js",
			"Motion",
			"Frontend Engineering",
		],
		accent: "#fcd34d",
		modelScale: 1.42,
		spin: -0.14,
	},
];

function Model({ scale, spin }: { scale: number; spin: number }) {
	const groupRef = useRef<Group>(null);
	const { gl } = useThree();
	const ktx2Loader = useMemo(() => {
		const loader = new KTX2Loader();
		loader.setTranscoderPath(
			"https://unpkg.com/three@0.170.0/examples/jsm/libs/basis/",
		);
		loader.detectSupport(gl);
		return loader;
	}, [gl]);

	const { scene } = useGLTF("/output2.glb", false, false, loader => {
		loader.setKTX2Loader(ktx2Loader as any);
		loader.setMeshoptDecoder(MeshoptDecoder);
	});

	useEffect(() => {
		return () => {
			ktx2Loader.dispose();
		};
	}, [ktx2Loader]);

	useFrame((_, delta) => {
		if (!groupRef.current) {
			return;
		}

		groupRef.current.rotation.y += delta * spin;
	});

	return (
		<group ref={groupRef}>
			<Clone object={scene} scale={scale} />
		</group>
	);
}

function Loader() {
	return <Html center>Loading model...</Html>;
}

function ProjectModel({
	scale,
	spin,
	accent,
}: {
	scale: number;
	spin: number;
	accent: string;
}) {
	const canvasStyle = {
		"--accent": accent,
	} as CSSProperties;

	return (
		<div className="project-canvas" style={canvasStyle}>
			<Canvas camera={{ position: [0, 1.15, 3.25], fov: 44 }}>
				<color attach="background" args={["#040404"]} />
				<fog attach="fog" args={["#050814", 5, 11]} />
				<ambientLight intensity={0.55} />
				<pointLight intensity={35} position={[0, 2, 2]} color={accent} />
				<directionalLight position={[3, 5, 3]} intensity={2} color="#dbeafe" />
				<Suspense fallback={<Loader />}>
					<Environment files="/background.exr" />
					<Model scale={scale} spin={spin} />
				</Suspense>
				<OrbitControls
					enablePan={false}
					enableZoom
					zoomSpeed={0.8}
					minDistance={0.75}
					maxDistance={3}
					maxPolarAngle={4}
					minPolarAngle={0.1}
				/>
			</Canvas>
		</div>
	);
}

export default function Home() {
	return (
		<main className="portfolio-root">
			<div className="galaxy-backdrop" aria-hidden="true" />

			<section className="hero-shell">
				<p className="hero-kicker">Ben Feuer</p>
				<h1 className="hero-title">
					Designing products that feel cosmic but ship on Earth.
				</h1>
				<p className="hero-description">
					This scrolling portfolio is a modular showcase using one GLB model in
					four project narratives. Swap the project details anytime while
					keeping the visual system intact.
				</p>
			</section>

			<section className="projects-shell" aria-label="Project portfolio">
				{projects.map((project, index) => (
					<article className="project-card" key={project.title}>
						<div className="project-meta">
							<p className="project-index">
								Project {String(index + 1).padStart(2, "0")}
							</p>
							<h2 className="project-title">{project.title}</h2>
							<p className="project-tagline">{project.tagline}</p>
							<p className="project-description">{project.description}</p>

							<h3 className="skills-heading">Skills</h3>
							<ul
								className="skills-list"
								aria-label={`${project.title} skills`}
							>
								{project.skills.map(skill => (
									<li className="skill-pill" key={skill}>
										{skill}
									</li>
								))}
							</ul>
						</div>

						<ProjectModel
							accent={project.accent}
							scale={project.modelScale}
							spin={project.spin}
						/>
					</article>
				))}
			</section>

			<footer className="portfolio-footer">
				Ben Feuer • Galactic Portfolio Concept • 2026
			</footer>
		</main>
	);
}
