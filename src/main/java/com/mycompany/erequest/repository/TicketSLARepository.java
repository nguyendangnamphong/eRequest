package com.mycompany.erequest.repository;

import com.mycompany.erequest.domain.TicketSLA;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TicketSLA entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketSLARepository extends JpaRepository<TicketSLA, Long> {}
