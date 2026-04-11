package com.mycompany.erequest.web.rest;

import static com.mycompany.erequest.domain.TicketCommentAsserts.*;
import static com.mycompany.erequest.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.erequest.IntegrationTest;
import com.mycompany.erequest.domain.TicketComment;
import com.mycompany.erequest.repository.TicketCommentRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TicketCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TicketCommentResourceIT {

    private static final String DEFAULT_AUTHOR_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/ticket-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TicketCommentRepository ticketCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTicketCommentMockMvc;

    private TicketComment ticketComment;

    private TicketComment insertedTicketComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketComment createEntity() {
        return new TicketComment().authorEmail(DEFAULT_AUTHOR_EMAIL).content(DEFAULT_CONTENT).createdAt(DEFAULT_CREATED_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketComment createUpdatedEntity() {
        return new TicketComment().authorEmail(UPDATED_AUTHOR_EMAIL).content(UPDATED_CONTENT).createdAt(UPDATED_CREATED_AT);
    }

    @BeforeEach
    public void initTest() {
        ticketComment = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTicketComment != null) {
            ticketCommentRepository.delete(insertedTicketComment);
            insertedTicketComment = null;
        }
    }

    @Test
    @Transactional
    void createTicketComment() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TicketComment
        var returnedTicketComment = om.readValue(
            restTicketCommentMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketComment)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TicketComment.class
        );

        // Validate the TicketComment in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTicketCommentUpdatableFieldsEquals(returnedTicketComment, getPersistedTicketComment(returnedTicketComment));

        insertedTicketComment = returnedTicketComment;
    }

    @Test
    @Transactional
    void createTicketCommentWithExistingId() throws Exception {
        // Create the TicketComment with an existing ID
        ticketComment.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTicketCommentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketComment)))
            .andExpect(status().isBadRequest());

        // Validate the TicketComment in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAuthorEmailIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ticketComment.setAuthorEmail(null);

        // Create the TicketComment, which fails.

        restTicketCommentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketComment)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTicketComments() throws Exception {
        // Initialize the database
        insertedTicketComment = ticketCommentRepository.saveAndFlush(ticketComment);

        // Get all the ticketCommentList
        restTicketCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ticketComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].authorEmail").value(hasItem(DEFAULT_AUTHOR_EMAIL)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));
    }

    @Test
    @Transactional
    void getTicketComment() throws Exception {
        // Initialize the database
        insertedTicketComment = ticketCommentRepository.saveAndFlush(ticketComment);

        // Get the ticketComment
        restTicketCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, ticketComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ticketComment.getId().intValue()))
            .andExpect(jsonPath("$.authorEmail").value(DEFAULT_AUTHOR_EMAIL))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTicketComment() throws Exception {
        // Get the ticketComment
        restTicketCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTicketComment() throws Exception {
        // Initialize the database
        insertedTicketComment = ticketCommentRepository.saveAndFlush(ticketComment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketComment
        TicketComment updatedTicketComment = ticketCommentRepository.findById(ticketComment.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTicketComment are not directly saved in db
        em.detach(updatedTicketComment);
        updatedTicketComment.authorEmail(UPDATED_AUTHOR_EMAIL).content(UPDATED_CONTENT).createdAt(UPDATED_CREATED_AT);

        restTicketCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTicketComment.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTicketComment))
            )
            .andExpect(status().isOk());

        // Validate the TicketComment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTicketCommentToMatchAllProperties(updatedTicketComment);
    }

    @Test
    @Transactional
    void putNonExistingTicketComment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketComment.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ticketComment.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ticketComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketComment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTicketComment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketComment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ticketComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketComment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTicketComment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketComment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketCommentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketComment)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketComment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTicketCommentWithPatch() throws Exception {
        // Initialize the database
        insertedTicketComment = ticketCommentRepository.saveAndFlush(ticketComment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketComment using partial update
        TicketComment partialUpdatedTicketComment = new TicketComment();
        partialUpdatedTicketComment.setId(ticketComment.getId());

        restTicketCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketComment.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketComment))
            )
            .andExpect(status().isOk());

        // Validate the TicketComment in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketCommentUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTicketComment, ticketComment),
            getPersistedTicketComment(ticketComment)
        );
    }

    @Test
    @Transactional
    void fullUpdateTicketCommentWithPatch() throws Exception {
        // Initialize the database
        insertedTicketComment = ticketCommentRepository.saveAndFlush(ticketComment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketComment using partial update
        TicketComment partialUpdatedTicketComment = new TicketComment();
        partialUpdatedTicketComment.setId(ticketComment.getId());

        partialUpdatedTicketComment.authorEmail(UPDATED_AUTHOR_EMAIL).content(UPDATED_CONTENT).createdAt(UPDATED_CREATED_AT);

        restTicketCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketComment.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketComment))
            )
            .andExpect(status().isOk());

        // Validate the TicketComment in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketCommentUpdatableFieldsEquals(partialUpdatedTicketComment, getPersistedTicketComment(partialUpdatedTicketComment));
    }

    @Test
    @Transactional
    void patchNonExistingTicketComment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketComment.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ticketComment.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketComment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTicketComment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketComment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketComment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTicketComment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketComment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketCommentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(ticketComment)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketComment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTicketComment() throws Exception {
        // Initialize the database
        insertedTicketComment = ticketCommentRepository.saveAndFlush(ticketComment);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the ticketComment
        restTicketCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, ticketComment.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return ticketCommentRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected TicketComment getPersistedTicketComment(TicketComment ticketComment) {
        return ticketCommentRepository.findById(ticketComment.getId()).orElseThrow();
    }

    protected void assertPersistedTicketCommentToMatchAllProperties(TicketComment expectedTicketComment) {
        assertTicketCommentAllPropertiesEquals(expectedTicketComment, getPersistedTicketComment(expectedTicketComment));
    }

    protected void assertPersistedTicketCommentToMatchUpdatableProperties(TicketComment expectedTicketComment) {
        assertTicketCommentAllUpdatablePropertiesEquals(expectedTicketComment, getPersistedTicketComment(expectedTicketComment));
    }
}
