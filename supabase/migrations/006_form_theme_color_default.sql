-- The original black default made the public collection form's submit
-- button look unstyled/broken before a user customizes it. Default new
-- forms to the brand orange and bring existing forms still on the old
-- default in line with it.
alter table public.forms alter column theme_color set default '#E8743B';

update public.forms set theme_color = '#E8743B' where theme_color = '#000000';
