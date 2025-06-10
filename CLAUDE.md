# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (build ignores lint errors)

## Architecture Overview

### Multi-Company Accounting Application
This is a Next.js 15 frontend for MinimalHishab, a multi-company accounting software. The backend runs on localhost:8080 and API calls are proxied through Next.js rewrites.

### Key Architectural Patterns

**Authentication & Company Context**
- Uses JWT tokens stored in localStorage
- Context-based auth state management via `AuthProvider`
- Multi-company support with company selection and role-based permissions
- Company roles: owner, admin, editor, viewer
- User roles: user, system_admin

**API Architecture**
- Centralized API client class in `lib/api.ts` with automatic JWT header injection
- All API calls go through localhost:8080 backend, proxied via Next.js rewrites
- Environment variable `NEXT_PUBLIC_API_URL` for API base URL (defaults to localhost:8080)

**UI Framework Stack**
- shadcn/ui components with Radix UI primitives
- Tailwind CSS with custom design system
- Theme provider for light/dark mode support
- Toast notifications via Sonner

**Route Structure**
- `/login` and `/register` - Authentication pages
- `/companies` - Company selection page
- `/companies/[companyId]/dashboard` - Main dashboard
- `/companies/[companyId]/income` - Income management
- Company layout with sidebar navigation

### Data Models
Core business entities defined in `types/index.ts`:
- User, Company, Employee, IncomeRecord, ExpenseRecord
- InventoryItem, Invoice, InvoiceItem, SalaryRecord

### Configuration Notes
- Build ignores TypeScript and ESLint errors (`ignoreBuildErrors: true`)
- Images are unoptimized for deployment flexibility
- Uses Inter font from Google Fonts

### API Alignment Notes
- Backend API documented in `api.http` with comprehensive test examples
- All endpoints are scoped to companies (e.g., `/api/companies/{id}/income`)
- Use `ApiClient` class in `lib/api.ts` for consistent API calls
- Registration includes optional `employee_details` object for immediate employee creation
- Amount fields should be parsed as `parseFloat()` before sending to API