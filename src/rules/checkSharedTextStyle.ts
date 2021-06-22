import { RuleDefinition } from '@sketch-hq/sketch-assistant-types'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

type StyleId = string
const sharedStyles: Map<StyleId, FileFormat.SharedStyle> = new Map()

export const dls4_TextStyle: RuleDefinition = {
    rule: async (context) => {
      const { utils } = context
      
  
      for (const sharedStyle of utils.objects.sharedStyle) {
        if (typeof sharedStyle.do_objectID === 'string') {
          sharedStyles.set(sharedStyle.do_objectID, sharedStyle)
        }
      }
  
      for (const text of utils.objects.text) {
        if (typeof text.sharedStyleID !== 'string') continue
        const sharedStyle = sharedStyles.get(text.sharedStyleID)
        if (!sharedStyle) continue
        if (!utils.textStyleEq(text.style, sharedStyle.value)) {
          utils.report(`This Textstyle is modified from its ${sharedStyle.value}`, text)
        }
      }
  
    },
    name: 'dls4-assistant/TextStyle',
    title: 'Out-of-sync Textstyle',
    description: 'Report layers that out-of-sync with text style',
  }