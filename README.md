# Re:Space WEB

## Frontend

This project uses React + Vite for the UI.

Frontend env:
- Copy `.env.example` to `.env` and set:
  - `VITE_API_BASE_URL` to your backend URL
  - `VITE_SUPABASE_URL` to your Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` to your Supabase anon key
  - `VITE_SUPABASE_PRODUCT_BUCKET` to your storage bucket (default: `product-images`)

## Backend (Express)

The API server lives in `server/`.

Quick start:

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The server expects Supabase service role credentials in `.env` and exposes:

- `GET /api/health`
- `GET /api/products/active`
- `GET /api/products?category=...`
- `GET /api/products/:id`
- `POST /api/quotes`
- `POST /api/orders`
- `POST /api/orders/lookup`
- `POST /api/payments/portone/prepare`
- `POST /api/payments/portone/complete`
- `POST /api/webhooks/portone`

## Supabase setup

1) Create a Supabase project.
2) Run `supabase/schema.sql` in the SQL editor.
3) Seed one active product with `supabase/seed.sql`.
4) Apply migrations if you already created tables:
   - `supabase/migrations/20260129_add_product_category.sql`
   - `supabase/migrations/20260129_add_product_image_url.sql`
   - `supabase/migrations/20260129_add_order_is_cart.sql`
   - `supabase/migrations/20260129_add_order_items.sql`
   - `supabase/migrations/20260129_add_admin_policies.sql`
5) Copy the project URL and service role key into `server/.env`.
6) Add PortOne credentials to `server/.env`:
   - `PORTONE_API_SECRET`
   - `PORTONE_STORE_ID`
   - `PORTONE_CHANNEL_KEY`
   - `PORTONE_WEBHOOK_SECRET`

## Notes

- Database schema lives in `supabase/schema.sql`.
- For production, use a proper server host (Vercel/Render/Railway) instead of GitHub Pages.

## Admin login

- Admin UI: `/admin`
- Admin login UI: `/admin/login`
- Supabase Auth로 로그인합니다.
- 관리자 권한은 `admin_users` 테이블에 `user_id`를 등록해야 활성화됩니다.

예시 SQL (Supabase SQL editor):
```sql
insert into public.admin_users (user_id)
values ('<AUTH_USER_ID>');
```

## Product image uploads (Admin)

1) Supabase Storage에 `product-images` 버킷 생성 (Public 권장)
2) `SUPABASE_PRODUCT_BUCKET` (서버) 및 `VITE_SUPABASE_PRODUCT_BUCKET` (프론트) 값 확인
3) 어드민 업로드는 백엔드(`/api/admin/uploads`)가 처리합니다. 서비스 롤 키로 업로드하므로
   일반적으로 Storage RLS 정책이 필요하지 않습니다.

## Backend deploy (Render)

This repo includes `render.yaml` for a Node web service under `server/`. Render will use the build
and start commands declared there. See Render Blueprint spec for field details.

Manual setup (if you don't use the blueprint):
- Root directory: `server/`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
