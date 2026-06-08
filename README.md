✈️ SkyTracker — авиационный трекер и магазин билетов

Быстрый старт (5 минут)

1. Клонируй репозиторий
```bash
git clone https://github.com/dovlatyanc/sky-track.git
cd sky-track
2. Установи зависимости:
  bun install

3. Настрой переменные окружения
Создай backend/.env:

DATABASE_URL="postgresql://ИМЯ_ПОЛЬЗОВАТЕЛЯ:ПАРОЛЬ@ХОСТ:ПОРТ/ИМЯ_БАЗЫ"
JWT_SECRET="придумай-любой-секрет-тут"
VSEGPT_API_KEY=
AVIATIONSTACK_API_TOKEN =
PORT=5174
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=твой-логин@ethereal.email
SMTP_PASS=твой-пароль
TURNSTILE_SECRET_KEY=0x4AAAAAAA...
Создай frontend/.env:
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAA...
VITE_TINYMCE_API_KEY=твой-ключ-тут
📌 Где взять ключи?

VSEGPT_API
Зарегистрируйтесь на platform.openai.com

Пополните баланс (минимум $5)

Создайте API Key в разделе "API Keys"

AviationStack
Перейдите на aviationstack.com
Нажмите "Get Free API Key"
Зарегистрируйтесь (email + пароль)
Подтвердите email
Войдите в дашборд → "Your API Access Key"
Скопируйте ключ (выглядит так: a1b2c3d4e5f6g7h8i9j0)

TURNSTILE — зарегистрируйся на Cloudflare Turnstile, добавь виджет для localhost, получи Site Key и Secret Key

TINYMCE — зарегистрируйся на tiny.cloud, получи API ключ

SMTP — используй Ethereal для тестовой почты (бесплатно, письма в веб-интерфейсе)

4. Настрой базу данных

cd backend
npx prisma migrate dev --name init
npx prisma generate

bun dev(из корневой папки)
