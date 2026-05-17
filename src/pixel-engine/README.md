# Pixel Reveal Engine

Движок для WebGL-пикселизации. Три способа использования.

## Установка

Скопируй папку `pixel-engine/src/` в свой проект.
Зависимостей нет — только React.

---

## 1. PixelImage — замена для `<img>`

```jsx
import { PixelImage } from "./pixel-engine"

// Базовое использование — вставляй вместо <img>
<PixelImage src="/photo.jpg" alt="моё фото" />

// С пресетом и настройками
<PixelImage
  src="/photo.jpg"
  preset="mosaic"        // "default" | "mosaic" | "rgb_split" | "blur"
  fromPixels={64}        // начальный размер пикселя (чем больше — тем пикселизованней)
  speed={80}             // скорость анимации px/сек
  threshold={0.2}        // сколько элемента должно быть в viewport перед запуском
  replay={false}         // повторять анимацию при каждом появлении
  hoverPause={false}     // при hover — сразу чёткое изображение
  width={400}
  height={300}
  style={{ borderRadius: 12 }}
/>
```

Анимация запускается автоматически когда картинка появляется в viewport
(через IntersectionObserver). Ничего дополнительно делать не нужно.

---

## 2. PixelBackground — фон секции или окна

```jsx
import { PixelBackground } from "./pixel-engine"

// Дети рендерятся поверх шейдерного фона
<PixelBackground
  src="/wallpaper.jpg"
  preset="default"
  fromPixels={32}
  speed={60}
  style={{ borderRadius: 12, padding: 24 }}
>
  <h2>Заголовок поверх фона</h2>
  <p>Контент</p>
</PixelBackground>
```

---

## 3. usePixelReveal — хук для своих элементов

Если нужен полный контроль — используй хук напрямую.

```jsx
import { usePixelReveal } from "./pixel-engine"

function MyComponent() {
  const { canvasRef, trigger } = usePixelReveal("/photo.jpg", {
    preset: "rgb_split",
    fromPixels: 48,
    speed: 100,
  })

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        style={{ width: "100%", borderRadius: 8 }}
      />
      {/* Ручной триггер — например по клику */}
      <button onClick={trigger}>повторить</button>
    </div>
  )
}
```

---

## Пресеты

| Пресет      | Описание                                      |
|-------------|-----------------------------------------------|
| `default`   | Обычная пикселизация                          |
| `mosaic`    | Пикселизация + случайный тинт ячеек + бордер  |
| `rgb_split` | Хроматическая аберрация по ячейкам            |
| `blur`      | Блур из усреднения 3×3 соседних ячеек         |

---

## Структура файлов

```
pixel-engine/
└── src/
    ├── index.js                    ← публичное API (импортируй отсюда)
    ├── hooks/
    │   ├── glEngine.js             ← GLSL шейдеры + WebGL утилиты
    │   └── usePixelReveal.js       ← основной хук
    └── components/
        ├── PixelImage.jsx          ← компонент-замена для <img>
        └── PixelBackground.jsx     ← компонент для фонов
```

---

## Пример интеграции в YegOS

```jsx
// В окне About Me — фото с эффектом
import { PixelImage } from "../pixel-engine"

<PixelImage
  src="/me.jpg"
  preset="default"
  fromPixels={48}
  speed={70}
  style={{ borderRadius: 12, width: "100%" }}
/>

// Фон рабочего стола
import { PixelBackground } from "../pixel-engine"

<PixelBackground src={wallpaperUrl} preset="default" fromPixels={24} speed={50}>
  {/* иконки рабочего стола */}
</PixelBackground>
```
