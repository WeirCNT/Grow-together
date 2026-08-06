ALTER TABLE supports
DROP CONSTRAINT supports_goal_id_from_user_key;

ALTER TABLE supports
ADD COLUMN support_date DATE NOT NULL DEFAULT CURRENT_DATE;

ALTER TABLE supports
ADD CONSTRAINT supports_goal_user_day_unique
UNIQUE(goal_id, from_user, support_date);