package com.mycompany.erequest.web.rest;

import static com.mycompany.erequest.domain.TicketDataLinkAsserts.*;
import static com.mycompany.erequest.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.erequest.IntegrationTest;
import com.mycompany.erequest.domain.TicketDataLink;
import com.mycompany.erequest.repository.TicketDataLinkRepository;
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
 * Integration tests for the {@link TicketDataLinkResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TicketDataLinkResourceIT {

    private static final Long DEFAULT_NODE_ID = 1L;
    private static final Long UPDATED_NODE_ID = 2L;

    private static final String DEFAULT_FORM_DATA_ID = "AAAAAAAAAA";
    private static final String UPDATED_FORM_DATA_ID = "BBBBBBBBBB";

    private static final String DEFAULT_PARENT_FORM_DATA_ID = "AAAAAAAAAA";
    private static final String UPDATED_PARENT_FORM_DATA_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ticket-data-links";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TicketDataLinkRepository ticketDataLinkRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTicketDataLinkMockMvc;

    private TicketDataLink ticketDataLink;

    private TicketDataLink insertedTicketDataLink;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketDataLink createEntity() {
        return new TicketDataLink().nodeId(DEFAULT_NODE_ID).formDataId(DEFAULT_FORM_DATA_ID).parentFormDataId(DEFAULT_PARENT_FORM_DATA_ID);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketDataLink createUpdatedEntity() {
        return new TicketDataLink().nodeId(UPDATED_NODE_ID).formDataId(UPDATED_FORM_DATA_ID).parentFormDataId(UPDATED_PARENT_FORM_DATA_ID);
    }

    @BeforeEach
    public void initTest() {
        ticketDataLink = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTicketDataLink != null) {
            ticketDataLinkRepository.delete(insertedTicketDataLink);
            insertedTicketDataLink = null;
        }
    }

    @Test
    @Transactional
    void createTicketDataLink() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TicketDataLink
        var returnedTicketDataLink = om.readValue(
            restTicketDataLinkMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketDataLink)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TicketDataLink.class
        );

        // Validate the TicketDataLink in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTicketDataLinkUpdatableFieldsEquals(returnedTicketDataLink, getPersistedTicketDataLink(returnedTicketDataLink));

        insertedTicketDataLink = returnedTicketDataLink;
    }

    @Test
    @Transactional
    void createTicketDataLinkWithExistingId() throws Exception {
        // Create the TicketDataLink with an existing ID
        ticketDataLink.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTicketDataLinkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketDataLink)))
            .andExpect(status().isBadRequest());

        // Validate the TicketDataLink in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNodeIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ticketDataLink.setNodeId(null);

        // Create the TicketDataLink, which fails.

        restTicketDataLinkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketDataLink)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkFormDataIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ticketDataLink.setFormDataId(null);

        // Create the TicketDataLink, which fails.

        restTicketDataLinkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketDataLink)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTicketDataLinks() throws Exception {
        // Initialize the database
        insertedTicketDataLink = ticketDataLinkRepository.saveAndFlush(ticketDataLink);

        // Get all the ticketDataLinkList
        restTicketDataLinkMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ticketDataLink.getId().intValue())))
            .andExpect(jsonPath("$.[*].nodeId").value(hasItem(DEFAULT_NODE_ID.intValue())))
            .andExpect(jsonPath("$.[*].formDataId").value(hasItem(DEFAULT_FORM_DATA_ID)))
            .andExpect(jsonPath("$.[*].parentFormDataId").value(hasItem(DEFAULT_PARENT_FORM_DATA_ID)));
    }

    @Test
    @Transactional
    void getTicketDataLink() throws Exception {
        // Initialize the database
        insertedTicketDataLink = ticketDataLinkRepository.saveAndFlush(ticketDataLink);

        // Get the ticketDataLink
        restTicketDataLinkMockMvc
            .perform(get(ENTITY_API_URL_ID, ticketDataLink.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ticketDataLink.getId().intValue()))
            .andExpect(jsonPath("$.nodeId").value(DEFAULT_NODE_ID.intValue()))
            .andExpect(jsonPath("$.formDataId").value(DEFAULT_FORM_DATA_ID))
            .andExpect(jsonPath("$.parentFormDataId").value(DEFAULT_PARENT_FORM_DATA_ID));
    }

    @Test
    @Transactional
    void getNonExistingTicketDataLink() throws Exception {
        // Get the ticketDataLink
        restTicketDataLinkMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTicketDataLink() throws Exception {
        // Initialize the database
        insertedTicketDataLink = ticketDataLinkRepository.saveAndFlush(ticketDataLink);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketDataLink
        TicketDataLink updatedTicketDataLink = ticketDataLinkRepository.findById(ticketDataLink.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTicketDataLink are not directly saved in db
        em.detach(updatedTicketDataLink);
        updatedTicketDataLink.nodeId(UPDATED_NODE_ID).formDataId(UPDATED_FORM_DATA_ID).parentFormDataId(UPDATED_PARENT_FORM_DATA_ID);

        restTicketDataLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTicketDataLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTicketDataLink))
            )
            .andExpect(status().isOk());

        // Validate the TicketDataLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTicketDataLinkToMatchAllProperties(updatedTicketDataLink);
    }

    @Test
    @Transactional
    void putNonExistingTicketDataLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketDataLink.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketDataLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ticketDataLink.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ticketDataLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketDataLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTicketDataLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketDataLink.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketDataLinkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ticketDataLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketDataLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTicketDataLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketDataLink.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketDataLinkMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ticketDataLink)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketDataLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTicketDataLinkWithPatch() throws Exception {
        // Initialize the database
        insertedTicketDataLink = ticketDataLinkRepository.saveAndFlush(ticketDataLink);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketDataLink using partial update
        TicketDataLink partialUpdatedTicketDataLink = new TicketDataLink();
        partialUpdatedTicketDataLink.setId(ticketDataLink.getId());

        partialUpdatedTicketDataLink.formDataId(UPDATED_FORM_DATA_ID).parentFormDataId(UPDATED_PARENT_FORM_DATA_ID);

        restTicketDataLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketDataLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketDataLink))
            )
            .andExpect(status().isOk());

        // Validate the TicketDataLink in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketDataLinkUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTicketDataLink, ticketDataLink),
            getPersistedTicketDataLink(ticketDataLink)
        );
    }

    @Test
    @Transactional
    void fullUpdateTicketDataLinkWithPatch() throws Exception {
        // Initialize the database
        insertedTicketDataLink = ticketDataLinkRepository.saveAndFlush(ticketDataLink);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ticketDataLink using partial update
        TicketDataLink partialUpdatedTicketDataLink = new TicketDataLink();
        partialUpdatedTicketDataLink.setId(ticketDataLink.getId());

        partialUpdatedTicketDataLink.nodeId(UPDATED_NODE_ID).formDataId(UPDATED_FORM_DATA_ID).parentFormDataId(UPDATED_PARENT_FORM_DATA_ID);

        restTicketDataLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTicketDataLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTicketDataLink))
            )
            .andExpect(status().isOk());

        // Validate the TicketDataLink in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTicketDataLinkUpdatableFieldsEquals(partialUpdatedTicketDataLink, getPersistedTicketDataLink(partialUpdatedTicketDataLink));
    }

    @Test
    @Transactional
    void patchNonExistingTicketDataLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketDataLink.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketDataLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ticketDataLink.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketDataLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketDataLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTicketDataLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketDataLink.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketDataLinkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ticketDataLink))
            )
            .andExpect(status().isBadRequest());

        // Validate the TicketDataLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTicketDataLink() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ticketDataLink.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTicketDataLinkMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(ticketDataLink)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TicketDataLink in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTicketDataLink() throws Exception {
        // Initialize the database
        insertedTicketDataLink = ticketDataLinkRepository.saveAndFlush(ticketDataLink);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the ticketDataLink
        restTicketDataLinkMockMvc
            .perform(delete(ENTITY_API_URL_ID, ticketDataLink.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return ticketDataLinkRepository.count();
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

    protected TicketDataLink getPersistedTicketDataLink(TicketDataLink ticketDataLink) {
        return ticketDataLinkRepository.findById(ticketDataLink.getId()).orElseThrow();
    }

    protected void assertPersistedTicketDataLinkToMatchAllProperties(TicketDataLink expectedTicketDataLink) {
        assertTicketDataLinkAllPropertiesEquals(expectedTicketDataLink, getPersistedTicketDataLink(expectedTicketDataLink));
    }

    protected void assertPersistedTicketDataLinkToMatchUpdatableProperties(TicketDataLink expectedTicketDataLink) {
        assertTicketDataLinkAllUpdatablePropertiesEquals(expectedTicketDataLink, getPersistedTicketDataLink(expectedTicketDataLink));
    }
}
