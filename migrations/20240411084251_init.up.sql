-- Add up migration script here

-- DROP TABLE IF EXISTS `logs`;
CREATE TABLE IF NOT EXISTS `logs` (
  `id` int UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
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
  `teacher_id` varchar(255)
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

ALTER TABLE `meetings` ADD FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `assignments` ADD FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `attended_meetings` ADD FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `assignments_marks` ADD FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `subjects` ADD FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`email`) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE `subjects_attendies` ADD FOREIGN KEY (`student_id`) REFERENCES `students` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `subjects_attendies` ADD FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `attended_meetings` ADD FOREIGN KEY (`student_id`, `subject_id`) REFERENCES `subjects_attendies` (`student_id`, `subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `assignments_marks` ADD FOREIGN KEY (`student_id`, `subject_id`) REFERENCES `subjects_attendies` (`student_id`, `subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `users` ADD FOREIGN KEY (`email`) REFERENCES `accounts` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `teachers` ADD FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `students` ADD FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;



-- ----------------------------------- POPULATE DB WITH DATA ----------------------------- --

-- Populate `accounts` table
INSERT INTO `accounts` (`email`, `password`, `role`) VALUES
('teacher1@example.com', 'password1', 1),
('teacher2@example.com', 'password2', 1),
('student1@example.com', 'password3', 2),
('student2@example.com', 'password4', 2);


-- Populate `users` table
INSERT INTO `users` (`email`, `firstname`, `secondname`, `lastname`) VALUES
('teacher1@example.com', 'John', 'Doe', 'Smith'),
('teacher2@example.com', 'Alice', 'Johnson', 'Brown'),
('student1@example.com', 'Emma', 'Davis', 'Wilson'),
('student2@example.com', 'Michael', 'Miller', 'Taylor');

-- Populate `teachers` table
INSERT INTO `teachers` (`email`, `occupation`) VALUES
('teacher1@example.com', 'Mathematics Professor'),
('teacher2@example.com', 'Physics Instructor');

-- Populate `students` table
INSERT INTO `students` (`email`, `group`) VALUES
('student1@example.com', 'Group A'),
('student2@example.com', 'Group B');

-- Populate `subjects` table
INSERT INTO `subjects` (`name`, `description`, `semestr`, `teacher_id`) VALUES
('Mathematics', 'Introductory Mathematics Course', 1, 'teacher1@example.com'),
('Physics', 'Basic Principles of Physics', 1, 'teacher2@example.com');

-- Populate `assignments` table
INSERT INTO `assignments` (`subject_id`, `name`, `description`, `due_to`, `max_point`) VALUES
(1, 'Algebra Assignment', 'Solve algebraic equations', '2024-05-01 00:00:00', 100),
(2, 'Newton Laws Assignment', 'Solve problems based on Newton Laws', '2024-05-05 00:00:00', 100);

-- Populate `meetings` table
INSERT INTO `meetings` (`subject_id`, `name`, `time`) VALUES
(1, 'Mathematics Lecture', '2024-04-25 09:00:00'),
(2, 'Physics Lab Session', '2024-04-27 14:00:00');

-- Populate `subjects_attendies` table
INSERT INTO `subjects_attendies` (`student_id`, `subject_id`) VALUES
('student1@example.com', 1),
('student2@example.com', 2);

-- Populate `attended_meetings` table
INSERT INTO `attended_meetings` (`meeting_id`, `student_id`, `subject_id`, `percentage`) VALUES
(1, 'student1@example.com', 1, 90),
(2, 'student2@example.com', 2, 85);

-- Populate `assignments_marks` table
INSERT INTO `assignments_marks` (`assignment_id`, `student_id`, `subject_id`, `mark`) VALUES
(1, 'student1@example.com', 1, 95),
(2, 'student2@example.com', 2, 88);

