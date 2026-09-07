/**
 * Central GSAP entry point. Plugins are registered exactly once here so that
 * sections can import a ready-to-use instance without repeating setup.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
