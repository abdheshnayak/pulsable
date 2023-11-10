import './css/index.scss';
import { iPlaceholder } from './image-placeholder';

interface bgColors {
  medium: string;
  light: string;
}

type pulseAnimation = 'none' | 'pulse' | 'wave' | 'wave-reverse';

export interface Props {
  animation?: pulseAnimation;
  bgColors?: bgColors;
  noRounded?: boolean;
  noPadding?: boolean;
  [key: string]: any;
}

export interface ISetPulsing {
  rootElement: HTMLElement;
  config?: Props;
  loading?: boolean;
}

const pulseClassNames: {
  [key: string]: string;
} = {
  pulse: 'pl-animate',
  wave: 'pl-animate-wave',
  'wave-reverse': 'pl-animate-wave-r',
  none: 'pl-animate-none',
};

function countLines(target: Element) {
  var style = window.getComputedStyle(target, null);
  var height = parseInt(style.getPropertyValue('height'), 10);
  var font_size = parseInt(style.getPropertyValue('font-size'), 10);
  var line_height = parseInt(style.getPropertyValue('line-height'), 10);
  var box_sizing = style.getPropertyValue('box-sizing');

  if (Number.isNaN(line_height)) line_height = font_size * 1.2;

  if (box_sizing === 'border-box') {
    var padding_top = parseInt(style.getPropertyValue('padding-top'), 10);
    var padding_bottom = parseInt(style.getPropertyValue('padding-bottom'), 10);
    var border_top = parseInt(style.getPropertyValue('border-top-width'), 10);
    var border_bottom = parseInt(
      style.getPropertyValue('border-bottom-width'),
      10
    );
    height = height - padding_top - padding_bottom - border_top - border_bottom;
  }

  var lines = Math.ceil(height / line_height);
  return { lines, font_size, height };
}

