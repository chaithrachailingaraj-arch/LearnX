from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base

# 1. Teachers
class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=True)
    school_name = Column(String(150), nullable=False)
    subject_specialization = Column(String(100), nullable=False)
    teacher_id_code = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student_assignments = relationship("TeacherStudentAssignment", back_populates="teacher", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="teacher", cascade="all, delete-orphan")
    study_materials = relationship("StudyMaterial", back_populates="teacher", cascade="all, delete-orphan")
    announcements = relationship("Announcement", back_populates="teacher", cascade="all, delete-orphan")


# 2. Students
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    student_id_code = Column(String(50), unique=True, index=True, nullable=False)
    class_semester = Column(String(50), nullable=False, default="Grade 7 - Sem 1")
    course_dept = Column(String(100), nullable=False, default="Science & Mathematics")
    password_hash = Column(String(255), nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)

    # Relationships
    teacher_assignments = relationship("TeacherStudentAssignment", back_populates="student", cascade="all, delete-orphan")
    quiz_assignments = relationship("QuizAssignment", back_populates="student", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="student", cascade="all, delete-orphan")
    material_assignments = relationship("MaterialAssignment", back_populates="student", cascade="all, delete-orphan")
    material_activities = relationship("MaterialActivity", back_populates="student", cascade="all, delete-orphan")


# 3. TeacherStudentAssignments
class TeacherStudentAssignment(Base):
    __tablename__ = "teacher_student_assignments"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("Teacher", back_populates="student_assignments")
    student = relationship("Student", back_populates="teacher_assignments")


# 4. Quizzes
class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    subject = Column(String(100), nullable=False)
    topic = Column(String(100), nullable=False)
    class_semester = Column(String(50), nullable=False)
    difficulty = Column(String(30), nullable=False, default="Medium")  # Easy, Medium, Hard
    description = Column(Text, nullable=True)
    time_limit = Column(Integer, nullable=False, default=20)  # in minutes
    total_marks = Column(Float, nullable=False, default=100.0)
    passing_percentage = Column(Float, nullable=False, default=60.0)
    status = Column(String(20), nullable=False, default="draft")  # draft, published, closed
    deadline = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("Teacher", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    assignments = relationship("QuizAssignment", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


# 5. Questions
class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_type = Column(String(30), nullable=False)  # mcq, true_false, fill_blank, short_answer
    prompt = Column(Text, nullable=False)
    options_json = Column(Text, nullable=True)  # JSON array of 4 choices for MCQs
    correct_answer = Column(Text, nullable=False)
    marks = Column(Float, nullable=False, default=10.0)
    explanation = Column(Text, nullable=True)

    quiz = relationship("Quiz", back_populates="questions")
    answers = relationship("QuizAnswer", back_populates="question", cascade="all, delete-orphan")


# 6. QuizAssignments
class QuizAssignment(Base):
    __tablename__ = "quiz_assignments"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    due_date = Column(String(50), nullable=True)

    quiz = relationship("Quiz", back_populates="assignments")
    student = relationship("Student", back_populates="quiz_assignments")


# 7. QuizAttempts
class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, nullable=False)
    total_marks = Column(Float, nullable=False)
    percentage = Column(Float, nullable=False)
    passed = Column(Boolean, nullable=False, default=False)
    time_spent_seconds = Column(Integer, nullable=False, default=0)
    attempted_at = Column(DateTime, default=datetime.utcnow)

    quiz = relationship("Quiz", back_populates="attempts")
    student = relationship("Student", back_populates="quiz_attempts")
    answers = relationship("QuizAnswer", back_populates="attempt", cascade="all, delete-orphan")


# 8. QuizAnswers
class QuizAnswer(Base):
    __tablename__ = "quiz_answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    student_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False, default=False)
    marks_awarded = Column(Float, nullable=False, default=0.0)

    attempt = relationship("QuizAttempt", back_populates="answers")
    question = relationship("Question", back_populates="answers")


# 9. StudyMaterials
class StudyMaterial(Base):
    __tablename__ = "study_materials"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    subject = Column(String(100), nullable=False)
    topic = Column(String(100), nullable=False)
    class_semester = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    file_name = Column(String(150), nullable=False)
    file_type = Column(String(20), nullable=False)  # pdf, docx, pptx, image, txt
    file_size_kb = Column(Float, nullable=False, default=120.0)
    file_data_url = Column(Text, nullable=True)
    downloads_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("Teacher", back_populates="study_materials")
    assignments = relationship("MaterialAssignment", back_populates="material", cascade="all, delete-orphan")
    activities = relationship("MaterialActivity", back_populates="material", cascade="all, delete-orphan")


# 10. MaterialAssignments
class MaterialAssignment(Base):
    __tablename__ = "material_assignments"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("study_materials.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)

    material = relationship("StudyMaterial", back_populates="assignments")
    student = relationship("Student", back_populates="material_assignments")


# 11. MaterialActivity
class MaterialActivity(Base):
    __tablename__ = "material_activities"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("study_materials.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    activity_type = Column(String(30), nullable=False)  # view, download
    timestamp = Column(DateTime, default=datetime.utcnow)

    material = relationship("StudyMaterial", back_populates="activities")
    student = relationship("Student", back_populates="material_activities")


# 12. Announcements
class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    content = Column(Text, nullable=False)
    target_class = Column(String(50), nullable=False, default="All Classes")
    priority = Column(String(20), nullable=False, default="normal")  # normal, important, urgent
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("Teacher", back_populates="announcements")
