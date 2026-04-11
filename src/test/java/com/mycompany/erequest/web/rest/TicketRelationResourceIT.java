package com.mycompany.erequest.web.rest;

import static com.mycompany.erequest.domain.TicketRelationAsserts.*;
import static com.mycompany.erequest.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.erequest.IntegrationTest;
import com.mycompany.erequest.domain.TicketRelation;
import com.mycompany.erequest.repository.TicketRelationRepository;
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
 * Integration tests for the {@link TicketRelationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TicketRelationResourceIT {

    private static final Long DEFAULT_RELATED_TICKET_ID = 1L;
    private static final Long UPDATED_RELATED_TICKET_ID = 2L;

    private static final String ENTITY_API_URL = "/api/ticket-relations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TicketRelationRepository ticketRelationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTicketRelationMockMvc;

    private TicketRelation ticketRelation;

    private TicketRelation insertedTicketRelation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketRelation createEntity() {
        return new TicketRelation().relatedTicketId(DEFAULT_RELATED_TICKET_ID);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketRelation createUpdatedEntity() {
        return new TicketRelation().relatedTicketId(UPDATED_RELATED_TICKET_ID);
    }

    @BeforeEach
    public void initTest() {
        ticketRelation = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTicketRelation != null) {
            ticketRelationRepository.delete(insertedTicketRelation);
            insertedTicketRelation = null;
        }
    }

    @Test
    @Transactional
    void createTicketRelation() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TicketRelation
        var returnedTicketRelation = om.readValue(
            restTicketRelationMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketRelation)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TicketRelation.class
        );

        // Validate the TicketRelation in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTicketRelationUpdatableFieldsEquals(returnedTicketRelation, getPersistedTicketRelation(returnedTicketRelation));

        insertedTicketRelation = returnedTicketRelation;
    }

    @Test
    @Transactional
    void createTicketRelationWithExistingId() throws Exception {
        // Create the TicketRelation with an existing ID
        ticketRelation.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTicketRelationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketRelation)))
            .andExpect(status().isBadRequest());

        // Validate the TicketRelation in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRelatedTicketIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ticketRelation.setRelatedTicketId(null);

        // Create the TicketRelation, which fails.

        restTicketRelationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketRelation)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTicketRelations() throws Exception {
        // Initialize the database
        insertedTicketRelation = ticketRelationRepository.saveAndFlush(ticketRelation);

        // Get all the ticketRelationList
        restTicketRelationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ticketRelation.getId().intValue())))
            .andExpect(jsonPath("$.[*].relatedTicketId").value(hasItem(DEFAULT_RELATED_TICKET_ID.intValue())));
    }

    @Test
    @Transactional
    void getTicketRelation() throws Exception {
        // Initialize the database
        insertedTicketRelation = ticketRelationRepository.saveAndFlush(ticketRelation);

        // Get the ticketRelation
        restTicketRelationMockMvc
            .perform(get(ENTITY_API_URL_ID, ticketRelation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ticketRelation.getId().intValue()))
            .andExpect(jsonPath("$.relatedTicketId").value(DEFAULT_RELATED_TICKET_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingTicketRelation() throws Exception {
        // Get the ticketRelation
        restTicketRelationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTicketRelation() throws Exception {
        // Initialize the database
        insertedTicketRelation = ticketRelationRepository.saveAndFlush(ticketRelation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketRelation
        TicketRelation updatedTicketRelation = ticketRelationRepository.findById(ticketRelation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTicketRelation are not directly saved in db
        em.detach(updatedTicketRelation);
        updatedTicketRelation.relatedTicketId(UPDATED_RELATED_TICKET_ID);

        restTicketRelationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTicketRelation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTicketRelation))
            )
            .andExpect(status().isOk());

        // Validate the TicketRelation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTicketRelationToMatchAllProperties(updatedTicketRelation);
    }

    @Test
    @Transactional
    void putNonExistingTicketRelation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketRelation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketRelationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ticketRelation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ticketRelation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketRelation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTicketRelation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketRelation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketRelationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ticketRelation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketRelation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTicketRelation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketRelation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketRelationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketRelation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketRelation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTicketRelationWithPatch() throws Exception {
        // Initialize the database
        insertedTicketRelation = ticketRelationRepository.saveAndFlush(ticketRelation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketRelation using partial update
        TicketRelation partialUpdatedTicketRelation = new TicketRelation();
        partialUpdatedTicketRelation.setId(ticketRelation.getId());

        partialUpdatedTicketRelation.relatedTicketId(UPDATED_RELATED_TICKET_ID);

        restTicketRelationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketRelation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketRelation))
            )
            .andExpect(status().isOk());

        // Validate the TicketRelation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketRelationUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTicketRelation, ticketRelation),
            getPersistedTicketRelation(ticketRelation)
        );
    }

    @Test
    @Transactional
    void fullUpdateTicketRelationWithPatch() throws Exception {
        // Initialize the database
        insertedTicketRelation = ticketRelationRepository.saveAndFlush(ticketRelation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketRelation using partial update
        TicketRelation partialUpdatedTicketRelation = new TicketRelation();
        partialUpdatedTicketRelation.setId(ticketRelation.getId());

        partialUpdatedTicketRelation.relatedTicketId(UPDATED_RELATED_TICKET_ID);

        restTicketRelationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketRelation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketRelation))
            )
            .andExpect(status().isOk());

        // Validate the TicketRelation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketRelationUpdatableFieldsEquals(partialUpdatedTicketRelation, getPersistedTicketRelation(partialUpdatedTicketRelation));
    }

    @Test
    @Transactional
    void patchNonExistingTicketRelation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketRelation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketRelationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ticketRelation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketRelation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketRelation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTicketRelation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketRelation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketRelationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketRelation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketRelation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTicketRelation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketRelation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketRelationMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(ticketRelation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketRelation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTicketRelation() throws Exception {
        // Initialize the database
        insertedTicketRelation = ticketRelationRepository.saveAndFlush(ticketRelation);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the ticketRelation
        restTicketRelationMockMvc
            .perform(delete(ENTITY_API_URL_ID, ticketRelation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return ticketRelationRepository.count();
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

    protected TicketRelation getPersistedTicketRelation(TicketRelation ticketRelation) {
        return ticketRelationRepository.findById(ticketRelation.getId()).orElseThrow();
    }

    protected void assertPersistedTicketRelationToMatchAllProperties(TicketRelation expectedTicketRelation) {
        assertTicketRelationAllPropertiesEquals(expectedTicketRelation, getPersistedTicketRelation(expectedTicketRelation));
    }

    protected void assertPersistedTicketRelationToMatchUpdatableProperties(TicketRelation expectedTicketRelation) {
        assertTicketRelationAllUpdatablePropertiesEquals(expectedTicketRelation, getPersistedTicketRelation(expectedTicketRelation));
    }
}
