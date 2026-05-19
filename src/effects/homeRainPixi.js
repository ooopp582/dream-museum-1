import {
  Application,
  Assets,
  Container,
  DisplacementFilter,
  Sprite,
  Text,
  TextStyle,
} from 'pixi.js'
import { ShockwaveFilter } from 'pixi-filters'

import bgUrl from '../assets/background.jpg'
import dispUrl from '../assets/displacement_map.jpg'
import titleUrl from '../assets/title2.png'

/**
 * @typedef {object} HomeRainPixiOptions
 * @property {HTMLElement | null} [interactionRoot] 指针事件根节点（一般为首页 section），用于划过扰动与点击涟漪。
 */

/**
 * 在宿主元素内挂载首页雨雪/波纹：仅背景参与位移/涟漪滤镜，标题单独一层保持静止。
 * 画布 pointer-events: none；划过/点击在 interactionRoot 上监听。
 *
 * @param {HTMLElement | null} hostEl
 * @param {HomeRainPixiOptions} [options]
 */
export async function mountHomeRainPixi(hostEl, options = {}) {
  if (!hostEl) return () => {}

  const { interactionRoot = null } = options

  const app = new Application()
  await app.init({
    resizeTo: hostEl,
    antialias: true,
    backgroundAlpha: 0,
    preference: 'webgl',
  })

  const canvas = app.canvas
  canvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;'
  hostEl.appendChild(canvas)

  await Assets.load([
    { alias: 'bg', src: bgUrl },
    { alias: 'displacement_map', src: dispUrl },
    { alias: 'titleImg', src: titleUrl },
  ])

  const bgLayer = new Container()
  app.stage.addChild(bgLayer)

  const backgroundImage = Sprite.from('bg')
  backgroundImage.anchor.set(0.5)

  const titleSprite = Sprite.from('titleImg')
  titleSprite.anchor.set(0.5)
  titleSprite.rotation = (5 * Math.PI) / 180

  const chineseStyle = new TextStyle({
    fontFamily: '"Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif',
    fontSize: 28,
    fill: 0xffffff,
    letterSpacing: 5,
    dropShadow: {
      angle: Math.PI / 2,
      blur: 12,
      color: '#000000',
      distance: 4,
    },
  })
  const chineseTitle = new Text({ text: '梦境博物馆', style: chineseStyle })
  chineseTitle.anchor.set(0.5)

  const titleLayer = new Container()
  titleLayer.addChild(titleSprite)
  titleLayer.addChild(chineseTitle)

  const displacementSprite = Sprite.from('displacement_map')
  displacementSprite.texture.source.addressMode = 'repeat'

  bgLayer.addChild(backgroundImage)
  bgLayer.addChild(displacementSprite)

  const displacementFilter = new DisplacementFilter({
    sprite: displacementSprite,
    scale: { x: 30, y: 30 },
  })

  const shockwaveFilter1 = createShockwaveFilter(app, 40, 30, 200, 80)
  const shockwaveFilter2 = createShockwaveFilter(app, 80, 45, 240, 100)
  const shockwaveFilter3 = createShockwaveFilter(app, 105, 65, 160, 140)

  const pointerRipple = new ShockwaveFilter({
    center: { x: app.screen.width / 2, y: app.screen.height / 2 },
    amplitude: 0,
    wavelength: 48,
    speed: 380,
    radius: 105,
    brightness: 1,
  })

  const clickRipple = new ShockwaveFilter({
    center: { x: -9999, y: -9999 },
    amplitude: 0,
    wavelength: 130,
    speed: 540,
    radius: 420,
    brightness: 1,
  })

  bgLayer.filters = [
    displacementFilter,
    shockwaveFilter1,
    shockwaveFilter2,
    shockwaveFilter3,
    pointerRipple,
    clickRipple,
  ]

  app.stage.addChild(titleLayer)

  function createShockwaveFilter(appRef, amplitude, wavelength, speed, radius) {
    return new ShockwaveFilter({
      center: {
        x: Math.random() * appRef.screen.width,
        y: Math.random() * appRef.screen.height,
      },
      amplitude,
      wavelength,
      speed,
      radius,
    })
  }

  function layout() {
    const w = app.screen.width
    const h = app.screen.height
    if (w < 1 || h < 1) return

    const tw = backgroundImage.texture.width
    const th = backgroundImage.texture.height
    const cover = Math.max(w / tw, h / th)
    backgroundImage.scale.set(cover)
    backgroundImage.position.set(w / 2, h / 2)

    const maxTitleW = Math.min(860, w - 40)
    const maxTitleH = 200
    const iw = titleSprite.texture.width
    const ih = titleSprite.texture.height
    const scale = Math.min(maxTitleW / iw, maxTitleH / ih, 1)
    titleSprite.scale.set(scale)

    chineseStyle.fontSize = Math.max(18, Math.min(28, w * 0.035))

    const gap = Math.max(12, h * 0.018)
    titleSprite.position.set(0, 0)
    const fs = chineseStyle.fontSize
    chineseTitle.position.set(0, ih * scale * 0.5 + gap + fs * 0.72)

    titleLayer.position.set(w / 2, h * 0.40)

    displacementSprite.position.set(0, 0)
    displacementSprite.width = w
    displacementSprite.height = h
  }

  layout()

  const ro = new ResizeObserver(() => layout())
  ro.observe(hostEl)

  let pointerInside = false
  let targetPx = app.screen.width / 2
  let targetPy = app.screen.height / 2
  let smoothPx = targetPx
  let smoothPy = targetPy
  const POINTER_LERP = 0.14
  const POINTER_AMPLITUDE = 48
  let clickBurstActive = false

  function clientToCanvas(clientX, clientY) {
    const r = hostEl.getBoundingClientRect()
    const x = clientX - r.left
    const y = clientY - r.top
    const w = app.screen.width
    const h = app.screen.height
    return {
      x: Math.min(Math.max(x * (w / Math.max(r.width, 1)), 0), w),
      y: Math.min(Math.max(y * (h / Math.max(r.height, 1)), 0), h),
    }
  }

  function isUiTarget(target) {
    if (!target || !(target instanceof Element)) return false
    return Boolean(target.closest('.module-button, .top-actions, .icon-link'))
  }

  function onPointerMove(ev) {
    if (!interactionRoot) return
    const { x, y } = clientToCanvas(ev.clientX, ev.clientY)
    targetPx = x
    targetPy = y
    pointerInside = true
    if (isUiTarget(ev.target)) {
      pointerRipple.amplitude = 0
      return
    }
    pointerRipple.amplitude = POINTER_AMPLITUDE
  }

  function onPointerLeave() {
    pointerInside = false
    pointerRipple.amplitude = 0
  }

  function onPointerDown(ev) {
    if (!interactionRoot || isUiTarget(ev.target)) return
    const { x, y } = clientToCanvas(ev.clientX, ev.clientY)
    clickRipple.center = { x, y }
    clickRipple.time = 0
    clickRipple.amplitude = 62
    clickBurstActive = true
  }

  if (interactionRoot) {
    interactionRoot.addEventListener('pointermove', onPointerMove)
    interactionRoot.addEventListener('pointerleave', onPointerLeave)
    interactionRoot.addEventListener('pointerdown', onPointerDown)
  }

  function tick() {
    displacementSprite.x += 1
    if (displacementSprite.x > app.screen.width) {
      displacementSprite.x = 0
    }
    createRaindrops(shockwaveFilter1, 0.7)
    createRaindrops(shockwaveFilter2, 0.5)
    createRaindrops(shockwaveFilter3, 1)

    if (pointerInside && pointerRipple.amplitude > 0) {
      smoothPx += (targetPx - smoothPx) * POINTER_LERP
      smoothPy += (targetPy - smoothPy) * POINTER_LERP
      pointerRipple.center = { x: smoothPx, y: smoothPy }
      pointerRipple.time += 0.014
      if (pointerRipple.time > 1.15) {
        pointerRipple.time = 0
      }
    }

    if (clickBurstActive) {
      clickRipple.time += 0.022
      if (clickRipple.time > 2.35) {
        clickBurstActive = false
        clickRipple.amplitude = 0
        clickRipple.center = { x: -9999, y: -9999 }
      }
    }
  }

  function createRaindrops(filter, resetTime) {
    filter.time += 0.01
    if (filter.time > resetTime) {
      filter.time = 0
      filter.center = {
        x: Math.random() * app.screen.width,
        y: Math.random() * app.screen.height,
      }
    }
  }

  app.ticker.add(tick)

  let destroyed = false
  return () => {
    if (destroyed) return
    destroyed = true
    if (interactionRoot) {
      interactionRoot.removeEventListener('pointermove', onPointerMove)
      interactionRoot.removeEventListener('pointerleave', onPointerLeave)
      interactionRoot.removeEventListener('pointerdown', onPointerDown)
    }
    ro.disconnect()
    app.ticker.remove(tick)
    app.destroy(true, { children: true, texture: true })
    canvas.remove()
  }
}
