package com.mycompany.erequest.web.rest;

import static com.mycompany.erequest.domain.TicketAttachmentAsserts.*;
import static com.mycompany.erequest.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.erequest.IntegrationTest;
import com.mycompany.erequest.domain.TicketAttachment;
import com.mycompany.erequest.repository.TicketAttachmentRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link TicketAttachmentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TicketAttachmentResourceIT {

    private static final String DEFAULT_FILE_ID = "AAAAAAAAAA";
    private static final String UPDATED_FILE_ID = "BBBBBBBBBB";

    private static final String DEFAULT_FILE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FILE_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ticket-attachments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TicketAttachmentRepository ticketAttachmentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTicketAttachmentMockMvc;

    private TicketAttachment ticketAttachment;

    private TicketAttachment insertedTicketAttachment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketAttachment createEntity() {
        return new TicketAttachment().fileId(DEFAULT_FILE_ID).fileName(DEFAULT_FILE_NAME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketAttachment createUpdatedEntity() {
        return new TicketAttachment().fileId(UPDATED_FILE_ID).fileName(UPDATED_FILE_NAME);
    }

    @BeforeEach
    public void initTest() {
        ticketAttachment = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTicketAttachment != null) {
            ticketAttachmentRepository.delete(insertedTicketAttachment);
            insertedTicketAttachment = null;
        }
    }

    @Test
    @Transactional
    void createTicketAttachment() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TicketAttachment
        var returnedTicketAttachment = om.readValue(
            restTicketAttachmentMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketAttachment)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TicketAttachment.class
        );

        // Validate the TicketAttachment in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTicketAttachmentUpdatableFieldsEquals(returnedTicketAttachment, getPersistedTicketAttachment(returnedTicketAttachment));

        insertedTicketAttachment = returnedTicketAttachment;
    }

    @Test
    @Transactional
    void createTicketAttachmentWithExistingId() throws Exception {
        // Create the TicketAttachment with an existing ID
        ticketAttachment.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTicketAttachmentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketAttachment)))
            .andExpect(status().isBadRequest());

        // Validate the TicketAttachment in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFileIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ticketAttachment.setFileId(null);

        // Create the TicketAttachment, which fails.

        restTicketAttachmentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketAttachment)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTicketAttachments() throws Exception {
        // Initialize the database
        insertedTicketAttachment = ticketAttachmentRepository.saveAndFlush(ticketAttachment);

        // Get all the ticketAttachmentList
        restTicketAttachmentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ticketAttachment.getId().intValue())))
            .andExpect(jsonPath("$.[*].fileId").value(hasItem(DEFAULT_FILE_ID)))
            .andExpect(jsonPath("$.[*].fileName").value(hasItem(DEFAULT_FILE_NAME)));
    }

    @Test
    @Transactional
    void getTicketAttachment() throws Exception {
        // Initialize the database
        insertedTicketAttachment = ticketAttachmentRepository.saveAndFlush(ticketAttachment);

        // Get the ticketAttachment
        restTicketAttachmentMockMvc
            .perform(get(ENTITY_API_URL_ID, ticketAttachment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ticketAttachment.getId().intValue()))
            .andExpect(jsonPath("$.fileId").value(DEFAULT_FILE_ID))
            .andExpect(jsonPath("$.fileName").value(DEFAULT_FILE_NAME));
    }

    @Test
    @Transactional
    void getNonExistingTicketAttachment() throws Exception {
        // Get the ticketAttachment
        restTicketAttachmentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTicketAttachment() throws Exception {
        // Initialize the database
        insertedTicketAttachment = ticketAttachmentRepository.saveAndFlush(ticketAttachment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketAttachment
        TicketAttachment updatedTicketAttachment = ticketAttachmentRepository.findById(ticketAttachment.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTicketAttachment are not directly saved in db
        em.detach(updatedTicketAttachment);
        updatedTicketAttachment.fileId(UPDATED_FILE_ID).fileName(UPDATED_FILE_NAME);

        restTicketAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTicketAttachment.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTicketAttachment))
            )
            .andExpect(status().isOk());

        // Validate the TicketAttachment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTicketAttachmentToMatchAllProperties(updatedTicketAttachment);
    }

    @Test
    @Transactional
    void putNonExistingTicketAttachment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketAttachment.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ticketAttachment.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ticketAttachment))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketAttachment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTicketAttachment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketAttachment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketAttachmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ticketAttachment))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketAttachment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTicketAttachment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketAttachment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketAttachmentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketAttachment)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketAttachment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTicketAttachmentWithPatch() throws Exception {
        // Initialize the database
        insertedTicketAttachment = ticketAttachmentRepository.saveAndFlush(ticketAttachment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketAttachment using partial update
        TicketAttachment partialUpdatedTicketAttachment = new TicketAttachment();
        partialUpdatedTicketAttachment.setId(ticketAttachment.getId());

        partialUpdatedTicketAttachment.fileId(UPDATED_FILE_ID);

        restTicketAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketAttachment.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketAttachment))
            )
            .andExpect(status().isOk());

        // Validate the TicketAttachment in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketAttachmentUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTicketAttachment, ticketAttachment),
            getPersistedTicketAttachment(ticketAttachment)
        );
    }

    @Test
    @Transactional
    void fullUpdateTicketAttachmentWithPatch() throws Exception {
        // Initialize the database
        insertedTicketAttachment = ticketAttachmentRepository.saveAndFlush(ticketAttachment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketAttachment using partial update
        TicketAttachment partialUpdatedTicketAttachment = new TicketAttachment();
        partialUpdatedTicketAttachment.setId(ticketAttachment.getId());

        partialUpdatedTicketAttachment.fileId(UPDATED_FILE_ID).fileName(UPDATED_FILE_NAME);

        restTicketAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketAttachment.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketAttachment))
            )
            .andExpect(status().isOk());

        // Validate the TicketAttachment in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketAttachmentUpdatableFieldsEquals(
            partialUpdatedTicketAttachment,
            getPersistedTicketAttachment(partialUpdatedTicketAttachment)
        );
    }

    @Test
    @Transactional
    void patchNonExistingTicketAttachment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketAttachment.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ticketAttachment.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketAttachment))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketAttachment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTicketAttachment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketAttachment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketAttachmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketAttachment))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketAttachment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTicketAttachment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketAttachment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketAttachmentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(ticketAttachment)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketAttachment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTicketAttachment() throws Exception {
        // Initialize the database
        insertedTicketAttachment = ticketAttachmentRepository.saveAndFlush(ticketAttachment);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the ticketAttachment
        restTicketAttachmentMockMvc
            .perform(delete(ENTITY_API_URL_ID, ticketAttachment.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return ticketAttachmentRepository.count();
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

    protected TicketAttachment getPersistedTicketAttachment(TicketAttachment ticketAttachment) {
        return ticketAttachmentRepository.findById(ticketAttachment.getId()).orElseThrow();
    }

    protected void assertPersistedTicketAttachmentToMatchAllProperties(TicketAttachment expectedTicketAttachment) {
        assertTicketAttachmentAllPropertiesEquals(expectedTicketAttachment, getPersistedTicketAttachment(expectedTicketAttachment));
    }

    protected void assertPersistedTicketAttachmentToMatchUpdatableProperties(TicketAttachment expectedTicketAttachment) {
        assertTicketAttachmentAllUpdatablePropertiesEquals(
            expectedTicketAttachment,
            getPersistedTicketAttachment(expectedTicketAttachment)
        );
    }
}
