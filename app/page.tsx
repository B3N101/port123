"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Html, OrbitControls, useGLTF } from "@react-three/drei";

function Loader() {
	return <Html center>Loading robot.glb...</Html>;
}

function Model() {
	const { scene } = useGLTF("/robot.glb");

	return (
		<Center>
			<primitive object={scene} />
		</Center>
	);
}

useGLTF.preload("/robot.glb");

function SceneCanvas() {
	return (
		<Canvas camera={{ fov: 45, position: [0, 1.2, 3.8] }}>
			<color attach="background" args={["#070b14"]} />
			<ambientLight intensity={0.8} />
			<directionalLight position={[2, 3, 2]} intensity={1.6} />
			<Suspense fallback={<Loader />}>
				<Model />
			</Suspense>
			<OrbitControls enablePan={false} />
		</Canvas>
	);
}

function ProjectCanvas() {
	return (
		<div className="project-canvas viewer-canvas">
			<div className="viewer-mount">
				<SceneCanvas />
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<main className="portfolio-root">
			<div className="galaxy-backdrop" aria-hidden="true" />

			<section className="hero-shell">
				<p className="hero-kicker">Ben Feuer</p>
				<h1 className="hero-title">Simple GLB Visualizer</h1>
				<p className="hero-description">
					A minimal React Three Fiber setup for robot.glb with basic lighting,
					loader fallback, and orbit controls.
				</p>
			</section>

			<section className="projects-shell" aria-label="3D model canvas showcase">
				<article className="project-card">
					<div className="project-meta">
						<p className="project-index">Model</p>
						<h2 className="project-title">robot.glb</h2>
						<p className="project-tagline">React Three Fiber + drei</p>
						<p className="project-description">
							This version uses a standard non-KTX GLB pipeline for reliable
							browser loading and a straightforward viewer setup.
						</p>
					</div>
					<ProjectCanvas />
				</article>
			</section>

			<footer className="portfolio-footer">
				Ben Feuer • Three.js Canvas • 2026
			</footer>
		</main>
	);
}
