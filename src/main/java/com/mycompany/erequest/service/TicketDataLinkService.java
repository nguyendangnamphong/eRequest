package com.mycompany.erequest.service;

import com.mycompany.erequest.domain.TicketDataLink;
import com.mycompany.erequest.repository.TicketDataLinkRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.erequest.domain.TicketDataLink}.
 */
@Service
@Transactional
public class TicketDataLinkService {

    private static final Logger LOG = LoggerFactory.getLogger(TicketDataLinkService.class);

    private final TicketDataLinkRepository ticketDataLinkRepository;

    public TicketDataLinkService(TicketDataLinkRepository ticketDataLinkRepository) {
        this.ticketDataLinkRepository = ticketDataLinkRepository;
    }

    /**
     * Save a ticketDataLink.
     *
     * @param ticketDataLink the entity to save.
     * @return the persisted entity.
     */
    public TicketDataLink save(TicketDataLink ticketDataLink) {
        LOG.debug("Request to save TicketDataLink : {}", ticketDataLink);
        return ticketDataLinkRepository.save(ticketDataLink);
    }

    /**
     * Update a ticketDataLink.
     *
     * @param ticketDataLink the entity to save.
     * @return the persisted entity.
     */
    public TicketDataLink update(TicketDataLink ticketDataLink) {
        LOG.debug("Request to update TicketDataLink : {}", ticketDataLink);
        return ticketDataLinkRepository.save(ticketDataLink);
    }

    /**
     * Partially update a ticketDataLink.
     *
     * @param ticketDataLink the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TicketDataLink> partialUpdate(TicketDataLink ticketDataLink) {
        LOG.debug("Request to partially update TicketDataLink : {}", ticketDataLink);

        return ticketDataLinkRepository
            .findById(ticketDataLink.getId())
            .map(existingTicketDataLink -> {
                if (ticketDataLink.getNodeId() != null) {
                    existingTicketDataLink.setNodeId(ticketDataLink.getNodeId());
                }
                if (ticketDataLink.getFormDataId() != null) {
                    existingTicketDataLink.setFormDataId(ticketDataLink.getFormDataId());
                }
                if (ticketDataLink.getParentFormDataId() != null) {
                    existingTicketDataLink.setParentFormDataId(ticketDataLink.getParentFormDataId());
                }

                return existingTicketDataLink;
            })
            .map(ticketDataLinkRepository::save);
    }

    /**
     * Get all the ticketDataLinks.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TicketDataLink> findAll() {
        LOG.debug("Request to get all TicketDataLinks");
        return ticketDataLinkRepository.findAll();
    }

    /**
     * Get one ticketDataLink by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TicketDataLink> findOne(Long id) {
        LOG.debug("Request to get TicketDataLink : {}", id);
        return ticketDataLinkRepository.findById(id);
    }

    /**
     * Delete the ticketDataLink by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete TicketDataLink : {}", id);
        ticketDataLinkRepository.deleteById(id);
    }
}
