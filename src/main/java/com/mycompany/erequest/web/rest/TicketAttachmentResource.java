package com.mycompany.erequest.web.rest;

import com.mycompany.erequest.domain.TicketAttachment;
import com.mycompany.erequest.repository.TicketAttachmentRepository;
import com.mycompany.erequest.service.TicketAttachmentService;
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
 * REST controller for managing {@link com.mycompany.erequest.domain.TicketAttachment}.
 */
@RestController
@RequestMapping("/api/ticket-attachments")
public class TicketAttachmentResource {

    private static final Logger LOG = LoggerFactory.getLogger(TicketAttachmentResource.class);

    private static final String ENTITY_NAME = "ticketAttachment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketAttachmentService ticketAttachmentService;

    private final TicketAttachmentRepository ticketAttachmentRepository;

    public TicketAttachmentResource(
        TicketAttachmentService ticketAttachmentService,
        TicketAttachmentRepository ticketAttachmentRepository
    ) {
        this.ticketAttachmentService = ticketAttachmentService;
        this.ticketAttachmentRepository = ticketAttachmentRepository;
    }

    /**
     * {@code POST  /ticket-attachments} : Create a new ticketAttachment.
     *
     * @param ticketAttachment the ticketAttachment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ticketAttachment, or with status {@code 400 (Bad Request)} if the ticketAttachment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TicketAttachment> createTicketAttachment(@Valid @RequestBody TicketAttachment ticketAttachment)
        throws URISyntaxException {
        LOG.debug("REST request to save TicketAttachment : {}", ticketAttachment);
        if (ticketAttachment.getId() != null) {
            throw new BadRequestAlertException("A new ticketAttachment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ticketAttachment = ticketAttachmentService.save(ticketAttachment);
        return ResponseEntity.created(new URI("/api/ticket-attachments/" + ticketAttachment.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ticketAttachment.getId().toString()))
            .body(ticketAttachment);
    }

    /**
     * {@code PUT  /ticket-attachments/:id} : Updates an existing ticketAttachment.
     *
     * @param id the id of the ticketAttachment to save.
     * @param ticketAttachment the ticketAttachment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketAttachment,
     * or with status {@code 400 (Bad Request)} if the ticketAttachment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ticketAttachment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketAttachment> updateTicketAttachment(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TicketAttachment ticketAttachment
    ) throws URISyntaxException {
        LOG.debug("REST request to update TicketAttachment : {}, {}", id, ticketAttachment);
        if (ticketAttachment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketAttachment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketAttachmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ticketAttachment = ticketAttachmentService.update(ticketAttachment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketAttachment.getId().toString()))
            .body(ticketAttachment);
    }

    /**
     * {@code PATCH  /ticket-attachments/:id} : Partial updates given fields of an existing ticketAttachment, field will ignore if it is null
     *
     * @param id the id of the ticketAttachment to save.
     * @param ticketAttachment the ticketAttachment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketAttachment,
     * or with status {@code 400 (Bad Request)} if the ticketAttachment is not valid,
     * or with status {@code 404 (Not Found)} if the ticketAttachment is not found,
     * or with status {@code 500 (Internal Server Error)} if the ticketAttachment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TicketAttachment> partialUpdateTicketAttachment(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TicketAttachment ticketAttachment
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TicketAttachment partially : {}, {}", id, ticketAttachment);
        if (ticketAttachment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketAttachment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketAttachmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TicketAttachment> result = ticketAttachmentService.partialUpdate(ticketAttachment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketAttachment.getId().toString())
        );
    }

    /**
     * {@code GET  /ticket-attachments} : get all the ticketAttachments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ticketAttachments in body.
     */
    @GetMapping("")
    public List<TicketAttachment> getAllTicketAttachments() {
        LOG.debug("REST request to get all TicketAttachments");
        return ticketAttachmentService.findAll();
    }

    /**
     * {@code GET  /ticket-attachments/:id} : get the "id" ticketAttachment.
     *
     * @param id the id of the ticketAttachment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ticketAttachment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketAttachment> getTicketAttachment(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TicketAttachment : {}", id);
        Optional<TicketAttachment> ticketAttachment = ticketAttachmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ticketAttachment);
    }

    /**
     * {@code DELETE  /ticket-attachments/:id} : delete the "id" ticketAttachment.
     *
     * @param id the id of the ticketAttachment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketAttachment(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TicketAttachment : {}", id);
        ticketAttachmentService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
