package com.mycompany.erequest.service;

import com.mycompany.erequest.domain.TicketAttachment;
import com.mycompany.erequest.repository.TicketAttachmentRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.erequest.domain.TicketAttachment}.
 */
@Service
@Transactional
public class TicketAttachmentService {

    private static final Logger LOG = LoggerFactory.getLogger(TicketAttachmentService.class);

    private final TicketAttachmentRepository ticketAttachmentRepository;

    public TicketAttachmentService(TicketAttachmentRepository ticketAttachmentRepository) {
        this.ticketAttachmentRepository = ticketAttachmentRepository;
    }

    /**
     * Save a ticketAttachment.
     *
     * @param ticketAttachment the entity to save.
     * @return the persisted entity.
     */
    public TicketAttachment save(TicketAttachment ticketAttachment) {
        LOG.debug("Request to save TicketAttachment : {}", ticketAttachment);
        return ticketAttachmentRepository.save(ticketAttachment);
    }

    /**
     * Update a ticketAttachment.
     *
     * @param ticketAttachment the entity to save.
     * @return the persisted entity.
     */
    public TicketAttachment update(TicketAttachment ticketAttachment) {
        LOG.debug("Request to update TicketAttachment : {}", ticketAttachment);
        return ticketAttachmentRepository.save(ticketAttachment);
    }

    /**
     * Partially update a ticketAttachment.
     *
     * @param ticketAttachment the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TicketAttachment> partialUpdate(TicketAttachment ticketAttachment) {
        LOG.debug("Request to partially update TicketAttachment : {}", ticketAttachment);

        return ticketAttachmentRepository
            .findById(ticketAttachment.getId())
            .map(existingTicketAttachment -> {
                if (ticketAttachment.getFileId() != null) {
                    existingTicketAttachment.setFileId(ticketAttachment.getFileId());
                }
                if (ticketAttachment.getFileName() != null) {
                    existingTicketAttachment.setFileName(ticketAttachment.getFileName());
                }

                return existingTicketAttachment;
            })
            .map(ticketAttachmentRepository::save);
    }

    /**
     * Get all the ticketAttachments.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TicketAttachment> findAll() {
        LOG.debug("Request to get all TicketAttachments");
        return ticketAttachmentRepository.findAll();
    }

    /**
     * Get one ticketAttachment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TicketAttachment> findOne(Long id) {
        LOG.debug("Request to get TicketAttachment : {}", id);
        return ticketAttachmentRepository.findById(id);
    }

    /**
     * Delete the ticketAttachment by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete TicketAttachment : {}", id);
        ticketAttachmentRepository.deleteById(id);
    }
}
