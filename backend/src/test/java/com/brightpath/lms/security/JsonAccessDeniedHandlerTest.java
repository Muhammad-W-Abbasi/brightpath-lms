package com.brightpath.lms.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;

import static org.junit.jupiter.api.Assertions.assertEquals;

class JsonAccessDeniedHandlerTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final JsonAccessDeniedHandler handler = new JsonAccessDeniedHandler(objectMapper);

    @Test
    void returnsForbiddenAccessDeniedResponse() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-Request-Id", "req-forbidden");
        MockHttpServletResponse response = new MockHttpServletResponse();

        handler.handle(request, response, new AccessDeniedException("forbidden"));

        assertEquals(403, response.getStatus());
        assertEquals("application/json", response.getContentType());
        JsonNode body = objectMapper.readTree(response.getContentAsString());
        assertEquals("access_denied", body.get("error").asText());
        assertEquals("Access denied.", body.get("message").asText());
        assertEquals("req-forbidden", body.get("requestId").asText());
    }
}
