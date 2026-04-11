package com.mycompany.erequest.web.rest;

import static com.mycompany.erequest.domain.TicketStepAsserts.*;
import static com.mycompany.erequest.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.erequest.IntegrationTest;
import com.mycompany.erequest.domain.TicketStep;
import com.mycompany.erequest.repository.TicketStepRepository;
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
 * Integration tests for the {@link TicketStepResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TicketStepResourceIT {

    private static final Long DEFAULT_NODE_ID = 1L;
    private static final Long UPDATED_NODE_ID = 2L;

    private static final String DEFAULT_PERFORMER_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_PERFORMER_EMAIL = "BBBBBBBBBB";

    private static final Integer DEFAULT_STATUS = 1;
    private static final Integer UPDATED_STATUS = 2;

    private static final Instant DEFAULT_STARTED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_STARTED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_FINISHED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FINISHED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/ticket-steps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TicketStepRepository ticketStepRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTicketStepMockMvc;

    private TicketStep ticketStep;

    private TicketStep insertedTicketStep;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketStep createEntity() {
        return new TicketStep()
            .nodeId(DEFAULT_NODE_ID)
            .performerEmail(DEFAULT_PERFORMER_EMAIL)
            .status(DEFAULT_STATUS)
            .startedAt(DEFAULT_STARTED_AT)
            .finishedAt(DEFAULT_FINISHED_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketStep createUpdatedEntity() {
        return new TicketStep()
            .nodeId(UPDATED_NODE_ID)
            .performerEmail(UPDATED_PERFORMER_EMAIL)
            .status(UPDATED_STATUS)
            .startedAt(UPDATED_STARTED_AT)
            .finishedAt(UPDATED_FINISHED_AT);
    }

    @BeforeEach
    public void initTest() {
        ticketStep = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTicketStep != null) {
            ticketStepRepository.delete(insertedTicketStep);
            insertedTicketStep = null;
        }
    }

    @Test
    @Transactional
    void createTicketStep() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TicketStep
        var returnedTicketStep = om.readValue(
            restTicketStepMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketStep)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TicketStep.class
        );

        // Validate the TicketStep in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTicketStepUpdatableFieldsEquals(returnedTicketStep, getPersistedTicketStep(returnedTicketStep));

        insertedTicketStep = returnedTicketStep;
    }

    @Test
    @Transactional
    void createTicketStepWithExistingId() throws Exception {
        // Create the TicketStep with an existing ID
        ticketStep.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTicketStepMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketStep)))
            .andExpect(status().isBadRequest());

        // Validate the TicketStep in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNodeIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ticketStep.setNodeId(null);

        // Create the TicketStep, which fails.

        restTicketStepMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketStep)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPerformerEmailIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ticketStep.setPerformerEmail(null);

        // Create the TicketStep, which fails.

        restTicketStepMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketStep)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ticketStep.setStatus(null);

        // Create the TicketStep, which fails.

        restTicketStepMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketStep)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTicketSteps() throws Exception {
        // Initialize the database
        insertedTicketStep = ticketStepRepository.saveAndFlush(ticketStep);

        // Get all the ticketStepList
        restTicketStepMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ticketStep.getId().intValue())))
            .andExpect(jsonPath("$.[*].nodeId").value(hasItem(DEFAULT_NODE_ID.intValue())))
            .andExpect(jsonPath("$.[*].performerEmail").value(hasItem(DEFAULT_PERFORMER_EMAIL)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].startedAt").value(hasItem(DEFAULT_STARTED_AT.toString())))
            .andExpect(jsonPath("$.[*].finishedAt").value(hasItem(DEFAULT_FINISHED_AT.toString())));
    }

    @Test
    @Transactional
    void getTicketStep() throws Exception {
        // Initialize the database
        insertedTicketStep = ticketStepRepository.saveAndFlush(ticketStep);

        // Get the ticketStep
        restTicketStepMockMvc
            .perform(get(ENTITY_API_URL_ID, ticketStep.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ticketStep.getId().intValue()))
            .andExpect(jsonPath("$.nodeId").value(DEFAULT_NODE_ID.intValue()))
            .andExpect(jsonPath("$.performerEmail").value(DEFAULT_PERFORMER_EMAIL))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.startedAt").value(DEFAULT_STARTED_AT.toString()))
            .andExpect(jsonPath("$.finishedAt").value(DEFAULT_FINISHED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTicketStep() throws Exception {
        // Get the ticketStep
        restTicketStepMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTicketStep() throws Exception {
        // Initialize the database
        insertedTicketStep = ticketStepRepository.saveAndFlush(ticketStep);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketStep
        TicketStep updatedTicketStep = ticketStepRepository.findById(ticketStep.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTicketStep are not directly saved in db
        em.detach(updatedTicketStep);
        updatedTicketStep
            .nodeId(UPDATED_NODE_ID)
            .performerEmail(UPDATED_PERFORMER_EMAIL)
            .status(UPDATED_STATUS)
            .startedAt(UPDATED_STARTED_AT)
            .finishedAt(UPDATED_FINISHED_AT);

        restTicketStepMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTicketStep.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTicketStep))
            )
            .andExpect(status().isOk());

        // Validate the TicketStep in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTicketStepToMatchAllProperties(updatedTicketStep);
    }

    @Test
    @Transactional
    void putNonExistingTicketStep() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketStep.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketStepMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ticketStep.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketStep))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketStep in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTicketStep() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketStep.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketStepMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ticketStep))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketStep in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTicketStep() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketStep.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketStepMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketStep)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketStep in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTicketStepWithPatch() throws Exception {
        // Initialize the database
        insertedTicketStep = ticketStepRepository.saveAndFlush(ticketStep);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketStep using partial update
        TicketStep partialUpdatedTicketStep = new TicketStep();
        partialUpdatedTicketStep.setId(ticketStep.getId());

        partialUpdatedTicketStep.nodeId(UPDATED_NODE_ID).status(UPDATED_STATUS).startedAt(UPDATED_STARTED_AT);

        restTicketStepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketStep.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketStep))
            )
            .andExpect(status().isOk());

        // Validate the TicketStep in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketStepUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTicketStep, ticketStep),
            getPersistedTicketStep(ticketStep)
        );
    }

    @Test
    @Transactional
    void fullUpdateTicketStepWithPatch() throws Exception {
        // Initialize the database
        insertedTicketStep = ticketStepRepository.saveAndFlush(ticketStep);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketStep using partial update
        TicketStep partialUpdatedTicketStep = new TicketStep();
        partialUpdatedTicketStep.setId(ticketStep.getId());

        partialUpdatedTicketStep
            .nodeId(UPDATED_NODE_ID)
            .performerEmail(UPDATED_PERFORMER_EMAIL)
            .status(UPDATED_STATUS)
            .startedAt(UPDATED_STARTED_AT)
            .finishedAt(UPDATED_FINISHED_AT);

        restTicketStepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketStep.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketStep))
            )
            .andExpect(status().isOk());

        // Validate the TicketStep in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketStepUpdatableFieldsEquals(partialUpdatedTicketStep, getPersistedTicketStep(partialUpdatedTicketStep));
    }

    @Test
    @Transactional
    void patchNonExistingTicketStep() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketStep.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketStepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ticketStep.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketStep))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketStep in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTicketStep() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketStep.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketStepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketStep))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketStep in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTicketStep() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketStep.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketStepMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(ticketStep)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketStep in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTicketStep() throws Exception {
        // Initialize the database
        insertedTicketStep = ticketStepRepository.saveAndFlush(ticketStep);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the ticketStep
        restTicketStepMockMvc
            .perform(delete(ENTITY_API_URL_ID, ticketStep.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return ticketStepRepository.count();
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

    protected TicketStep getPersistedTicketStep(TicketStep ticketStep) {
        return ticketStepRepository.findById(ticketStep.getId()).orElseThrow();
    }

    protected void assertPersistedTicketStepToMatchAllProperties(TicketStep expectedTicketStep) {
        assertTicketStepAllPropertiesEquals(expectedTicketStep, getPersistedTicketStep(expectedTicketStep));
    }

    protected void assertPersistedTicketStepToMatchUpdatableProperties(TicketStep expectedTicketStep) {
        assertTicketStepAllUpdatablePropertiesEquals(expectedTicketStep, getPersistedTicketStep(expectedTicketStep));
    }
}
