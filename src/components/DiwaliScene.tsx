import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/** A small, self-contained WebGL diya sculpture for the hero. */
export default function DiwaliScene() {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = host.current
    if (!element) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 0.15, 8)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    element.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffdfb0, 1.6))
    const key = new THREE.PointLight(0xffb34f, 95, 18)
    key.position.set(0, 2.1, 3)
    scene.add(key)
    const pinkRim = new THREE.PointLight(0xe45b9a, 24, 12)
    pinkRim.position.set(-3, -1, 1)
    scene.add(pinkRim)

    const bowlProfile = [
      new THREE.Vector2(0.0, -0.7), new THREE.Vector2(0.45, -0.67),
      new THREE.Vector2(0.9, -0.48), new THREE.Vector2(1.28, -0.15),
      new THREE.Vector2(1.42, 0.05), new THREE.Vector2(1.35, 0.12),
      new THREE.Vector2(1.18, -0.02), new THREE.Vector2(0.82, -0.28),
      new THREE.Vector2(0.35, -0.43), new THREE.Vector2(0, -0.45),
    ]
    const bowl = new THREE.Mesh(
      new THREE.LatheGeometry(bowlProfile, 96),
      new THREE.MeshPhysicalMaterial({ color: 0x9d155f, metalness: 0.68, roughness: 0.24, clearcoat: 0.9, clearcoatRoughness: 0.18 })
    )
    bowl.position.y = -0.2
    scene.add(bowl)

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(1.37, 0.055, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0xe6ae58, metalness: 0.82, roughness: 0.22, emissive: 0x4a1d09, emissiveIntensity: 0.25 })
    )
    rim.rotation.x = Math.PI / 2
    rim.position.y = -0.08
    scene.add(rim)

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.085, 0.55, 20),
      new THREE.MeshStandardMaterial({ color: 0x4b2d26, roughness: 0.85 })
    )
    stem.position.set(0.12, 0.34, 0)
    stem.rotation.z = -0.16
    scene.add(stem)

    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 32, 32),
      new THREE.MeshPhysicalMaterial({ color: 0xff9a32, emissive: 0xff5b16, emissiveIntensity: 2.8, roughness: 0.2, transparent: true, opacity: 0.94 })
    )
    flame.scale.set(0.43, 1.18, 0.38)
    flame.position.set(0.12, 0.94, 0)
    scene.add(flame)
    const innerFlame = new THREE.Mesh(
      new THREE.SphereGeometry(0.27, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xffefb0 })
    )
    innerFlame.scale.set(0.34, 1.0, 0.32)
    innerFlame.position.set(0.1, 0.82, 0.12)
    scene.add(innerFlame)

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.008, 8, 140),
      new THREE.MeshBasicMaterial({ color: 0xd4a05a, transparent: true, opacity: 0.55 })
    )
    halo.position.z = -0.7
    scene.add(halo)

    const dustCount = 130
    const dustPositions = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 7
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 5
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 2
    }
    const dustGeometry = new THREE.BufferGeometry()
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xc18a45, size: 0.025, transparent: true, opacity: 0.72, sizeAttenuation: true }))
    scene.add(dust)

    let width = 1, height = 1, raf = 0, pointerX = 0, pointerY = 0, tick = 0
    const resize = () => {
      width = Math.max(1, element.clientWidth)
      height = Math.max(1, element.clientHeight)
      camera.aspect = width / height
      camera.position.z = width < 480 ? 9.3 : 8
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const render = () => {
      tick += 0.012
      bowl.rotation.z = Math.sin(tick * 0.55) * 0.025
      flame.scale.y = 1.18 + Math.sin(tick * 4.2) * 0.07
      flame.scale.x = 0.43 + Math.sin(tick * 3.1) * 0.025
      halo.rotation.z = tick * 0.035
      dust.rotation.y = tick * 0.018
      camera.position.x += (pointerX * 0.22 - camera.position.x) * 0.025
      camera.position.y += ((0.15 - pointerY * 0.14) - camera.position.y) * 0.025
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      if (!reduced) raf = window.requestAnimationFrame(render)
    }
    resize()
    render()
    window.addEventListener('resize', resize)
    element.addEventListener('pointermove', move)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      element.removeEventListener('pointermove', move)
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach(material => material.dispose())
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={host} className="diwali-scene" role="img" aria-label="A glowing three-dimensional golden and magenta diya lamp" />
}
