INSERT INTO course_modules (id, course_id, title, description, sort_order, status, created_at, updated_at)
SELECT 'a36f9d5a-7612-4a2e-9a13-787b55fba7a0',
       '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
       'HTML and Semantic Structure',
       'Build pages that communicate structure clearly to browsers, assistive technology, and future maintainers.',
       0,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM course_modules WHERE id = 'a36f9d5a-7612-4a2e-9a13-787b55fba7a0');

INSERT INTO course_modules (id, course_id, title, description, sort_order, status, created_at, updated_at)
SELECT '69f7a143-0108-44c8-876f-17aca09091ef',
       '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
       'CSS Layouts and Responsive Design',
       'Use modern CSS layout tools to create interfaces that hold together across screen sizes.',
       1,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM course_modules WHERE id = '69f7a143-0108-44c8-876f-17aca09091ef');

INSERT INTO course_modules (id, course_id, title, description, sort_order, status, created_at, updated_at)
SELECT '5d7def7c-704a-40e6-b0e8-6f33c743ab8b',
       '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
       'JavaScript Fundamentals',
       'Learn the language features behind interactivity, state, and browser behavior.',
       2,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM course_modules WHERE id = '5d7def7c-704a-40e6-b0e8-6f33c743ab8b');

INSERT INTO course_modules (id, course_id, title, description, sort_order, status, created_at, updated_at)
SELECT 'd4c39587-c6d2-4ba9-b67e-7e21fa03e87d',
       '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
       'Components and Application Architecture',
       'Separate UI, state, and data concerns so applications stay understandable as they grow.',
       3,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM course_modules WHERE id = 'd4c39587-c6d2-4ba9-b67e-7e21fa03e87d');

INSERT INTO course_modules (id, course_id, title, description, sort_order, status, created_at, updated_at)
SELECT '23900a98-8d51-4464-a7a4-d164ca1bf19a',
       '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
       'APIs and Asynchronous Programming',
       'Connect interfaces to real backend data with resilient loading, empty, and error states.',
       4,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM course_modules WHERE id = '23900a98-8d51-4464-a7a4-d164ca1bf19a');

