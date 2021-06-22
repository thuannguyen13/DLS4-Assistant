import { RuleDefinition } from '@sketch-hq/sketch-assistant-types'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

type StyleId = string
const sharedStyles: Map<StyleId, FileFormat.SharedStyle> = new Map()

export const dls4_LayerStyle: RuleDefinition = {
    rule: async (context) => {
    
      const { utils } = context
  
      for (const sharedStyle of utils.objects.sharedStyle) {
        if (typeof sharedStyle.do_objectID === 'string') {
          sharedStyles.set(sharedStyle.do_objectID, sharedStyle)
        }
      }
  
      for (const layer of utils.objects.anyLayer) {
        if (typeof layer.sharedStyleID !== 'string') continue
        const sharedStyle = sharedStyles.get(layer.sharedStyleID)
        if (!sharedStyle) continue
        if (!layer.style || !utils.styleEq(layer.style, sharedStyle.value)) {
          utils.report(`This Textstyle is modified from its ${sharedStyle.value}`, layer)
        }
      }
  
    },
    name: 'dls4-assistant/LayerStyle',
    title: 'Out-of-sync Layerstyle',
    description: 'Report layers that out-of-sync with shared style',
  }