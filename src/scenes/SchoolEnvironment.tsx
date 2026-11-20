import { Building } from './parts/Building'
import { Grounds } from './parts/Grounds'
import { Playground } from './parts/Playground'
import { Buses } from './parts/Bus'
import { digitalLights } from './sceneState'

/** The complete, connected campus: building (with interiors), grounds, playground and vehicles. */
export default function SchoolEnvironment({ lite }: { lite: boolean }) {
  return (
    <group
      ref={(g) => {
        digitalLights.school = g
      }}
    >
      <Building lite={lite} />
      <Grounds lite={lite} />
      <Playground lite={lite} />
      <Buses />
    </group>
  )
}
