import { RuleDefinition } from '@sketch-hq/sketch-assistant-types'

const IGNORE_CLASSES = ['artboard', 'page']

export const dls4_UnstyledLayer: RuleDefinition = {
    rule: async (context) => {
      const { utils } = context
      
      for (const layer of utils.objects.anyLayer) {
        if (IGNORE_CLASSES.includes(layer._class)) continue
        if (layer.sharedStyleID == undefined) {
          utils.report(`This layer do not have Shared Style`, layer)
        }
      }
  
    },
    name: 'dls4-assistant/UnstyledLayers',
    title: 'Layers do not use shared style',
    description: 'Report layers do not have shared style',
  }