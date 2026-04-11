package com.mycompany.erequest.web.rest;

import static com.mycompany.erequest.domain.TicketSLAAsserts.*;
import static com.mycompany.erequest.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.erequest.IntegrationTest;
import com.mycompany.erequest.domain.TicketSLA;
import com.mycompany.erequest.repository.TicketSLARepository;
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
 * Integration tests for the {@link TicketSLAResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TicketSLAResourceIT {

    private static final Instant DEFAULT_DEADLINE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DEADLINE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_REMIND_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_REMIND_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/ticket-slas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TicketSLARepository ticketSLARepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTicketSLAMockMvc;

    private TicketSLA ticketSLA;

    private TicketSLA insertedTicketSLA;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketSLA createEntity() {
        return new TicketSLA().deadline(DEFAULT_DEADLINE).remindAt(DEFAULT_REMIND_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketSLA createUpdatedEntity() {
        return new TicketSLA().deadline(UPDATED_DEADLINE).remindAt(UPDATED_REMIND_AT);
    }

    @BeforeEach
    public void initTest() {
        ticketSLA = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTicketSLA != null) {
            ticketSLARepository.delete(insertedTicketSLA);
            insertedTicketSLA = null;
        }
    }

    @Test
    @Transactional
    void createTicketSLA() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TicketSLA
        var returnedTicketSLA = om.readValue(
            restTicketSLAMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketSLA)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TicketSLA.class
        );

        // Validate the TicketSLA in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTicketSLAUpdatableFieldsEquals(returnedTicketSLA, getPersistedTicketSLA(returnedTicketSLA));

        insertedTicketSLA = returnedTicketSLA;
    }

    @Test
    @Transactional
    void createTicketSLAWithExistingId() throws Exception {
        // Create the TicketSLA with an existing ID
        ticketSLA.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTicketSLAMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketSLA)))
            .andExpect(status().isBadRequest());

        // Validate the TicketSLA in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDeadlineIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ticketSLA.setDeadline(null);

        // Create the TicketSLA, which fails.

        restTicketSLAMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketSLA)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTicketSLAS() throws Exception {
        // Initialize the database
        insertedTicketSLA = ticketSLARepository.saveAndFlush(ticketSLA);

        // Get all the ticketSLAList
        restTicketSLAMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ticketSLA.getId().intValue())))
            .andExpect(jsonPath("$.[*].deadline").value(hasItem(DEFAULT_DEADLINE.toString())))
            .andExpect(jsonPath("$.[*].remindAt").value(hasItem(DEFAULT_REMIND_AT.toString())));
    }

    @Test
    @Transactional
    void getTicketSLA() throws Exception {
        // Initialize the database
        insertedTicketSLA = ticketSLARepository.saveAndFlush(ticketSLA);

        // Get the ticketSLA
        restTicketSLAMockMvc
            .perform(get(ENTITY_API_URL_ID, ticketSLA.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ticketSLA.getId().intValue()))
            .andExpect(jsonPath("$.deadline").value(DEFAULT_DEADLINE.toString()))
            .andExpect(jsonPath("$.remindAt").value(DEFAULT_REMIND_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTicketSLA() throws Exception {
        // Get the ticketSLA
        restTicketSLAMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTicketSLA() throws Exception {
        // Initialize the database
        insertedTicketSLA = ticketSLARepository.saveAndFlush(ticketSLA);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketSLA
        TicketSLA updatedTicketSLA = ticketSLARepository.findById(ticketSLA.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTicketSLA are not directly saved in db
        em.detach(updatedTicketSLA);
        updatedTicketSLA.deadline(UPDATED_DEADLINE).remindAt(UPDATED_REMIND_AT);

        restTicketSLAMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTicketSLA.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTicketSLA))
            )
            .andExpect(status().isOk());

        // Validate the TicketSLA in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTicketSLAToMatchAllProperties(updatedTicketSLA);
    }

    @Test
    @Transactional
    void putNonExistingTicketSLA() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketSLA.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketSLAMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ticketSLA.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketSLA))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketSLA in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTicketSLA() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketSLA.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketSLAMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ticketSLA))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketSLA in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTicketSLA() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketSLA.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketSLAMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketSLA)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketSLA in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTicketSLAWithPatch() throws Exception {
        // Initialize the database
        insertedTicketSLA = ticketSLARepository.saveAndFlush(ticketSLA);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketSLA using partial update
        TicketSLA partialUpdatedTicketSLA = new TicketSLA();
        partialUpdatedTicketSLA.setId(ticketSLA.getId());

        partialUpdatedTicketSLA.deadline(UPDATED_DEADLINE);

        restTicketSLAMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketSLA.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketSLA))
            )
            .andExpect(status().isOk());

        // Validate the TicketSLA in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketSLAUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTicketSLA, ticketSLA),
            getPersistedTicketSLA(ticketSLA)
        );
    }

    @Test
    @Transactional
    void fullUpdateTicketSLAWithPatch() throws Exception {
        // Initialize the database
        insertedTicketSLA = ticketSLARepository.saveAndFlush(ticketSLA);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketSLA using partial update
        TicketSLA partialUpdatedTicketSLA = new TicketSLA();
        partialUpdatedTicketSLA.setId(ticketSLA.getId());

        partialUpdatedTicketSLA.deadline(UPDATED_DEADLINE).remindAt(UPDATED_REMIND_AT);

        restTicketSLAMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketSLA.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketSLA))
            )
            .andExpect(status().isOk());

        // Validate the TicketSLA in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketSLAUpdatableFieldsEquals(partialUpdatedTicketSLA, getPersistedTicketSLA(partialUpdatedTicketSLA));
    }

    @Test
    @Transactional
    void patchNonExistingTicketSLA() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketSLA.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketSLAMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ticketSLA.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketSLA))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketSLA in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTicketSLA() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketSLA.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketSLAMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketSLA))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketSLA in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTicketSLA() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketSLA.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketSLAMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(ticketSLA)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketSLA in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTicketSLA() throws Exception {
        // Initialize the database
        insertedTicketSLA = ticketSLARepository.saveAndFlush(ticketSLA);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the ticketSLA
        restTicketSLAMockMvc
            .perform(delete(ENTITY_API_URL_ID, ticketSLA.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return ticketSLARepository.count();
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

    protected TicketSLA getPersistedTicketSLA(TicketSLA ticketSLA) {
        return ticketSLARepository.findById(ticketSLA.getId()).orElseThrow();
    }

    protected void assertPersistedTicketSLAToMatchAllProperties(TicketSLA expectedTicketSLA) {
        assertTicketSLAAllPropertiesEquals(expectedTicketSLA, getPersistedTicketSLA(expectedTicketSLA));
    }

    protected void assertPersistedTicketSLAToMatchUpdatableProperties(TicketSLA expectedTicketSLA) {
        assertTicketSLAAllUpdatablePropertiesEquals(expectedTicketSLA, getPersistedTicketSLA(expectedTicketSLA));
    }
}
