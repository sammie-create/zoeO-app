-- ZoeO Allure — Migration 13: FAQ page targeting
-- Adds an optional page column so FAQs can be scoped to a specific page
-- (services booking questions vs. contact/general questions) instead of
-- every page sharing one flat list. NULL means "show on every page".

alter table faqs add column if not exists page text
  check (page is null or page in ('services', 'contact'));