const setPulsing = ({ rootElement, config, loading = true }: ISetPulsing) => {
  const {
    animation = 'wave',
    bgColors,
    noRounded = false,
    noPadding = false,
  } = config || {};
  const setCalculating = (calculating: boolean) => {
    if (calculating) {
      rootElement.classList.add('pl-calc');
    } else {
      rootElement.classList.remove('pl-calc');
    }
  };

  const setLoading = (_loading: boolean) => {
    if (_loading) {
      rootElement.classList.add('pl-css');
    } else {
      rootElement.classList.remove('pl-css');
    }
  };

  const getComps = () => {
    if (typeof window === 'undefined') {
      return null;
    }
    const el = document.createElement('div');

    const pulseParaCont = el.cloneNode(true) as HTMLDivElement;
    pulseParaCont.classList.add(
      'pl-child-para-cont',
      'pl-no-rounded',
      'pl-child'
    );

    el.style.setProperty(
      '--color-transparent-medium',
      bgColors?.medium || 'rgba(130, 130, 130, 0.3)'
    );

    el.style.setProperty(
      '--color-transparent-light',
      bgColors?.light || 'rgba(130, 130, 130, 0.2)'
    );
    el.classList.add(pulseClassNames[animation]);

    const pPara = el.cloneNode(true) as HTMLDivElement;
    pPara.classList.add('pl-child-para');

    el.classList.add('pl-child');
    const pCircle = el.cloneNode(true) as HTMLDivElement;
    pCircle.classList.add('pl-child-circle');

    if (noRounded) {
      el.classList.add('pl-no-rounded');
      pPara.classList.add('pl-no-rounded');
    }

    const pHidden = el.cloneNode(true) as HTMLDivElement;
    pHidden.classList.add('pl-child-hidden');

    const pRect = el.cloneNode(true) as HTMLDivElement;
    pRect.classList.add('pl-child-rect');

    const pRectFull = el.cloneNode(true) as HTMLDivElement;
    pRectFull.classList.add('pl-child-rect-full');

    return {
      pCircle: () => pCircle.cloneNode(true) as HTMLDivElement,
      pPara: () => pPara.cloneNode(true) as HTMLDivElement,
      pHidden: () => pHidden.cloneNode(true) as HTMLDivElement,
      pRect: () => pRect.cloneNode(true) as HTMLDivElement,
      pRectFull: () => pRectFull.cloneNode(true) as HTMLDivElement,
      pParaCont: () => pulseParaCont.cloneNode(true) as HTMLDivElement,
    };
  };

  var components: {
    pCircle: () => HTMLDivElement;
    pPara: () => HTMLDivElement;
    pHidden: () => HTMLDivElement;
    pRect: () => HTMLDivElement;
    pRectFull: () => HTMLDivElement;
    pParaCont: () => HTMLDivElement;
  } | null = null;

  const manp = () => {
    if (!rootElement) {
      setCalculating(false);
      return;
    }

    if (!rootElement.classList.contains('pl-cont')) {
      rootElement.classList.add('pl-cont');
    }

    if (loading) {
      setCalculating(true);
      setLoading(true);

      if (!components) {
        components = getComps();
      }

      if (!components) {
        setCalculating(false);
        setLoading(false);
        return;
      }

      const iSvg = document.createElement('div');
      iSvg.classList.add('pl-svg-cont');
      iSvg.innerHTML = iPlaceholder;

      rootElement.querySelectorAll('.pulsable').forEach((element) => {
        element.classList.add('pl-element');

        if (!element.hasAttribute('disabled')) {
          element.classList.add('pl-has-disabled-attr');
          element.setAttribute('disabled', 'true');
        }

        element.childNodes.forEach((ch: any) => {
          if (ch.classList && !ch.classList.contains('pl-child')) {
            ch.classList.add('pl-child-element');

            if (!ch?.hasAttribute('disabled')) {
              ch.classList.add('pl-has-disabled-attr');
              ch.setAttribute('disabled', 'true');
            }
          }
        });

        const pc = element.querySelector('.pl-child');
        if (!pc) {
          var pulseEl;
          const cList = element.classList;

          if (!components) {
            return;
          }

          if (cList.contains('pulsable-circle')) {
            pulseEl = components.pCircle();
          } else if (cList.contains('pulsable-hidden')) {
            pulseEl = components.pHidden();
          } else if (cList.contains('pulsable-para')) {
            pulseEl = components.pParaCont();

            const res = countLines(element);

            const gap =
              (res.height - res.font_size * res.lines) / (res.lines + 2);

            const gapString = `${Math.max(gap, 8)}px`;

            pulseEl.style.setProperty('padding-top', gapString);
            pulseEl.style.setProperty('padding-bottom', gapString);

            const pulsePara = components.pPara();

            if (noRounded && cList.contains('pulsable-rounded')) {
              pulsePara.classList.remove('pl-no-rounded');
            } else if (!noRounded && cList.contains('pulsable-no-rounded')) {
              pulsePara.classList.add('pl-no-rounded');
            }

            pulsePara.style.setProperty(
              'height',
              `${(res.font_size * 80) / 100}px`
            );

            for (let i = 0; i < res.lines; i++) {
              pulseEl.appendChild(pulsePara.cloneNode(true));
            }
          } else if (noPadding) {
            if (cList.contains('pulsable-padding')) {
              pulseEl = components.pRect();
            } else {
              pulseEl = components.pRectFull();
            }
          } else if (cList.contains('pulsable-no-padding')) {
            pulseEl = components.pRectFull();
          } else {
            pulseEl = components.pRect();
          }

          if (cList.contains('pulsable-img')) {
            pulseEl.appendChild(iSvg);
          }

          if (noRounded && cList.contains('pulsable-rounded')) {
            pulseEl.classList.remove('pl-no-rounded');
          } else if (!noRounded && cList.contains('pulsable-no-rounded')) {
            pulseEl.classList.add('pl-no-rounded');
          }

          element.parentNode?.appendChild(pulseEl);
          element.appendChild(pulseEl);
        }
      });

      setCalculating(false);
    } else {
      rootElement.querySelectorAll('.pl-child').forEach((v) => {
        v.parentNode?.removeChild(v);
      });

      rootElement.querySelectorAll('.pl-element').forEach((v) => {
        if (v.classList) {
          v.classList.remove('pl-element');
        }
      });

      rootElement
        .querySelectorAll('.pl-has-disabled-attr')
        .forEach((element) => {
          element.removeAttribute('disabled');
          element.classList.remove('pl-has-disabled-attr');
        });

      rootElement.querySelectorAll('.pl-child-element').forEach((element) => {
        element.classList.remove('pl-child-element');
      });

      setLoading(false);
    }
  };

  requestAnimationFrame(manp);
};

// @ts-ignore
if (typeof global !== 'undefined' || typeof globalThis !== 'undefined') {
  // @ts-ignore
  if (typeof global !== 'undefined') {
    // @ts-ignore
    global.setPulsing = setPulsing;
  }
  if (typeof globalThis !== 'undefined') {
    // @ts-ignore
    globalThis.setPulsing = setPulsing;
  }
}

export default setPulsing;
