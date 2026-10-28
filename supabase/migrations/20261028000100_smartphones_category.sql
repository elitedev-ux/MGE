alter table public.products drop constraint products_category_check;
alter table public.products add constraint products_category_check
check (category in ('Smartphones','Laptops','Audio','Charging','Wearables','Gaming','Lighting','Office','Accessories'));
