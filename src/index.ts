import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'
import FileFormat from '@sketch-hq/sketch-file-format-ts'
import { calcLum, calcContrast } from './helper'

type StyleId = string
const sharedStyles: Map<StyleId, FileFormat.SharedStyle> = new Map()
const IGNORE_CLASSES = ['artboard', 'page']

const checkSharedLayerStyle: RuleDefinition = {
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
  name: 'dls4-assistant/checkSharedLayerStyle',
  title: 'Out-of-sync Layerstyle',
  description: 'Report layers that out-of-sync with shared style',
}

const checkSharedTextStyle: RuleDefinition = {
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
  name: 'dls4-assistant/checkSharedTextStyle',
  title: 'Out-of-sync Textstyle',
  description: 'Report layers that out-of-sync with text style',
}

const checkSubpixel: RuleDefinition = {
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
  name: 'dls4-assistant/checkSubpixel',
  title: 'Layers on Subpixel',
  description: 'Check layers are positioning on subpixel',
}

const checkUnstyledLayers: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.anyLayer) {
      if (IGNORE_CLASSES.includes(layer._class)) continue
      if (layer.sharedStyleID == undefined) {
        utils.report(`This layer do not have Shared Style`, layer)
      }
    }

  },
  name: 'dls4-assistant/checkUnstyledLayers',
  title: 'Layers do not use shared style',
  description: 'Report layers do not have shared style',
}

const

  calcLum(2, 1)

const assistant: AssistantPackage = async () => {
  return {
    name: 'dls4-assistant',
    rules: [checkUnstyledLayers, checkSharedLayerStyle, checkSharedTextStyle, checkSubpixel],
    config: {
      rules: {
        'dls4-assistant/checkSharedLayerStyle': { active: true },
        'dls4-assistant/checkSharedTextStyle': { active: true },
        'dls4-assistant/checkSubpixel': { active: true },
        'dls4-assistant/checkUnstyledLayers': { active: true }
      },
    },
  }
}

export default assistant
