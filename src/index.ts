import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'
import FileFormat from '@sketch-hq/sketch-file-format-ts'

type StyleId = string
const sharedStyles: Map<StyleId, FileFormat.SharedStyle> = new Map()
const IGNORE_CLASSES = ['artboard', 'page']

const dls4_LayerStyle: RuleDefinition = {
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

const dls4_TextStyle: RuleDefinition = {
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

const dls4_SubPixel: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.anyLayer) {
      if (IGNORE_CLASSES.includes(layer._class)) continue
      if (!('frame' in layer)) continue

      let { x, y } = layer.frame
      x = Math.round(x * 100) / 100
      y = Math.round(y * 100) / 100

      const xValid = parseFloat(Math.abs(x % 1).toFixed(2))
      const yValid = parseFloat(Math.abs(y % 1).toFixed(2))

      if (xValid !== 0 || yValid !== 0) {
        utils.report((`This layer position is placed on sub-pixel (${x}, ${y})`), layer)
      }
    }

  },
  name: 'dls4-assistant/SubPixel',
  title: 'Layers on Subpixel',
  description: 'Check layers are positioning on subpixel',
}

const dls4_UnstyledLayer: RuleDefinition = {
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
