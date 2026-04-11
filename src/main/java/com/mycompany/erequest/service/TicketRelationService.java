package com.mycompany.erequest.service;

import com.mycompany.erequest.domain.TicketRelation;
import com.mycompany.erequest.repository.TicketRelationRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.erequest.domain.TicketRelation}.
 */
@Service
@Transactional
public class TicketRelationService {

    private static final Logger LOG = LoggerFactory.getLogger(TicketRelationService.class);

    private final TicketRelationRepository ticketRelationRepository;

    public TicketRelationService(TicketRelationRepository ticketRelationRepository) {
        this.ticketRelationRepository = ticketRelationRepository;
    }

    /**
     * Save a ticketRelation.
     *
     * @param ticketRelation the entity to save.
     * @return the persisted entity.
     */
    public TicketRelation save(TicketRelation ticketRelation) {
        LOG.debug("Request to save TicketRelation : {}", ticketRelation);
        return ticketRelationRepository.save(ticketRelation);
    }

    /**
     * Update a ticketRelation.
     *
     * @param ticketRelation the entity to save.
     * @return the persisted entity.
     */
    public TicketRelation update(TicketRelation ticketRelation) {
        LOG.debug("Request to update TicketRelation : {}", ticketRelation);
        return ticketRelationRepository.save(ticketRelation);
    }

    /**
     * Partially update a ticketRelation.
     *
     * @param ticketRelation the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TicketRelation> partialUpdate(TicketRelation ticketRelation) {
        LOG.debug("Request to partially update TicketRelation : {}", ticketRelation);

        return ticketRelationRepository
            .findById(ticketRelation.getId())
            .map(existingTicketRelation -> {
                if (ticketRelation.getRelatedTicketId() != null) {
                    existingTicketRelation.setRelatedTicketId(ticketRelation.getRelatedTicketId());
                }

                return existingTicketRelation;
            })
            .map(ticketRelationRepository::save);
    }

    /**
     * Get all the ticketRelations.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TicketRelation> findAll() {
        LOG.debug("Request to get all TicketRelations");
        return ticketRelationRepository.findAll();
    }

    /**
     * Get one ticketRelation by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TicketRelation> findOne(Long id) {
        LOG.debug("Request to get TicketRelation : {}", id);
        return ticketRelationRepository.findById(id);
    }

    /**
     * Delete the ticketRelation by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete TicketRelation : {}", id);
        ticketRelationRepository.deleteById(id);
    }
}
