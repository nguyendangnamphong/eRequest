package com.mycompany.erequest.web.rest;

import com.mycompany.erequest.domain.TicketSLA;
import com.mycompany.erequest.repository.TicketSLARepository;
import com.mycompany.erequest.service.TicketSLAService;
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
 * REST controller for managing {@link com.mycompany.erequest.domain.TicketSLA}.
 */
@RestController
@RequestMapping("/api/ticket-slas")
public class TicketSLAResource {

    private static final Logger LOG = LoggerFactory.getLogger(TicketSLAResource.class);

    private static final String ENTITY_NAME = "ticketSLA";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketSLAService ticketSLAService;

    private final TicketSLARepository ticketSLARepository;

    public TicketSLAResource(TicketSLAService ticketSLAService, TicketSLARepository ticketSLARepository) {
        this.ticketSLAService = ticketSLAService;
        this.ticketSLARepository = ticketSLARepository;
    }

    /**
     * {@code POST  /ticket-slas} : Create a new ticketSLA.
     *
     * @param ticketSLA the ticketSLA to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ticketSLA, or with status {@code 400 (Bad Request)} if the ticketSLA has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TicketSLA> createTicketSLA(@Valid @RequestBody TicketSLA ticketSLA) throws URISyntaxException {
        LOG.debug("REST request to save TicketSLA : {}", ticketSLA);
        if (ticketSLA.getId() != null) {
            throw new BadRequestAlertException("A new ticketSLA cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ticketSLA = ticketSLAService.save(ticketSLA);
        return ResponseEntity.created(new URI("/api/ticket-slas/" + ticketSLA.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ticketSLA.getId().toString()))
            .body(ticketSLA);
    }

    /**
     * {@code PUT  /ticket-slas/:id} : Updates an existing ticketSLA.
     *
     * @param id the id of the ticketSLA to save.
     * @param ticketSLA the ticketSLA to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketSLA,
     * or with status {@code 400 (Bad Request)} if the ticketSLA is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ticketSLA couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketSLA> updateTicketSLA(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TicketSLA ticketSLA
    ) throws URISyntaxException {
        LOG.debug("REST request to update TicketSLA : {}, {}", id, ticketSLA);
        if (ticketSLA.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketSLA.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketSLARepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ticketSLA = ticketSLAService.update(ticketSLA);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketSLA.getId().toString()))
            .body(ticketSLA);
    }

    /**
     * {@code PATCH  /ticket-slas/:id} : Partial updates given fields of an existing ticketSLA, field will ignore if it is null
     *
     * @param id the id of the ticketSLA to save.
     * @param ticketSLA the ticketSLA to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketSLA,
     * or with status {@code 400 (Bad Request)} if the ticketSLA is not valid,
     * or with status {@code 404 (Not Found)} if the ticketSLA is not found,
     * or with status {@code 500 (Internal Server Error)} if the ticketSLA couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TicketSLA> partialUpdateTicketSLA(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TicketSLA ticketSLA
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TicketSLA partially : {}, {}", id, ticketSLA);
        if (ticketSLA.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketSLA.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketSLARepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TicketSLA> result = ticketSLAService.partialUpdate(ticketSLA);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketSLA.getId().toString())
        );
    }

    /**
     * {@code GET  /ticket-slas} : get all the ticketSLAS.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ticketSLAS in body.
     */
    @GetMapping("")
    public List<TicketSLA> getAllTicketSLAS(@RequestParam(name = "filter", required = false) String filter) {
        if ("step-is-null".equals(filter)) {
            LOG.debug("REST request to get all TicketSLAs where step is null");
            return ticketSLAService.findAllWhereStepIsNull();
        }
        LOG.debug("REST request to get all TicketSLAS");
        return ticketSLAService.findAll();
    }

    /**
     * {@code GET  /ticket-slas/:id} : get the "id" ticketSLA.
     *
     * @param id the id of the ticketSLA to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ticketSLA, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketSLA> getTicketSLA(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TicketSLA : {}", id);
        Optional<TicketSLA> ticketSLA = ticketSLAService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ticketSLA);
    }

    /**
     * {@code DELETE  /ticket-slas/:id} : delete the "id" ticketSLA.
     *
     * @param id the id of the ticketSLA to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketSLA(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TicketSLA : {}", id);
        ticketSLAService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
