package com.mycompany.erequest.repository;

import com.mycompany.erequest.domain.TicketRelation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TicketRelation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketRelationRepository extends JpaRepository<TicketRelation, Long> {}
