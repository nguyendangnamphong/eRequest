package com.mycompany.erequest.service;

import com.mycompany.erequest.domain.Ticket;
import com.mycompany.erequest.repository.TicketRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.erequest.domain.Ticket}.
 */
@Service
@Transactional
public class TicketService {

    private static final Logger LOG = LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    /**
     * Save a ticket.
     *
     * @param ticket the entity to save.
     * @return the persisted entity.
     */
    public Ticket save(Ticket ticket) {
        LOG.debug("Request to save Ticket : {}", ticket);
        return ticketRepository.save(ticket);
    }

    /**
     * Update a ticket.
     *
     * @param ticket the entity to save.
     * @return the persisted entity.
     */
    public Ticket update(Ticket ticket) {
        LOG.debug("Request to update Ticket : {}", ticket);
        return ticketRepository.save(ticket);
    }

    /**
     * Partially update a ticket.
     *
     * @param ticket the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Ticket> partialUpdate(Ticket ticket) {
        LOG.debug("Request to partially update Ticket : {}", ticket);

        return ticketRepository
            .findById(ticket.getId())
            .map(existingTicket -> {
                if (ticket.getFlowId() != null) {
                    existingTicket.setFlowId(ticket.getFlowId());
                }
                if (ticket.getTicketName() != null) {
                    existingTicket.setTicketName(ticket.getTicketName());
                }
                if (ticket.getCreatorEmail() != null) {
                    existingTicket.setCreatorEmail(ticket.getCreatorEmail());
                }
                if (ticket.getCurrentStepId() != null) {
                    existingTicket.setCurrentStepId(ticket.getCurrentStepId());
                }
                if (ticket.getStatus() != null) {
                    existingTicket.setStatus(ticket.getStatus());
                }
                if (ticket.getPriority() != null) {
                    existingTicket.setPriority(ticket.getPriority());
                }
                if (ticket.getVersion() != null) {
                    existingTicket.setVersion(ticket.getVersion());
                }
                if (ticket.getCreatedAt() != null) {
                    existingTicket.setCreatedAt(ticket.getCreatedAt());
                }
                if (ticket.getUpdatedAt() != null) {
                    existingTicket.setUpdatedAt(ticket.getUpdatedAt());
                }
                if (ticket.getCompletedAt() != null) {
                    existingTicket.setCompletedAt(ticket.getCompletedAt());
                }

                return existingTicket;
            })
            .map(ticketRepository::save);
    }

    /**
     * Get all the tickets.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Ticket> findAll(Pageable pageable) {
        LOG.debug("Request to get all Tickets");
        return ticketRepository.findAll(pageable);
    }

    /**
     * Get one ticket by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Ticket> findOne(Long id) {
        LOG.debug("Request to get Ticket : {}", id);
        return ticketRepository.findById(id);
    }

    /**
     * Delete the ticket by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Ticket : {}", id);
        ticketRepository.deleteById(id);
    }
}
