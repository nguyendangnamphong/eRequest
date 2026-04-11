package com.mycompany.erequest.web.rest;

import com.mycompany.erequest.domain.TicketRelation;
import com.mycompany.erequest.repository.TicketRelationRepository;
import com.mycompany.erequest.service.TicketRelationService;
import com.mycompany.erequest.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.erequest.domain.TicketRelation}.
 */
@RestController
@RequestMapping("/api/ticket-relations")
public class TicketRelationResource {

    private static final Logger LOG = LoggerFactory.getLogger(TicketRelationResource.class);

    private static final String ENTITY_NAME = "ticketRelation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketRelationService ticketRelationService;

    private final TicketRelationRepository ticketRelationRepository;

    public TicketRelationResource(TicketRelationService ticketRelationService, TicketRelationRepository ticketRelationRepository) {
        this.ticketRelationService = ticketRelationService;
        this.ticketRelationRepository = ticketRelationRepository;
    }

    /**
     * {@code POST  /ticket-relations} : Create a new ticketRelation.
     *
     * @param ticketRelation the ticketRelation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ticketRelation, or with status {@code 400 (Bad Request)} if the ticketRelation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TicketRelation> createTicketRelation(@Valid @RequestBody TicketRelation ticketRelation)
        throws URISyntaxException {
        LOG.debug("REST request to save TicketRelation : {}", ticketRelation);
        if (ticketRelation.getId() != null) {
            throw new BadRequestAlertException("A new ticketRelation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ticketRelation = ticketRelationService.save(ticketRelation);
        return ResponseEntity.created(new URI("/api/ticket-relations/" + ticketRelation.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ticketRelation.getId().toString()))
            .body(ticketRelation);
    }

    /**
     * {@code PUT  /ticket-relations/:id} : Updates an existing ticketRelation.
     *
     * @param id the id of the ticketRelation to save.
     * @param ticketRelation the ticketRelation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketRelation,
     * or with status {@code 400 (Bad Request)} if the ticketRelation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ticketRelation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketRelation> updateTicketRelation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TicketRelation ticketRelation
    ) throws URISyntaxException {
        LOG.debug("REST request to update TicketRelation : {}, {}", id, ticketRelation);
        if (ticketRelation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketRelation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketRelationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ticketRelation = ticketRelationService.update(ticketRelation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketRelation.getId().toString()))
            .body(ticketRelation);
    }

    /**
     * {@code PATCH  /ticket-relations/:id} : Partial updates given fields of an existing ticketRelation, field will ignore if it is null
     *
     * @param id the id of the ticketRelation to save.
     * @param ticketRelation the ticketRelation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketRelation,
     * or with status {@code 400 (Bad Request)} if the ticketRelation is not valid,
     * or with status {@code 404 (Not Found)} if the ticketRelation is not found,
     * or with status {@code 500 (Internal Server Error)} if the ticketRelation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TicketRelation> partialUpdateTicketRelation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TicketRelation ticketRelation
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TicketRelation partially : {}, {}", id, ticketRelation);
        if (ticketRelation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketRelation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketRelationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TicketRelation> result = ticketRelationService.partialUpdate(ticketRelation);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketRelation.getId().toString())
        );
    }

    /**
     * {@code GET  /ticket-relations} : get all the ticketRelations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ticketRelations in body.
     */
    @GetMapping("")
    public List<TicketRelation> getAllTicketRelations() {
        LOG.debug("REST request to get all TicketRelations");
        return ticketRelationService.findAll();
    }

    /**
     * {@code GET  /ticket-relations/:id} : get the "id" ticketRelation.
     *
     * @param id the id of the ticketRelation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ticketRelation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketRelation> getTicketRelation(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TicketRelation : {}", id);
        Optional<TicketRelation> ticketRelation = ticketRelationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ticketRelation);
    }

    /**
     * {@code DELETE  /ticket-relations/:id} : delete the "id" ticketRelation.
     *
     * @param id the id of the ticketRelation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketRelation(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TicketRelation : {}", id);
        ticketRelationService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
