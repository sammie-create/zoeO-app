-- ZoeO Allure — Migration 16: testimonial photo focal point
-- Adds a per-testimonial crop focal point (photo_pos_x/photo_pos_y, as a
-- percentage) so staff can set where each customer photo is centered when
-- it's cropped into the testimonial carousels. Defaults match the single
-- shared crop (50% 25%) every testimonial used before this field existed.

alter table testimonials add column if not exists photo_pos_x smallint not null default 50;
alter table testimonials add column if not exists photo_pos_y smallint not null default 25;
