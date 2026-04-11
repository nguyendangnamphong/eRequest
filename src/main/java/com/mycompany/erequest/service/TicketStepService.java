package com.mycompany.erequest.service;

import com.mycompany.erequest.domain.TicketStep;
import com.mycompany.erequest.repository.TicketStepRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.erequest.domain.TicketStep}.
 */
@Service
@Transactional
public class TicketStepService {

    private static final Logger LOG = LoggerFactory.getLogger(TicketStepService.class);

    private final TicketStepRepository ticketStepRepository;

    public TicketStepService(TicketStepRepository ticketStepRepository) {
        this.ticketStepRepository = ticketStepRepository;
    }

    /**
     * Save a ticketStep.
     *
     * @param ticketStep the entity to save.
     * @return the persisted entity.
     */
    public TicketStep save(TicketStep ticketStep) {
        LOG.debug("Request to save TicketStep : {}", ticketStep);
        return ticketStepRepository.save(ticketStep);
    }

    /**
     * Update a ticketStep.
     *
     * @param ticketStep the entity to save.
     * @return the persisted entity.
     */
    public TicketStep update(TicketStep ticketStep) {
        LOG.debug("Request to update TicketStep : {}", ticketStep);
        return ticketStepRepository.save(ticketStep);
    }

    /**
     * Partially update a ticketStep.
     *
     * @param ticketStep the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TicketStep> partialUpdate(TicketStep ticketStep) {
        LOG.debug("Request to partially update TicketStep : {}", ticketStep);

        return ticketStepRepository
            .findById(ticketStep.getId())
            .map(existingTicketStep -> {
                if (ticketStep.getNodeId() != null) {
                    existingTicketStep.setNodeId(ticketStep.getNodeId());
                }
                if (ticketStep.getPerformerEmail() != null) {
                    existingTicketStep.setPerformerEmail(ticketStep.getPerformerEmail());
                }
                if (ticketStep.getStatus() != null) {
                    existingTicketStep.setStatus(ticketStep.getStatus());
                }
                if (ticketStep.getStartedAt() != null) {
                    existingTicketStep.setStartedAt(ticketStep.getStartedAt());
                }
                if (ticketStep.getFinishedAt() != null) {
                    existingTicketStep.setFinishedAt(ticketStep.getFinishedAt());
                }

                return existingTicketStep;
            })
            .map(ticketStepRepository::save);
    }

    /**
     * Get all the ticketSteps.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TicketStep> findAll() {
        LOG.debug("Request to get all TicketSteps");
        return ticketStepRepository.findAll();
    }

    /**
     * Get one ticketStep by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TicketStep> findOne(Long id) {
        LOG.debug("Request to get TicketStep : {}", id);
        return ticketStepRepository.findById(id);
    }

    /**
     * Delete the ticketStep by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete TicketStep : {}", id);
        ticketStepRepository.deleteById(id);
    }
}
