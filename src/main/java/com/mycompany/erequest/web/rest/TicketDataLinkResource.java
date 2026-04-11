package com.mycompany.erequest.web.rest;

import com.mycompany.erequest.domain.TicketDataLink;
import com.mycompany.erequest.repository.TicketDataLinkRepository;
import com.mycompany.erequest.service.TicketDataLinkService;
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
 * REST controller for managing {@link com.mycompany.erequest.domain.TicketDataLink}.
 */
@RestController
@RequestMapping("/api/ticket-data-links")
public class TicketDataLinkResource {

    private static final Logger LOG = LoggerFactory.getLogger(TicketDataLinkResource.class);

    private static final String ENTITY_NAME = "ticketDataLink";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketDataLinkService ticketDataLinkService;

    private final TicketDataLinkRepository ticketDataLinkRepository;

    public TicketDataLinkResource(TicketDataLinkService ticketDataLinkService, TicketDataLinkRepository ticketDataLinkRepository) {
        this.ticketDataLinkService = ticketDataLinkService;
        this.ticketDataLinkRepository = ticketDataLinkRepository;
    }

    /**
     * {@code POST  /ticket-data-links} : Create a new ticketDataLink.
     *
     * @param ticketDataLink the ticketDataLink to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ticketDataLink, or with status {@code 400 (Bad Request)} if the ticketDataLink has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TicketDataLink> createTicketDataLink(@Valid @RequestBody TicketDataLink ticketDataLink)
        throws URISyntaxException {
        LOG.debug("REST request to save TicketDataLink : {}", ticketDataLink);
        if (ticketDataLink.getId() != null) {
            throw new BadRequestAlertException("A new ticketDataLink cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ticketDataLink = ticketDataLinkService.save(ticketDataLink);
        return ResponseEntity.created(new URI("/api/ticket-data-links/" + ticketDataLink.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ticketDataLink.getId().toString()))
            .body(ticketDataLink);
    }

    /**
     * {@code PUT  /ticket-data-links/:id} : Updates an existing ticketDataLink.
     *
     * @param id the id of the ticketDataLink to save.
     * @param ticketDataLink the ticketDataLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketDataLink,
     * or with status {@code 400 (Bad Request)} if the ticketDataLink is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ticketDataLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketDataLink> updateTicketDataLink(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TicketDataLink ticketDataLink
    ) throws URISyntaxException {
        LOG.debug("REST request to update TicketDataLink : {}, {}", id, ticketDataLink);
        if (ticketDataLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketDataLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketDataLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ticketDataLink = ticketDataLinkService.update(ticketDataLink);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketDataLink.getId().toString()))
            .body(ticketDataLink);
    }

    /**
     * {@code PATCH  /ticket-data-links/:id} : Partial updates given fields of an existing ticketDataLink, field will ignore if it is null
     *
     * @param id the id of the ticketDataLink to save.
     * @param ticketDataLink the ticketDataLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketDataLink,
     * or with status {@code 400 (Bad Request)} if the ticketDataLink is not valid,
     * or with status {@code 404 (Not Found)} if the ticketDataLink is not found,
     * or with status {@code 500 (Internal Server Error)} if the ticketDataLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TicketDataLink> partialUpdateTicketDataLink(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TicketDataLink ticketDataLink
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TicketDataLink partially : {}, {}", id, ticketDataLink);
        if (ticketDataLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketDataLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketDataLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TicketDataLink> result = ticketDataLinkService.partialUpdate(ticketDataLink);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketDataLink.getId().toString())
        );
    }

    /**
     * {@code GET  /ticket-data-links} : get all the ticketDataLinks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ticketDataLinks in body.
     */
    @GetMapping("")
    public List<TicketDataLink> getAllTicketDataLinks() {
        LOG.debug("REST request to get all TicketDataLinks");
        return ticketDataLinkService.findAll();
    }

    /**
     * {@code GET  /ticket-data-links/:id} : get the "id" ticketDataLink.
     *
     * @param id the id of the ticketDataLink to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ticketDataLink, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketDataLink> getTicketDataLink(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TicketDataLink : {}", id);
        Optional<TicketDataLink> ticketDataLink = ticketDataLinkService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ticketDataLink);
    }

    /**
     * {@code DELETE  /ticket-data-links/:id} : delete the "id" ticketDataLink.
     *
     * @param id the id of the ticketDataLink to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketDataLink(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TicketDataLink : {}", id);
        ticketDataLinkService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
