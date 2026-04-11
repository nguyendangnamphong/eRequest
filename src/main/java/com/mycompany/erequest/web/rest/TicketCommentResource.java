package com.mycompany.erequest.web.rest;

import com.mycompany.erequest.domain.TicketComment;
import com.mycompany.erequest.repository.TicketCommentRepository;
import com.mycompany.erequest.service.TicketCommentService;
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
 * REST controller for managing {@link com.mycompany.erequest.domain.TicketComment}.
 */
@RestController
@RequestMapping("/api/ticket-comments")
public class TicketCommentResource {

    private static final Logger LOG = LoggerFactory.getLogger(TicketCommentResource.class);

    private static final String ENTITY_NAME = "ticketComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketCommentService ticketCommentService;

    private final TicketCommentRepository ticketCommentRepository;

    public TicketCommentResource(TicketCommentService ticketCommentService, TicketCommentRepository ticketCommentRepository) {
        this.ticketCommentService = ticketCommentService;
        this.ticketCommentRepository = ticketCommentRepository;
    }

    /**
     * {@code POST  /ticket-comments} : Create a new ticketComment.
     *
     * @param ticketComment the ticketComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ticketComment, or with status {@code 400 (Bad Request)} if the ticketComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TicketComment> createTicketComment(@Valid @RequestBody TicketComment ticketComment) throws URISyntaxException {
        LOG.debug("REST request to save TicketComment : {}", ticketComment);
        if (ticketComment.getId() != null) {
            throw new BadRequestAlertException("A new ticketComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ticketComment = ticketCommentService.save(ticketComment);
        return ResponseEntity.created(new URI("/api/ticket-comments/" + ticketComment.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ticketComment.getId().toString()))
            .body(ticketComment);
    }

    /**
     * {@code PUT  /ticket-comments/:id} : Updates an existing ticketComment.
     *
     * @param id the id of the ticketComment to save.
     * @param ticketComment the ticketComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketComment,
     * or with status {@code 400 (Bad Request)} if the ticketComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ticketComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketComment> updateTicketComment(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TicketComment ticketComment
    ) throws URISyntaxException {
        LOG.debug("REST request to update TicketComment : {}, {}", id, ticketComment);
        if (ticketComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ticketComment = ticketCommentService.update(ticketComment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketComment.getId().toString()))
            .body(ticketComment);
    }

    /**
     * {@code PATCH  /ticket-comments/:id} : Partial updates given fields of an existing ticketComment, field will ignore if it is null
     *
     * @param id the id of the ticketComment to save.
     * @param ticketComment the ticketComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketComment,
     * or with status {@code 400 (Bad Request)} if the ticketComment is not valid,
     * or with status {@code 404 (Not Found)} if the ticketComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the ticketComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TicketComment> partialUpdateTicketComment(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TicketComment ticketComment
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TicketComment partially : {}, {}", id, ticketComment);
        if (ticketComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticketComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TicketComment> result = ticketCommentService.partialUpdate(ticketComment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticketComment.getId().toString())
        );
    }

    /**
     * {@code GET  /ticket-comments} : get all the ticketComments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ticketComments in body.
     */
    @GetMapping("")
    public List<TicketComment> getAllTicketComments() {
        LOG.debug("REST request to get all TicketComments");
        return ticketCommentService.findAll();
    }

    /**
     * {@code GET  /ticket-comments/:id} : get the "id" ticketComment.
     *
     * @param id the id of the ticketComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ticketComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketComment> getTicketComment(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TicketComment : {}", id);
        Optional<TicketComment> ticketComment = ticketCommentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ticketComment);
    }

    /**
     * {@code DELETE  /ticket-comments/:id} : delete the "id" ticketComment.
     *
     * @param id the id of the ticketComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicketComment(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TicketComment : {}", id);
        ticketCommentService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
