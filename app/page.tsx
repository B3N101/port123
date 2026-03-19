"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Center, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { REVISION } from "three";

const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x/examples/jsm`;

type GltfLoaderWithKtx2 = {
	setKTX2Loader(loader: KTX2Loader): void;
};

function Loader() {
	return <Html center>Loading output.glb...</Html>;
}

function Model() {
	const { gl } = useThree();

	const ktx2Loader = useMemo(() => {
		const loader = new KTX2Loader().setTranscoderPath(
			`${THREE_PATH}/libs/basis/`,
		);
		loader.detectSupport(gl);
		return loader;
	}, [gl]);

	const { scene } = useGLTF("/output.glb", false, false, loader => {
		(loader as unknown as GltfLoaderWithKtx2).setKTX2Loader(ktx2Loader);
	});

	useEffect(() => {
		return () => {
			ktx2Loader.dispose();
		};
	}, [ktx2Loader]);

	return (
		<Center>
			<primitive object={scene} />
		</Center>
	);
}

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
					A minimal React Three Fiber setup for output.glb with basic lighting,
					loader fallback, and orbit controls.
				</p>
			</section>

			<section className="projects-shell" aria-label="3D model canvas showcase">
				<article className="project-card">
					<div className="project-meta">
						<p className="project-index">Model</p>
						<h2 className="project-title">output.glb</h2>
						<p className="project-tagline">React Three Fiber + drei</p>
						<p className="project-description">
							This version intentionally removes advanced loader/environment
							configuration and focuses on a straightforward GLB viewer.
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
