package com.mycompany.erequest.repository;

import com.mycompany.erequest.domain.TicketStep;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TicketStep entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketStepRepository extends JpaRepository<TicketStep, Long> {}