INSERT INTO course_modules (id, course_id, title, description, sort_order, status, created_at, updated_at)
SELECT '52f0e0ed-9c82-418a-b418-af2f03635884',
       '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
       'Final Project',
       'Plan, build, and present a small API-backed web application.',
       5,
       'DRAFT',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM course_modules WHERE id = '52f0e0ed-9c82-418a-b418-af2f03635884');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT 'ca3a3f56-ff37-42de-a423-42733b2c1e92',
       'a36f9d5a-7612-4a2e-9a13-787b55fba7a0',
       'Landmarks, Headings, and Reading Order',
       'Create the document outline that gives every user a reliable map.',
       'Semantic HTML starts with choosing elements for meaning, not appearance. Use one clear h1, ordered heading levels, and landmarks such as header, nav, main, section, and footer. Before styling a page, scan it as a document outline: a learner should be able to predict where navigation, primary content, and supporting information live.',
       18,
       'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure',
       0,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = 'ca3a3f56-ff37-42de-a423-42733b2c1e92');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT '4f587066-3449-4728-adf7-0518d963b494',
       'a36f9d5a-7612-4a2e-9a13-787b55fba7a0',
       'Forms That Explain Themselves',
       'Label controls and validation states so forms are usable without guesswork.',
       'Every input needs a name that remains available when the field contains text. Pair visible labels with helpful constraints, keep error messages close to the field, and use button text that describes the action. Good form markup improves accessibility, validation, analytics, and future automation.',
       16,
       NULL,
       1,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = '4f587066-3449-4728-adf7-0518d963b494');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT '9ac4a1da-1450-451f-829b-3a45cfe01ab6',
       '69f7a143-0108-44c8-876f-17aca09091ef',
       'Flexbox for One-Dimensional Layout',
       'Use flexbox for alignment, distribution, wrapping, and toolbars.',
       'Flexbox is best when a layout flows in one direction at a time. It shines for nav bars, action rows, media objects, and small groups of controls. The key is deciding which element owns the available space and which elements keep stable dimensions.',
       20,
       NULL,
       0,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = '9ac4a1da-1450-451f-829b-3a45cfe01ab6');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT '844c98c9-a208-4851-91fe-5fc6eab44a9d',
       '69f7a143-0108-44c8-876f-17aca09091ef',
       'Grid for Page and Dashboard Layout',
       'Use grid when rows and columns need to cooperate.',
       'CSS Grid gives you a vocabulary for two-dimensional layout. Define tracks, gaps, and placement rules before tuning visual details. For dashboards, prefer predictable grids with stable card sizes over layouts that shift as content loads.',
       24,
       'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout',
       1,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = '844c98c9-a208-4851-91fe-5fc6eab44a9d');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT '0f4a8cfd-fcc7-42ad-a514-d607d09a28a2',
       '69f7a143-0108-44c8-876f-17aca09091ef',
       'Responsive Breakpoints Without Surprises',
       'Choose breakpoints from content pressure, not device folklore.',
       'Responsive design is a negotiation between content, container width, and interaction. Start narrow, let content determine when the layout needs more room, and avoid controls that disappear without an accessible replacement. Test real text lengths before declaring a layout done.',
       21,
       NULL,
       2,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = '0f4a8cfd-fcc7-42ad-a514-d607d09a28a2');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT '2606ab6f-aa86-44f6-a27a-d272262f76ff',
       '5d7def7c-704a-40e6-b0e8-6f33c743ab8b',
       'Values, Functions, and Scope',
       'Understand the small pieces that make browser code predictable.',
       'JavaScript programs are easier to reason about when values have clear ownership and functions have clear responsibilities. Prefer small functions with explicit inputs. Avoid hiding important state in broad scopes unless it truly belongs to the whole module.',
       22,
       NULL,
       0,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = '2606ab6f-aa86-44f6-a27a-d272262f76ff');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT 'b6046b70-bd37-4a41-9c98-c59821e24fa1',
       '5d7def7c-704a-40e6-b0e8-6f33c743ab8b',
       'DOM Events and UI State',
       'Respond to user intent without losing track of application state.',
       'Events are notifications, not architecture by themselves. Name handlers around user intent, update state in one obvious place, and keep rendering logic separate from mutation logic. This makes buttons, forms, and keyboard interactions easier to test.',
       19,
       NULL,
       1,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = 'b6046b70-bd37-4a41-9c98-c59821e24fa1');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT 'c7a2f89c-10e3-4063-929a-27d46d879af8',
       'd4c39587-c6d2-4ba9-b67e-7e21fa03e87d',
       'Component Boundaries',
       'Split an interface by responsibility instead of by visual coincidence.',
       'A useful component has a reason to exist. It may own one workflow, one repeated display pattern, or one integration boundary. When a component fetches data, transforms it, manages forms, and paints every detail, changes become harder than they need to be.',
       23,
       NULL,
       0,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = 'c7a2f89c-10e3-4063-929a-27d46d879af8');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT '32fa3acf-a327-46ba-9971-ee1684507924',
       'd4c39587-c6d2-4ba9-b67e-7e21fa03e87d',
       'Loading, Empty, and Error States',
       'Design the states around data, not only the perfect path.',
       'Production interfaces spend real time waiting, failing, retrying, and showing nothing yet. Treat loading, empty, and error states as part of the feature. They should preserve layout, explain what happened, and offer the next useful action.',
       17,
       NULL,
       1,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = '32fa3acf-a327-46ba-9971-ee1684507924');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT '6aa50171-dd60-44d5-92ca-2f3e54f4f992',
       '23900a98-8d51-4464-a7a4-d164ca1bf19a',
       'Fetching Data with Clear Lifecycles',
       'Represent request lifecycles explicitly so UI behavior stays legible.',
       'A fetch is a state machine: idle, loading, success, empty, and error. Model those states directly instead of guessing from null checks. Good data fetching code makes retries, disabled actions, and progress feedback easier to implement.',
       26,
       NULL,
       0,
       'PUBLISHED',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = '6aa50171-dd60-44d5-92ca-2f3e54f4f992');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT '09c60d06-d432-4288-a0df-70a47ebd218d',
       '23900a98-8d51-4464-a7a4-d164ca1bf19a',
       'API Error Handling for Humans',
       'Turn backend failures into useful recovery paths.',
       'An API error should not strand the learner. Preserve their context, show a concise message, and offer a next step when possible. On the backend, return status codes that match the failure; on the frontend, avoid swallowing the reason users need to act on.',
       18,
       NULL,
       1,
       'DRAFT',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = '09c60d06-d432-4288-a0df-70a47ebd218d');

