package com.mycompany.erequest.web.rest;

import com.mycompany.erequest.domain.TicketStep;
import com.mycompany.erequest.repository.TicketStepRepository;
import com.mycompany.erequest.service.TicketStepService;
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
 * REST controller for managing {@link com.mycompany.erequest.domain.TicketStep}.
 */
@RestController
@RequestMapping("/api/ticket-steps")
public class TicketStepResource {

    private static final Logger LOG = LoggerFactory.getLogger(TicketStepResource.class);

    private static final String ENTITY_NAME = "ticketStep";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketStepService ticketStepService;

    private final TicketStepRepository ticketStepRepository;

    public TicketStepResource(TicketStepService ticketStepService, TicketStepRepository ticketStepRepository) {
        this.ticketStepService = ticketStepService;
        this.ticketStepRepository = ticketStepRepository;
    }

    /**
     * {@code POST  /ticket-steps} : Create a new ticketStep.
     *
     * @param ticketStep the ticketStep to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ticketStep, or with status {@code 400 (Bad Request)} if the ticketStep has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TicketStep> createTicketStep(@Valid @RequestBody TicketStep ticketStep) throws URISyntaxException {
        LOG.debug("REST request to save TicketStep : {}", ticketStep);
        if (ticketStep.getId() != null) {
            throw new BadRequestAlertException("A new ticketStep cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ticketStep = ticketStepService.save(ticketStep);
        return ResponseEntity.created(new URI("/api/ticket-steps/" + ticketStep.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ticketStep.getId().toString()))
            .body(ticketStep);
    }

    /**
     * {@code PUT  /ticket-steps/:id} : Updates an existing ticketStep.
     *
     * @param id the id of the ticketStep to save.
     * @param ticketStep the ticketStep to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketStep,
     * or with status {@code 400 (Bad Request)} if the ticketStep is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ticketStep couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketStep> updateTicketStep(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TicketStep ticketStep
    ) throws URISyntaxException {
        LOG.debug("REST request to update TicketStep : {}, {}", id, ticketStep);
        if (ticketStep.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketStep.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketStepRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ticketStep = ticketStepService.update(ticketStep);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketStep.getId().toString()))
            .body(ticketStep);
    }

    /**
     * {@code PATCH  /ticket-steps/:id} : Partial updates given fields of an existing ticketStep, field will ignore if it is null
     *
     * @param id the id of the ticketStep to save.
     * @param ticketStep the ticketStep to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketStep,
     * or with status {@code 400 (Bad Request)} if the ticketStep is not valid,
     * or with status {@code 404 (Not Found)} if the ticketStep is not found,
     * or with status {@code 500 (Internal Server Error)} if the ticketStep couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TicketStep> partialUpdateTicketStep(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TicketStep ticketStep
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TicketStep partially : {}, {}", id, ticketStep);
        if (ticketStep.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketStep.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketStepRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TicketStep> result = ticketStepService.partialUpdate(ticketStep);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketStep.getId().toString())
        );
    }

    /**
     * {@code GET  /ticket-steps} : get all the ticketSteps.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ticketSteps in body.
     */
    @GetMapping("")
    public List<TicketStep> getAllTicketSteps() {
        LOG.debug("REST request to get all TicketSteps");
        return ticketStepService.findAll();
    }

    /**
     * {@code GET  /ticket-steps/:id} : get the "id" ticketStep.
     *
     * @param id the id of the ticketStep to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ticketStep, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketStep> getTicketStep(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TicketStep : {}", id);
        Optional<TicketStep> ticketStep = ticketStepService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ticketStep);
    }

    /**
     * {@code DELETE  /ticket-steps/:id} : delete the "id" ticketStep.
     *
     * @param id the id of the ticketStep to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketStep(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TicketStep : {}", id);
        ticketStepService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
