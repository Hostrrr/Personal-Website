export const translations = {
  ru: {
    windows: {
      about: 'Обо мне',
      projects: 'Проекты',
      skills: 'Навыки',
      contact: 'Контакты',
      yegos: 'YegOS',
      settings: 'Настройки',
      game: 'Игры',
      terminal: 'Терминал',
    },
    taskbar: {
      aboutYegos: 'Об YegOS',
      settings: 'Настройки',
      terminal: 'Терминал',
      shutdown: 'Выключить',
      shutdownAlert: 'Выключение YegOS...',
    },
    windowContent: {
      notFound: 'Контент не найден',
    },
    about: {
      clickPhoto: 'Нажми на фото',
      name: 'Георгий Назаренко',
      nameFirst: 'Георгий',
      nameLast: 'Назаренко',
      desc1: 'IT специалист с фокусом на веб-разработку и сетевые технологии.',
      desc2: 'Работаю с <b>Ruby</b>, <b>JavaScript</b>, <b>React</b> и базами данных.',
    },
    contact: {
      linkLabel: 'Ссылка',
      copyTitle: 'Скопировать',
      openTitle: 'Открыть',
      contacts: [
        {
          description: 'Лучший способ для деловых предложений и долгосрочного сотрудничества.',
          details: [
            { label: 'Время ответа', value: 'до 24 часов' },
            { label: 'Предпочтительно', value: 'Официальные предложения' },
          ],
          hint: 'Напишите тему письма — это поможет ответить быстрее.',
        },
        {
          description: 'Здесь хранятся мои проекты — от учебных работ до реальных приложений.',
          details: [
            { label: 'Основной стек', value: 'React, JavaScript' },
            { label: 'Активность', value: 'Регулярные коммиты' },
          ],
          hint: 'Смотри закреплённые репозитории — там самое интересное.',
        },
        {
          description: 'Удобен для быстрой связи, обсуждения идей и неформальных вопросов.',
          details: [
            { label: 'Время ответа', value: 'обычно в тот же день' },
            { label: 'Предпочтительно', value: 'Быстрые вопросы' },
          ],
          hint: 'Можно написать в любое время — я не против.',
        },
        {
          description: 'Профессиональный профиль с опытом работы, навыками и рекомендациями.',
          details: [
            { label: 'Позиция', value: 'Frontend Developer' },
            { label: 'Статус', value: 'Открыт к предложениям' },
          ],
          hint: 'Отправь запрос в друзья — отвечаю всем.',
        },
      ],
    },
    projects: {
      searchPlaceholder: 'Поиск...',
      notFound: 'Проекты не найдены 😕',
      projects: [
        {
          desc:
            'Интерактивное портфолио-разработчика в виде настоящей ОС: перетаскиваемые окна, док, мобильный режим, тёмная/светлая тема и RU/EN.',
        },
        {
          desc:
            'Трекер цикла в терминале на Textual. Без облака и сторонних сервисов — только ваши данные локально.',
        },
        {
          desc:
            'Кроссплатформенный органайзер для студентов: расписание, календарь и база знаний с локальным хранением в SQLite.',
        },
        {
          desc:
            'Минималистичный дашборд продуктивности: фокус дня, привычки и Pomodoro. Собран на Rails 8 + Hotwire.',
        },
        {
          desc:
            'SPA для просмотра фильмов на React + TypeScript с API PoiskKino: бесконечный скролл, фильтры по жанрам и рейтингу, избранное в localStorage.',
        },
        {
          desc:
            'Пасьянс «Косынка» в терминале на Python и curses. Без зависимостей — только стандартная библиотека.',
        },
      ],
    },
    game: {
      snakeName: 'Змейка',
      score: 'Счёт',
      best: 'Рекорд',
      pressArrowDesktop: 'Нажми стрелку или WASD',
      pressArrowMobile: 'Нажми стрелку для старта',
      pause: 'Пауза',
      gameOver: 'Игра окончена!',
      resume: 'Продолжить',
      start: 'Старт',
      restart: 'Ещё раз',
      up: 'Вверх',
      down: 'Вниз',
      left: 'Влево',
      right: 'Вправо',
    },
    settings: {
      themeSection: '🎨 Тема оформления',
      themeDark: 'Тёмная',
      themeLight: 'Светлая',
      langSection: '🌐 Язык интерфейса',
      wallpaperSection: '🖼 Цвет обоев',
      infoSection: 'ℹ️ Информация',
      version: 'Версия',
      language: 'Язык',
      author: 'Автор',
      currentLang: 'Русский',
      themeAriaLabel: 'Переключить тему',
      wallpapers: ['Жёлтый', 'Голубой', 'Красный', 'Зелёный', 'Фиолет.', 'Синий', 'Серый', 'Тёмный'],
    },
    yegos: {
      version: 'Версия',
      builtWith: 'Сделано на',
      author: 'Автор',
      status: 'Статус',
      statusValue: 'Экспериментальная ОС 😎',
    },
    terminal: {
      prompt: 'yegos@portfolio ~ %',
      welcomeDesktop: "Введите 'help' для списка команд. · ⌘K — палитра команд",
      welcomeMobile: "Введите 'help' для списка команд.",
      inputAria: 'Ввод в терминале',
      notFound: 'command not found: {cmd}',
      opened: 'Открыто: {app}',
      themeUsage: 'Использование: theme light | dark | toggle',
      themeSet: 'Тема: {theme}',
      langUsage: 'Использование: lang ru | en',
      langSet: 'Язык: {lang}',
      wallpaperUsage: 'Использование: wallpaper <1-8>',
      wallpaperSet: 'Обои: {name}',
      paletteTitle: 'Палитра команд',
      palettePlaceholder: 'Поиск команд…',
      paletteEmpty: 'Ничего не найдено',
      paletteTheme: 'Переключить тему',
      paletteLangRu: 'Язык: Русский',
      paletteLangEn: 'Язык: English',
      helpLines: [
        'Доступные команды:',
        '  help              — это сообщение',
        '  open <app>        — открыть приложение (open 02, open projects)',
        '  about projects …  — шорткаты для открытия',
        '  theme light|dark|toggle',
        '  lang ru|en        — сменить язык',
        '  wallpaper <1-8>  — цвет обоев',
        '  version           — версия YegOS',
        '  whoami            — кто я',
        '  clear             — очистить экран',
      ],
    },
    mobile: {
      appTitles: {
        about: 'Обо мне',
        projects: 'Проекты',
        skills: 'Навыки',
        contact: 'Контакты',
        settings: 'Настройки',
        game: 'Игры',
        terminal: 'Терминал',
      },
      greeting: 'Добро пожаловать 👋',
      swipeHint: 'Свайп вверх для разблокировки',
      dateLocale: 'ru-RU',
      backAriaLabel: 'Назад',
      homeAriaLabel: 'На главный экран',
    },
  },

  en: {
    windows: {
      about: 'About Me',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contacts',
      yegos: 'YegOS',
      settings: 'Settings',
      game: 'Games',
      terminal: 'Terminal',
    },
    taskbar: {
      aboutYegos: 'About YegOS',
      settings: 'Settings',
      terminal: 'Terminal',
      shutdown: 'Shutdown',
      shutdownAlert: 'Shutting down YegOS...',
    },
    windowContent: {
      notFound: 'Content not found',
    },
    about: {
      clickPhoto: 'Click on photo',
      name: 'Georgiy Nazarenko',
      nameFirst: 'Georgiy',
      nameLast: 'Nazarenko',
      desc1: 'IT specialist focused on web development and networking.',
      desc2: 'Working with <b>Ruby</b>, <b>JavaScript</b>, <b>React</b> and databases.',
    },
    contact: {
      linkLabel: 'Link',
      copyTitle: 'Copy',
      openTitle: 'Open',
      contacts: [
        {
          description: 'Best way for business proposals and long-term collaboration.',
          details: [
            { label: 'Response time', value: 'within 24 hours' },
            { label: 'Preferred for', value: 'Official proposals' },
          ],
          hint: 'Include a subject line — it helps me reply faster.',
        },
        {
          description: 'My projects live here — from study works to real applications.',
          details: [
            { label: 'Main stack', value: 'React, JavaScript' },
            { label: 'Activity', value: 'Regular commits' },
          ],
          hint: "Check pinned repositories — that's the best stuff.",
        },
        {
          description: 'Great for quick communication, ideas and informal questions.',
          details: [
            { label: 'Response time', value: 'usually same day' },
            { label: 'Preferred for', value: 'Quick questions' },
          ],
          hint: "Feel free to message anytime — I don't mind.",
        },
        {
          description: 'Professional profile with work experience, skills and recommendations.',
          details: [
            { label: 'Position', value: 'Frontend Developer' },
            { label: 'Status', value: 'Open to offers' },
          ],
          hint: 'Send a connection request — I accept everyone.',
        },
      ],
    },
    projects: {
      searchPlaceholder: 'Search...',
      notFound: 'No projects found 😕',
      projects: [
        {
          desc:
            'Interactive developer portfolio that looks and feels like a real desktop OS — draggable windows, dock, mobile mode, themes, RU/EN.',
        },
        {
          desc:
            'Terminal UI period tracker built with Textual. No apps, no cloud — just you and your data.',
        },
        {
          desc:
            'Cross-platform student organizer — schedule, calendar, and knowledge base with local SQLite storage.',
        },
        {
          desc:
            "Minimal productivity dashboard. Today's focus, habits, and Pomodoro. Built with Rails 8 + Hotwire.",
        },
        {
          desc:
            'React + TypeScript SPA for browsing movies via PoiskKino API — infinite scroll, genre/rating filters, favorites in localStorage.',
        },
        {
          desc:
            'Klondike Solitaire in your terminal with Python and curses. No dependencies — standard library only.',
        },
      ],
    },
    game: {
      snakeName: 'Snake',
      score: 'Score',
      best: 'Best',
      pressArrowDesktop: 'Press arrow or WASD',
      pressArrowMobile: 'Press arrow to start',
      pause: 'Pause',
      gameOver: 'Game Over!',
      resume: 'Resume',
      start: 'Start',
      restart: 'Play Again',
      up: 'Up',
      down: 'Down',
      left: 'Left',
      right: 'Right',
    },
    settings: {
      themeSection: '🎨 Appearance',
      themeDark: 'Dark',
      themeLight: 'Light',
      langSection: '🌐 Interface Language',
      wallpaperSection: '🖼 Wallpaper Color',
      infoSection: 'ℹ️ Info',
      version: 'Version',
      language: 'Language',
      author: 'Author',
      currentLang: 'English',
      themeAriaLabel: 'Toggle theme',
      wallpapers: ['Yellow', 'Cyan', 'Red', 'Green', 'Purple', 'Blue', 'Gray', 'Dark'],
    },
    yegos: {
      version: 'Version',
      builtWith: 'Built with',
      author: 'Author',
      status: 'Status',
      statusValue: 'Experimental OS 😎',
    },
    terminal: {
      prompt: 'yegos@portfolio ~ %',
      welcomeDesktop: "Type 'help' for available commands. · ⌘K — command palette",
      welcomeMobile: "Type 'help' for available commands.",
      inputAria: 'Terminal input',
      notFound: 'command not found: {cmd}',
      opened: 'Opened {app}',
      themeUsage: 'Usage: theme light | dark | toggle',
      themeSet: 'Theme: {theme}',
      langUsage: 'Usage: lang ru | en',
      langSet: 'Language: {lang}',
      wallpaperUsage: 'Usage: wallpaper <1-8>',
      wallpaperSet: 'Wallpaper: {name}',
      paletteTitle: 'Command palette',
      palettePlaceholder: 'Search commands…',
      paletteEmpty: 'No results',
      paletteTheme: 'Toggle theme',
      paletteLangRu: 'Language: Russian',
      paletteLangEn: 'Language: English',
      helpLines: [
        'Available commands:',
        '  help              — this message',
        '  open <app>        — open app (e.g. open 02, open projects)',
        '  about projects …  — shortcuts to open apps',
        '  theme light|dark|toggle',
        '  lang ru|en        — switch language',
        '  wallpaper <1-8>  — change wallpaper color',
        '  version           — YegOS version',
        '  whoami            — your identity',
        '  clear             — clear screen',
      ],
    },
    mobile: {
      appTitles: {
        about: 'About Me',
        projects: 'Projects',
        skills: 'Skills',
        contact: 'Contacts',
        settings: 'Settings',
        game: 'Games',
        terminal: 'Terminal',
      },
      greeting: 'Welcome 👋',
      swipeHint: 'Swipe up to unlock',
      dateLocale: 'en-US',
      backAriaLabel: 'Back',
      homeAriaLabel: 'Go to home screen',
    },
  },
}
