import { RuleDefinition } from '@sketch-hq/sketch-assistant-types'


const IGNORE_CLASSES = ['artboard', 'page']

export const dls4_SubPixel: RuleDefinition = {
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