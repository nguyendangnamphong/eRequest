package com.mycompany.erequest.service;

import com.mycompany.erequest.domain.TicketSLA;
import com.mycompany.erequest.repository.TicketSLARepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.erequest.domain.TicketSLA}.
 */
@Service
@Transactional
public class TicketSLAService {

    private static final Logger LOG = LoggerFactory.getLogger(TicketSLAService.class);

    private final TicketSLARepository ticketSLARepository;

    public TicketSLAService(TicketSLARepository ticketSLARepository) {
        this.ticketSLARepository = ticketSLARepository;
    }

    /**
     * Save a ticketSLA.
     *
     * @param ticketSLA the entity to save.
     * @return the persisted entity.
     */
    public TicketSLA save(TicketSLA ticketSLA) {
        LOG.debug("Request to save TicketSLA : {}", ticketSLA);
        return ticketSLARepository.save(ticketSLA);
    }

    /**
     * Update a ticketSLA.
     *
     * @param ticketSLA the entity to save.
     * @return the persisted entity.
     */
    public TicketSLA update(TicketSLA ticketSLA) {
        LOG.debug("Request to update TicketSLA : {}", ticketSLA);
        return ticketSLARepository.save(ticketSLA);
    }

    /**
     * Partially update a ticketSLA.
     *
     * @param ticketSLA the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TicketSLA> partialUpdate(TicketSLA ticketSLA) {
        LOG.debug("Request to partially update TicketSLA : {}", ticketSLA);

        return ticketSLARepository
            .findById(ticketSLA.getId())
            .map(existingTicketSLA -> {
                if (ticketSLA.getDeadline() != null) {
                    existingTicketSLA.setDeadline(ticketSLA.getDeadline());
                }
                if (ticketSLA.getRemindAt() != null) {
                    existingTicketSLA.setRemindAt(ticketSLA.getRemindAt());
                }

                return existingTicketSLA;
            })
            .map(ticketSLARepository::save);
    }

    /**
     * Get all the ticketSLAS.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TicketSLA> findAll() {
        LOG.debug("Request to get all TicketSLAS");
        return ticketSLARepository.findAll();
    }

    /**
     *  Get all the ticketSLAS where Step is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TicketSLA> findAllWhereStepIsNull() {
        LOG.debug("Request to get all ticketSLAS where Step is null");
        return StreamSupport.stream(ticketSLARepository.findAll().spliterator(), false)
            .filter(ticketSLA -> ticketSLA.getStep() == null)
            .toList();
    }

    /**
     * Get one ticketSLA by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TicketSLA> findOne(Long id) {
        LOG.debug("Request to get TicketSLA : {}", id);
        return ticketSLARepository.findById(id);
    }

    /**
     * Delete the ticketSLA by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete TicketSLA : {}", id);
        ticketSLARepository.deleteById(id);
    }
}
