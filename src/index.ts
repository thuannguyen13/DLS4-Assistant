import { AssistantPackage } from '@sketch-hq/sketch-assistant-types'
import { dls4_SubPixel } from './rules/checkSubPixel'
import { dls4_LayerStyle } from './rules/checkSharedLayerStyle'
import { dls4_TextStyle } from './rules/checkSharedTextStyle'
import { dls4_UnstyledLayer } from './rules/checkUnstyledLayers'

const assistant: AssistantPackage = async () => {
  return {
    name: 'dls4-assistant',
    rules: [dls4_UnstyledLayer, dls4_LayerStyle, dls4_TextStyle, dls4_SubPixel],
    config: {
      rules: {
        'dls4-assistant/LayerStyle': { active: true },
        'dls4-assistant/TextStyle': { active: true },
        'dls4-assistant/SubPixel': { active: true },
        'dls4-assistant/UnstyledLayers': { active: true }
      },
    },
  }
}

export default assistant
