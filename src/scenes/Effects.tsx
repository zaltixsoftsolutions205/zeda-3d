import { EffectComposer, N8AO, Bloom, Vignette, ToneMapping, SMAA, BrightnessContrast, HueSaturation } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

/** Cinematic finishing: contact-shadow ambient occlusion, soft bloom, grade and vignette (desktop only). */
export default function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO aoRadius={1.8} distanceFalloff={1.2} intensity={2.4} quality="medium" halfRes color="#10261c" />
      <Bloom mipmapBlur intensity={0.38} luminanceThreshold={0.92} luminanceSmoothing={0.2} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <HueSaturation saturation={0.08} />
      <BrightnessContrast contrast={0.08} brightness={0} />
      <Vignette offset={0.25} darkness={0.55} />
      <SMAA />
    </EffectComposer>
  )
}