INSERT INTO lessons (id, module_id, title, description, content, estimated_minutes, resource_url, sort_order, status, created_at, updated_at)
SELECT '3385852b-ad96-4035-b9e5-96ec1e4515f5',
       '52f0e0ed-9c82-418a-b418-af2f03635884',
       'Project Proposal and Scope',
       'Define a small application that can be completed and demonstrated well.',
       'A strong final project starts with a narrow promise. Identify one user, one core workflow, the data needed to support it, and the states that prove the application is resilient. Keep the first version boring enough to finish and polished enough to present.',
       30,
       NULL,
       0,
       'DRAFT',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE id = '3385852b-ad96-4035-b9e5-96ec1e4515f5');

INSERT INTO lesson_completions (id, lesson_id, user_id, completed_at)
SELECT '846110e9-d089-45aa-89b8-fd6b5c185c07', 'ca3a3f56-ff37-42de-a423-42733b2c1e92', '48e83c59-eaf9-4895-b737-638960b08daf', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lesson_completions WHERE lesson_id = 'ca3a3f56-ff37-42de-a423-42733b2c1e92' AND user_id = '48e83c59-eaf9-4895-b737-638960b08daf');

INSERT INTO lesson_completions (id, lesson_id, user_id, completed_at)
SELECT '246d3935-6253-496e-b2fe-e7470970bb40', '4f587066-3449-4728-adf7-0518d963b494', '48e83c59-eaf9-4895-b737-638960b08daf', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lesson_completions WHERE lesson_id = '4f587066-3449-4728-adf7-0518d963b494' AND user_id = '48e83c59-eaf9-4895-b737-638960b08daf');

INSERT INTO lesson_completions (id, lesson_id, user_id, completed_at)
SELECT '2706dad7-126e-4c67-af66-7b5c1bd28288', '9ac4a1da-1450-451f-829b-3a45cfe01ab6', '48e83c59-eaf9-4895-b737-638960b08daf', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lesson_completions WHERE lesson_id = '9ac4a1da-1450-451f-829b-3a45cfe01ab6' AND user_id = '48e83c59-eaf9-4895-b737-638960b08daf');

INSERT INTO lesson_completions (id, lesson_id, user_id, completed_at)
SELECT 'e3602d0b-1e03-45c1-9382-aa4237135432', '844c98c9-a208-4851-91fe-5fc6eab44a9d', '48e83c59-eaf9-4895-b737-638960b08daf', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lesson_completions WHERE lesson_id = '844c98c9-a208-4851-91fe-5fc6eab44a9d' AND user_id = '48e83c59-eaf9-4895-b737-638960b08daf');

INSERT INTO lesson_completions (id, lesson_id, user_id, completed_at)
SELECT '04223d84-30af-4929-b75e-de191c1afed3', '2606ab6f-aa86-44f6-a27a-d272262f76ff', '48e83c59-eaf9-4895-b737-638960b08daf', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lesson_completions WHERE lesson_id = '2606ab6f-aa86-44f6-a27a-d272262f76ff' AND user_id = '48e83c59-eaf9-4895-b737-638960b08daf');

INSERT INTO lesson_completions (id, lesson_id, user_id, completed_at)
SELECT 'c57208ea-cdd9-49de-9702-d51bdf37862e', 'ca3a3f56-ff37-42de-a423-42733b2c1e92', 'e1a40df9-0138-496f-ad13-19f322854e5e', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lesson_completions WHERE lesson_id = 'ca3a3f56-ff37-42de-a423-42733b2c1e92' AND user_id = 'e1a40df9-0138-496f-ad13-19f322854e5e');

INSERT INTO lesson_completions (id, lesson_id, user_id, completed_at)
SELECT '28f597fb-b6e2-47e1-90ed-068125c9a9e4', '4f587066-3449-4728-adf7-0518d963b494', 'e1a40df9-0138-496f-ad13-19f322854e5e', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM lesson_completions WHERE lesson_id = '4f587066-3449-4728-adf7-0518d963b494' AND user_id = 'e1a40df9-0138-496f-ad13-19f322854e5e');
