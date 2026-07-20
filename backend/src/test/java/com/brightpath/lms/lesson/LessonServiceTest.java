package com.brightpath.lms.lesson;

import com.brightpath.lms.common.error.ApiException;
import com.brightpath.lms.lesson.dto.LessonCompletionRequest;
import com.brightpath.lms.lesson.dto.LessonRequest;
import com.brightpath.lms.lesson.dto.ModuleRequest;
import com.brightpath.lms.lesson.dto.ReorderRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class LessonServiceTest {

    private static final UUID WEB_COURSE_ID = UUID.fromString("1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7");
    private static final UUID CS_COURSE_ID = UUID.fromString("e09089bf-441f-432b-99c5-0d787fd0fb22");
    private static final UUID DRAFT_LESSON_ID = UUID.fromString("09c60d06-d432-4288-a0df-70a47ebd218d");
    private static final UUID INCOMPLETE_LESSON_ID = UUID.fromString("b6046b70-bd37-4a41-9c98-c59821e24fa1");
    private static final UUID FIRST_MODULE_ID = UUID.fromString("a36f9d5a-7612-4a2e-9a13-787b55fba7a0");
    private static final UUID SECOND_MODULE_ID = UUID.fromString("69f7a143-0108-44c8-876f-17aca09091ef");

    @Autowired
    private LessonService lessonService;

    @Test
    void studentOutlineHidesDraftContentAndCalculatesProgress() {
        var outline = lessonService.getCourseOutline(WEB_COURSE_ID, "student1@brightpath.com");

        assertEquals(5, outline.modules().size());
        assertEquals(10, outline.progress().totalLessons());
        assertEquals(5, outline.progress().completedLessons());
        assertEquals(50, outline.progress().percentComplete());
        assertFalse(outline.modules().stream()
            .flatMap(module -> module.lessons().stream())
            .anyMatch(lesson -> lesson.id().equals(DRAFT_LESSON_ID)));
    }

    @Test
    void instructorOutlineIncludesDraftContent() {
        var outline = lessonService.getCourseOutline(WEB_COURSE_ID, "instructor@brightpath.com");

        assertEquals(6, outline.modules().size());
        assertTrue(outline.modules().stream()
            .flatMap(module -> module.lessons().stream())
            .anyMatch(lesson -> lesson.id().equals(DRAFT_LESSON_ID) && lesson.status() == ContentStatus.DRAFT));
    }

    @Test
    void studentCannotViewDraftLesson() {
        ApiException exception = assertThrows(
            ApiException.class,
            () -> lessonService.getLesson(WEB_COURSE_ID, DRAFT_LESSON_ID, "student1@brightpath.com")
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
    }

    @Test
    void studentCanCompletePublishedLessonAndProgressUpdates() {
        LessonCompletionRequest request = new LessonCompletionRequest();
        request.setCompleted(true);

        var detail = lessonService.updateCompletion(WEB_COURSE_ID, INCOMPLETE_LESSON_ID, request, "student1@brightpath.com");
        assertTrue(detail.completed());

        var outline = lessonService.getCourseOutline(WEB_COURSE_ID, "student1@brightpath.com");
        assertEquals(6, outline.progress().completedLessons());
        assertEquals(60, outline.progress().percentComplete());
    }

    @Test
    void instructorCanCreateUpdateReorderAndDeleteModulesAndLessons() {
        ModuleRequest moduleRequest = new ModuleRequest();
        moduleRequest.setTitle("Testing Real Course Content");
        moduleRequest.setDescription("Practice publishing and ordering lesson material.");
        moduleRequest.setStatus(ContentStatus.DRAFT);

        var module = lessonService.createModule(WEB_COURSE_ID, moduleRequest, "instructor@brightpath.com");
        assertNotNull(module.id());
        assertEquals(ContentStatus.DRAFT, module.status());

        moduleRequest.setTitle("Testing Real Course Content Updated");
        moduleRequest.setStatus(ContentStatus.PUBLISHED);
        var updatedModule = lessonService.updateModule(WEB_COURSE_ID, module.id(), moduleRequest, "instructor@brightpath.com");
        assertEquals("Testing Real Course Content Updated", updatedModule.title());
        assertEquals(ContentStatus.PUBLISHED, updatedModule.status());

        LessonRequest lessonRequest = new LessonRequest();
        lessonRequest.setTitle("Write a Content Smoke Test");
        lessonRequest.setDescription("Confirm title, body, and status are returned correctly.");
        lessonRequest.setContent("Create a short lesson and verify it appears in the instructor outline.");
        lessonRequest.setEstimatedMinutes(12);
        lessonRequest.setStatus(ContentStatus.PUBLISHED);

        var lesson = lessonService.createLesson(WEB_COURSE_ID, module.id(), lessonRequest, "instructor@brightpath.com");
        assertEquals(ContentStatus.PUBLISHED, lesson.status());

        lessonRequest.setTitle("Write a Content Smoke Test Updated");
        var updatedLesson = lessonService.updateLesson(WEB_COURSE_ID, module.id(), lesson.id(), lessonRequest, "instructor@brightpath.com");
        assertEquals("Write a Content Smoke Test Updated", updatedLesson.title());

        lessonService.deleteLesson(WEB_COURSE_ID, module.id(), lesson.id(), "instructor@brightpath.com");
        lessonService.deleteModule(WEB_COURSE_ID, module.id(), "instructor@brightpath.com");
    }

    @Test
    void instructorCanReorderExistingModules() {
        ReorderRequest request = new ReorderRequest();
        request.setOrderedIds(List.of(SECOND_MODULE_ID, FIRST_MODULE_ID));

        var outline = lessonService.reorderModules(WEB_COURSE_ID, request, "instructor@brightpath.com");

        assertEquals(SECOND_MODULE_ID, outline.modules().get(0).id());
        assertEquals(FIRST_MODULE_ID, outline.modules().get(1).id());
    }

    @Test
    void studentCannotMutateModules() {
        ModuleRequest request = new ModuleRequest();
        request.setTitle("Unauthorized Module");
        request.setStatus(ContentStatus.PUBLISHED);

        ApiException exception = assertThrows(
            ApiException.class,
            () -> lessonService.createModule(WEB_COURSE_ID, request, "student1@brightpath.com")
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());
    }

    @Test
    void studentCannotViewUnenrolledCourseOutline() {
        ApiException exception = assertThrows(
            ApiException.class,
            () -> lessonService.getCourseOutline(CS_COURSE_ID, "student1@brightpath.com")
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());
    }
}
