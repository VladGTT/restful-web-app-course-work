-- Add up migration script here

-- DROP TABLE IF EXISTS `logs`;
CREATE TABLE IF NOT EXISTS `logs` (
  `id` int UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL,
  `description` text NOT NULL
);

-- DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `email` varchar(255) UNIQUE PRIMARY KEY NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int NOT NULL
);

-- DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `email` varchar(255) UNIQUE PRIMARY KEY NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `secondname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL
);

-- DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `email` varchar(255) UNIQUE PRIMARY KEY NOT NULL,
  `group` varchar(255) NOT NULL
);

-- DROP TABLE IF EXISTS `subjects_attendies`;
CREATE TABLE IF NOT EXISTS `subjects_attendies` (
  `student_id` varchar(255) NOT NULL,
  `subject_id` int NOT NULL,
  PRIMARY KEY (`student_id`, `subject_id`)
);

-- DROP TABLE IF EXISTS `assignments_marks`;
CREATE TABLE IF NOT EXISTS `assignments_marks` (
  `assignment_id` int NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `subject_id` int NOT NULL,
  `mark` float,
  PRIMARY KEY (`assignment_id`, `student_id`, `subject_id`)
);

-- DROP TABLE IF EXISTS `attended_meetings`;
CREATE TABLE IF NOT EXISTS `attended_meetings` (
  `meeting_id` int NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `subject_id` int NOT NULL,
  `percentage` float NOT NULL,
  PRIMARY KEY (`meeting_id`, `student_id`, `subject_id`)
);

-- DROP TABLE IF EXISTS `teachers`;
CREATE TABLE IF NOT EXISTS `teachers` (
  `email` varchar(255) UNIQUE PRIMARY KEY NOT NULL,
  `occupation` varchar(255) NOT NULL
);

-- DROP TABLE IF EXISTS `subjects`;
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `semestr` int,
  `teacher_id` varchar(255) NOT NULL
);

-- DROP TABLE IF EXISTS `assignments`;
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` int UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `subject_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `due_to` datetime NOT NULL,
  `max_point` float NOT NULL
);

-- DROP TABLE IF EXISTS `meetings`;
CREATE TABLE IF NOT EXISTS `meetings` (
  `id` int UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `subject_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `time` datetime NOT NULL
);

ALTER TABLE `meetings` ADD FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

ALTER TABLE `assignments` ADD FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

ALTER TABLE `attended_meetings` ADD FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`);

ALTER TABLE `assignments_marks` ADD FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`);

ALTER TABLE `subjects` ADD FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`email`);

ALTER TABLE `subjects_attendies` ADD FOREIGN KEY (`student_id`) REFERENCES `students` (`email`);

ALTER TABLE `subjects_attendies` ADD FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

ALTER TABLE `attended_meetings` ADD FOREIGN KEY (`student_id`, `subject_id`) REFERENCES `subjects_attendies` (`student_id`, `subject_id`);

ALTER TABLE `assignments_marks` ADD FOREIGN KEY (`student_id`, `subject_id`) REFERENCES `subjects_attendies` (`student_id`, `subject_id`);

ALTER TABLE `users` ADD FOREIGN KEY (`email`) REFERENCES `teachers` (`email`);

ALTER TABLE `users` ADD FOREIGN KEY (`email`) REFERENCES `students` (`email`);

ALTER TABLE `users` ADD FOREIGN KEY (`email`) REFERENCES `accounts` (`email`);
