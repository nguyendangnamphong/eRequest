package com.mycompany.erequest.repository;

import com.mycompany.erequest.domain.TicketDataLink;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TicketDataLink entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketDataLinkRepository extends JpaRepository<TicketDataLink, Long> {}
