package com.mycompany.erequest.service;

import com.mycompany.erequest.domain.TicketComment;
import com.mycompany.erequest.repository.TicketCommentRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.erequest.domain.TicketComment}.
 */
@Service
@Transactional
public class TicketCommentService {

    private static final Logger LOG = LoggerFactory.getLogger(TicketCommentService.class);

    private final TicketCommentRepository ticketCommentRepository;

    public TicketCommentService(TicketCommentRepository ticketCommentRepository) {
        this.ticketCommentRepository = ticketCommentRepository;
    }

    /**
     * Save a ticketComment.
     *
     * @param ticketComment the entity to save.
     * @return the persisted entity.
     */
    public TicketComment save(TicketComment ticketComment) {
        LOG.debug("Request to save TicketComment : {}", ticketComment);
        return ticketCommentRepository.save(ticketComment);
    }

    /**
     * Update a ticketComment.
     *
     * @param ticketComment the entity to save.
     * @return the persisted entity.
     */
    public TicketComment update(TicketComment ticketComment) {
        LOG.debug("Request to update TicketComment : {}", ticketComment);
        return ticketCommentRepository.save(ticketComment);
    }

    /**
     * Partially update a ticketComment.
     *
     * @param ticketComment the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TicketComment> partialUpdate(TicketComment ticketComment) {
        LOG.debug("Request to partially update TicketComment : {}", ticketComment);

        return ticketCommentRepository
            .findById(ticketComment.getId())
            .map(existingTicketComment -> {
                if (ticketComment.getAuthorEmail() != null) {
                    existingTicketComment.setAuthorEmail(ticketComment.getAuthorEmail());
                }
                if (ticketComment.getContent() != null) {
                    existingTicketComment.setContent(ticketComment.getContent());
                }
                if (ticketComment.getCreatedAt() != null) {
                    existingTicketComment.setCreatedAt(ticketComment.getCreatedAt());
                }

                return existingTicketComment;
            })
            .map(ticketCommentRepository::save);
    }

    /**
     * Get all the ticketComments.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TicketComment> findAll() {
        LOG.debug("Request to get all TicketComments");
        return ticketCommentRepository.findAll();
    }

    /**
     * Get one ticketComment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TicketComment> findOne(Long id) {
        LOG.debug("Request to get TicketComment : {}", id);
        return ticketCommentRepository.findById(id);
    }

    /**
     * Delete the ticketComment by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete TicketComment : {}", id);
        ticketCommentRepository.deleteById(id);
    }
}
