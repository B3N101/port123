"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
	Bounds,
	Environment,
	Html,
	OrbitControls,
	useGLTF,
} from "@react-three/drei";
import { ACESFilmicToneMapping, Group, REVISION } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x/examples/jsm`;

type GltfLoaderExtensions = {
	setCrossOrigin(value: string): void;
	setDRACOLoader(loader: DRACOLoader): void;
	setKTX2Loader(loader: KTX2Loader): void;
	setMeshoptDecoder(decoder: unknown): void;
};

function Loader() {
	return <Html center>Loading output2.glb...</Html>;
}

function Model() {
	const groupRef = useRef<Group>(null);
	const { gl } = useThree();

	const dracoLoader = useMemo(() => {
		return new DRACOLoader().setDecoderPath(`${THREE_PATH}/libs/draco/gltf/`);
	}, []);

	const ktx2Loader = useMemo(() => {
		const loader = new KTX2Loader().setTranscoderPath(`${THREE_PATH}/libs/basis/`);
		loader.detectSupport(gl);
		return loader;
	}, [gl]);

	const { scene } = useGLTF("/output2.glb", false, false, loader => {
		const gltfLoader = loader as unknown as GltfLoaderExtensions;
		gltfLoader.setCrossOrigin("anonymous");
		gltfLoader.setDRACOLoader(dracoLoader);
		gltfLoader.setKTX2Loader(ktx2Loader);
		gltfLoader.setMeshoptDecoder(MeshoptDecoder);
	});

	useEffect(() => {
		return () => {
			dracoLoader.dispose();
			ktx2Loader.dispose();
		};
	}, [dracoLoader, ktx2Loader]);

	return <primitive ref={groupRef} object={scene} />;
}

function SceneCanvas() {
	return (
		<Canvas
			camera={{ fov: 45, near: 0.01, far: 1000, position: [1.8, 1.25, 2.6] }}
			onCreated={({ gl }) => {
				gl.toneMapping = ACESFilmicToneMapping;
				gl.toneMappingExposure = 1;
			}}
		>
			<color attach="background" args={["#050814"]} />
			<ambientLight intensity={0.65} />
			<directionalLight position={[0.5, 0, 0.866]} intensity={Math.PI} />
			<Suspense fallback={<Loader />}>
				<Environment files="/background.exr" />
				<Bounds fit clip observe margin={1.15}>
					<Model />
				</Bounds>
			</Suspense>
			<OrbitControls
				enablePan={false}
				enableDamping
				minDistance={0.65}
				maxDistance={5}
				maxPolarAngle={Math.PI * 0.9}
			/>
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
				<h1 className="hero-title">Three.js Viewer Canvas</h1>
				<p className="hero-description">
					A boilerplate-inspired viewer that loads output2.glb with KTX2 and
					Meshopt support, plus EXR-based image lighting.
				</p>
			</section>

			<section className="projects-shell" aria-label="3D model canvas showcase">
				<article className="project-card">
					<div className="project-meta">
						<p className="project-index">Model</p>
						<h2 className="project-title">output2.glb</h2>
						<p className="project-tagline">Direct three.js implementation</p>
						<p className="project-description">
							This canvas uses GLTFLoader with DRACO, KTX2, and Meshopt,
							mirroring the architecture of the reference viewer while staying
							lightweight for a Next.js page.
						</p>
					</div>
					<ProjectCanvas />
				</article>
			</section>

			<footer className="portfolio-footer">Ben Feuer • Three.js Canvas • 2026</footer>
		</main>
	);
}
